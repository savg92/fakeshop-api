import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { FakestoreService } from '../external/fakestore/fakestore.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly fakestoreService: FakestoreService,
  ) {}

  /**
   * Get all products combining local and FakeStore API data
   */
  async findAll(): Promise<Product[]> {
    // Get products from FakeStore API
    const externalProducts = await this.fakestoreService.getAllProducts();

    // Get all local products
    const localProducts = await this.productRepository.find();

    // Map external products to Product entity and add random stock
    const mappedExternalProducts = externalProducts.map((extProduct) => {
      // Check if we have this product locally
      const localProduct = localProducts.find(
        (local) => local.id === extProduct.id,
      );

      if (localProduct) {
        return localProduct;
      }

      // Create a new product with random stock
      const product = new Product();
      product.id = extProduct.id;
      product.title = extProduct.title;
      product.price = extProduct.price;
      product.description = extProduct.description;
      product.category = extProduct.category;
      product.image = extProduct.image;
      product.stock = Math.floor(Math.random() * 100); // Random stock between 0 and 99
      product.isLocal = false;

      return product;
    });

    // Filter local products that are not in the external products list
    const uniqueLocalProducts = localProducts.filter(
      (local) => !mappedExternalProducts.some((ext) => ext.id === local.id),
    );

    // Combine both arrays
    return [...mappedExternalProducts, ...uniqueLocalProducts];
  }

  /**
   * Get a product by ID combining local and FakeStore API data
   * @param id The product ID
   */
  async findOne(id: number): Promise<Product> {
    // First check if we have the product locally
    const localProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (localProduct) {
      return localProduct;
    }

    // If not found locally, get from FakeStore API
    try {
      const externalProduct = await this.fakestoreService.getProductById(id);

      // Map external product to Product entity and add random stock
      const product = new Product();
      product.id = externalProduct.id;
      product.title = externalProduct.title;
      product.price = externalProduct.price;
      product.description = externalProduct.description;
      product.category = externalProduct.category;
      product.image = externalProduct.image;
      product.stock = Math.floor(Math.random() * 100); // Random stock between 0 and 99
      product.isLocal = false;

      return product;
    } catch (error) {
      this.logger.error(
        `Failed to find product with id ${id}: ${(error as Error).message}`,
      );
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  /**
   * Create a new product locally with a guaranteed high ID that won't conflict
   * @param createProductDto The product data
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Step 1: Get highest local ID
      const localProducts = await this.productRepository.find({
        order: { id: 'DESC' },
        take: 10,
      });

      const highestLocalId =
        localProducts.length > 0
          ? Math.max(...localProducts.map((p) => p.id))
          : 0;

      // Step 2: Get highest external ID
      let highestExternalId = 0;
      try {
        const externalProducts = await this.fakestoreService.getAllProducts();

        if (externalProducts && externalProducts.length > 0) {
          // Type-safe extraction of valid numeric IDs
          const externalIds: number[] = externalProducts
            .map((p) => {
              // Handle different ID types safely
              if (typeof p.id === 'number') return p.id;
              if (typeof p.id === 'string') {
                const parsed = parseInt(p.id, 10);
                return !isNaN(parsed) ? parsed : 0;
              }
              return 0;
            })
            .filter((id) => id > 0);

          if (externalIds.length > 0) {
            highestExternalId = Math.max(...externalIds);
            this.logger.log(
              `Highest external product ID: ${highestExternalId}`,
            );
          }
        }
      } catch (error) {
        this.logger.warn(
          `Could not fetch external products: ${error instanceof Error ? error.message : String(error)}`,
        );
        // Continue with highestExternalId = 0
      }

      // Step 3: Calculate final ID with safety margins
      const BASE_ID = 1000000; // One million
      const finalId = Math.max(
        BASE_ID,
        highestLocalId + 1,
        highestExternalId + 100000,
      );

      this.logger.log(
        `Creating product with ID ${finalId} (highest local: ${highestLocalId}, highest external: ${highestExternalId})`,
      );

      // Step 4: Create and save product with explicit ID
      const product = this.productRepository.create({
        ...createProductDto,
        id: finalId,
        stock: Math.floor(Math.random() * 100),
        isLocal: true,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      // Handle errors with type safety
      this.logger.error(
        `Failed to create product: ${error instanceof Error ? error.message : String(error)}`,
      );

      // Emergency fallback with even higher ID
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 10000);
      const fallbackId = 2000000 + (timestamp % 1000000) + random;

      this.logger.log(`Using emergency fallback ID ${fallbackId}`);

      const product = this.productRepository.create({
        ...createProductDto,
        id: fallbackId,
        stock: Math.floor(Math.random() * 100),
        isLocal: true,
      });

      return await this.productRepository.save(product);
    }
  }

  /**
   * Update the stock of a product
   * @param id The product ID
   * @param updateStockDto The stock data
   */
  async updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<Product> {
    // First check if we have the product locally
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      // If not found locally, we'll create it from the external API
      try {
        const externalProduct = await this.fakestoreService.getProductById(id);

        // Create and save the product locally
        const newProduct = this.productRepository.create({
          id: externalProduct.id,
          title: externalProduct.title,
          price: externalProduct.price,
          description: externalProduct.description,
          category: externalProduct.category,
          image: externalProduct.image,
          stock: updateStockDto.stock,
          isLocal: true,
        });

        return this.productRepository.save(newProduct);
      } catch (error) {
        this.logger.error(
          `Failed to find product with id ${id}: ${(error as Error).message}`,
        );
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
    }

    // Update the stock
    product.stock = updateStockDto.stock;
    return this.productRepository.save(product);
  }

  /**
   * Delete a product
   * @param id The product ID
   */
  async remove(id: number): Promise<void> {
    // First check if we have the product locally
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${id} not found in local database`,
      );
    }

    await this.productRepository.remove(product);
  }
}

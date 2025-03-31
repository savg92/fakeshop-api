/**
 * Service handling all product-related business logic.
 * Manages both local products and integration with external FakeStore API.
 */
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
   * Get all products by combining local database products with external FakeStore API products.
   * For external products, generates random stock values if not found locally.
   * @returns Promise<Product[]> Array of all products
   */
  async findAll(): Promise<Product[]> {
    // Fetch products from external API
    const externalProducts = await this.fakestoreService.getAllProducts();

    // Get local products from database
    const localProducts = await this.productRepository.find();

    // Map external products, using local data if available
    const mappedExternalProducts = externalProducts.map((extProduct) => {
      const localProduct = localProducts.find(
        (local) => local.id === extProduct.id,
      );

      if (localProduct) {
        return localProduct;
      }

      // Create a new product with random stock if not found locally
      const product = new Product();
      product.id = extProduct.id;
      product.title = extProduct.title;
      product.price = extProduct.price;
      product.description = extProduct.description;
      product.category = extProduct.category;
      product.image = extProduct.image;
      product.stock = Math.floor(Math.random() * 100);
      product.isLocal = false;

      return product;
    });

    // Filter local products that don't exist in external API
    const uniqueLocalProducts = localProducts.filter(
      (local) => !mappedExternalProducts.some((ext) => ext.id === local.id),
    );

    // Combine external and unique local products
    return [...mappedExternalProducts, ...uniqueLocalProducts];
  }

  /**
   * Find a specific product by ID, checking both local database and external API.
   * @param id The product ID to search for
   * @returns Promise<Product> The found product
   * @throws NotFoundException if product is not found in either source
   */
  async findOne(id: number): Promise<Product> {
    // Check local database first
    const localProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (localProduct) {
      return localProduct;
    }

    try {
      // If not found locally, check external API
      const externalProduct = await this.fakestoreService.getProductById(id);

      const product = new Product();
      product.id = externalProduct.id;
      product.title = externalProduct.title;
      product.price = externalProduct.price;
      product.description = externalProduct.description;
      product.category = externalProduct.category;
      product.image = externalProduct.image;
      product.stock = Math.floor(Math.random() * 100);
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
   * Create a new product in the local database with a guaranteed unique ID.
   * Uses a high ID range to avoid conflicts with external API products.
   * @param createProductDto The product data to create
   * @returns Promise<Product> The created product
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Get highest local ID
      const localProducts = await this.productRepository.find({
        order: { id: 'DESC' },
        take: 10,
      });

      const highestLocalId =
        localProducts.length > 0
          ? Math.max(...localProducts.map((p) => p.id))
          : 0;

      // Get highest external ID to avoid conflicts
      let highestExternalId = 0;
      try {
        const externalProducts = await this.fakestoreService.getAllProducts();

        if (externalProducts && externalProducts.length > 0) {
          const externalIds: number[] = externalProducts
            .map((p) => {
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
      }

      // Generate new ID with safe margin above existing IDs
      const BASE_ID = 1000000;
      const finalId = Math.max(
        BASE_ID,
        highestLocalId + 1,
        highestExternalId + 100000,
      );

      this.logger.log(
        `Creating product with ID ${finalId} (highest local: ${highestLocalId}, highest external: ${highestExternalId})`,
      );

      // Create and save new product
      const product = this.productRepository.create({
        ...createProductDto,
        id: finalId,
        stock: Math.floor(Math.random() * 100),
        isLocal: true,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(
        `Failed to create product: ${error instanceof Error ? error.message : String(error)}`,
      );

      // Emergency fallback ID generation if normal process fails
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
   * Update the stock quantity of a product. If the product doesn't exist locally,
   * creates a new local copy from external API data with the updated stock.
   * @param id The product ID to update
   * @param updateStockDto The new stock data
   * @returns Promise<Product> The updated product
   * @throws NotFoundException if product doesn't exist in either source
   */
  async updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      try {
        // If not found locally, fetch from external API and create local copy
        const externalProduct = await this.fakestoreService.getProductById(id);

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

    // Update and save existing product
    product.stock = updateStockDto.stock;
    return this.productRepository.save(product);
  }

  /**
   * Remove a product from the local database.
   * @param id The product ID to remove
   * @throws NotFoundException if product doesn't exist locally
   */
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${id} not found in local database`,
      );
    }

    await this.productRepository.remove(product);
  }
}

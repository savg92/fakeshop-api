import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/products/products.controller';
import { ProductsService } from '../../src/products/products.service';
import { Product } from '../../src/products/entities/product.entity';
import { CreateProductDto } from '../../src/products/dto/create-product.dto';
import { UpdateStockDto } from '../../src/products/dto/update-stock.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateStock: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts: Product[] = [
        {
          id: 1,
          title: 'Test Product',
          price: 50.0,
          description: 'Test Description',
          category: 'Test Category',
          image: 'https://test.com/image.jpg',
          stock: 10,
          isLocal: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockProductsService.findAll.mockResolvedValue(expectedProducts);

      const result = await controller.findAll();
      expect(result).toBe(expectedProducts);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const expectedProduct: Product = {
        id: 1,
        title: 'Test Product',
        price: 50.0,
        description: 'Test Description',
        category: 'Test Category',
        image: 'https://test.com/image.jpg',
        stock: 10,
        isLocal: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.findOne.mockResolvedValue(expectedProduct);

      const result = await controller.findOne(1);
      expect(result).toBe(expectedProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductsService.findOne.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        title: 'New Product',
        price: 75.0,
        description: 'New Description',
        category: 'New Category',
        image: 'https://test.com/new-image.jpg',
      };

      const expectedProduct: Product = {
        id: 2,
        ...createProductDto,
        stock: 20,
        isLocal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(createProductDto);
      expect(result).toBe(expectedProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('updateStock', () => {
    it('should update product stock', async () => {
      const updateStockDto: UpdateStockDto = { stock: 50 };
      const expectedProduct: Product = {
        id: 1,
        title: 'Test Product',
        price: 50.0,
        description: 'Test Description',
        category: 'Test Category',
        image: 'https://test.com/image.jpg',
        stock: 50,
        isLocal: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.updateStock.mockResolvedValue(expectedProduct);

      const result = await controller.updateStock(1, updateStockDto);
      expect(result).toBe(expectedProduct);
      expect(service.updateStock).toHaveBeenCalledWith(1, updateStockDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductsService.remove.mockRejectedValue(
        new NotFoundException('Product not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});

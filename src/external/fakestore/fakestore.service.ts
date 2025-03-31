/**
 * Service responsible for integration with the external FakeStore API.
 * Handles all HTTP requests to the FakeStore API and provides error handling.
 */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FakestoreProductDto } from './dto/fakestore-product.dto';

@Injectable()
export class FakestoreService {
  private readonly logger = new Logger(FakestoreService.name);
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    // Initialize API URL from environment variables
    const apiUrl = this.configService.get<string>('externalApi.fakestoreUrl');
    if (!apiUrl) {
      throw new Error(
        'FAKESTORE_API_URL is not defined in environment variables',
      );
    }
    this.baseUrl = apiUrl;
  }

  /**
   * Fetches all products from the FakeStore API.
   * @returns Promise<FakestoreProductDto[]> Array of products from external API
   * @throws HttpException if the API request fails
   */
  async getAllProducts(): Promise<FakestoreProductDto[]> {
    try {
      const response = await axios.get<FakestoreProductDto[]>(
        `${this.baseUrl}/products`,
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch products from FakeStore API: ${(error as Error).message}`,
      );
      throw new HttpException(
        'Failed to fetch products from external API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Fetches a specific product by ID from the FakeStore API.
   * @param id The product ID to fetch
   * @returns Promise<FakestoreProductDto> The product data from external API
   * @throws HttpException if the product is not found or the request fails
   */
  async getProductById(id: number): Promise<FakestoreProductDto> {
    try {
      const response = await axios.get<FakestoreProductDto>(
        `${this.baseUrl}/products/${id}`,
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch product ${id} from FakeStore API: ${(error as Error).message}`,
      );

      // Handle 404 errors specifically
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to fetch product from external API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

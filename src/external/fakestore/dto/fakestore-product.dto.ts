/**
 * Data Transfer Object representing a product from the external FakeStore API.
 * Defines the structure of product data received from the external API.
 */
export interface FakestoreProductDto {
  /** Unique identifier assigned by FakeStore API */
  id: number;

  /** Product name/title */
  title: string;

  /** Product price in decimal format */
  price: number;

  /** Detailed product description */
  description: string;

  /** Product category/type */
  category: string;

  /** URL to product image */
  image: string;

  /** Product rating information */
  rating: {
    /** Average rating score */
    rate: number;
    /** Number of ratings received */
    count: number;
  };
}

/**
 * Entity representing a product in the database.
 * Combines data from both local storage and external FakeStore API.
 */
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'int' })
  @ApiProperty({ description: 'The unique identifier of the product' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The title/name of the product' })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'The price of the product in decimal format' })
  price: number;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Detailed description of the product' })
  description: string;

  @Column()
  @ApiProperty({ description: 'The category/type of the product' })
  category: string;

  @Column()
  @ApiProperty({ description: "URL to the product's image" })
  image: string;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Current stock quantity available' })
  stock: number;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the product is stored in local database',
  })
  isLocal: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp of when the product was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp of the last update to the product' })
  updatedAt: Date;
}

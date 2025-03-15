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
  @ApiProperty({ description: 'The title of the product' })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'The price of the product' })
  price: number;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'The description of the product' })
  description: string;

  @Column()
  @ApiProperty({ description: 'The category of the product' })
  category: string;

  @Column()
  @ApiProperty({ description: 'The image URL of the product' })
  image: string;

  @Column({ default: 0 })
  @ApiProperty({ description: 'The stock quantity of the product' })
  stock: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the product is stored locally' })
  isLocal: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'The creation date of the product record' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The last update date of the product record' })
  updatedAt: Date;
}

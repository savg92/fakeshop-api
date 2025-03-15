import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 50,
  })
  @IsNotEmpty({ message: 'Stock should not be empty' })
  @IsInt({})
  @Min(0, {})
  stock: number;
}

import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../enum';

export class AddExpenseDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsOptional()
  date?: string;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;
}

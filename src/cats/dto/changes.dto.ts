import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class DataCatsDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsIn(['macho', 'hembra'])
  gender: string;

  @IsIn(['pequeño', 'mediano', 'grande'])
  size: string;

  @IsString()
  @IsOptional()
  breed: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  personality?: string;

  @IsString()
  @IsOptional()
  info?: string;

  @IsString()
  @IsOptional()
  moniker?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

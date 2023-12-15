import { PickType } from '@nestjs/mapped-types';
import { DataCatsDto } from './changes.dto';

export class CreateCatDto extends PickType(DataCatsDto, [
  'name',
  'gender',
  'size',
  'breed',
  'age',
  'personality',
  'info',
  'moniker',
  'tags',
  'status',
]) {}

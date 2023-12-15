import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';

@Injectable()
export class CatsService {
  //! Logs del Nestjs
  private readonly logger = new Logger('CatsService');

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    try {
      // ? Que apodo le pondras a tu gato, ¿Te ayudo?😉
      const cat = this.catRepository.create(createCatDto);
      await this.catRepository.save(cat);
      return cat;
    } catch (err) {
      this.michisHandleExceptions(err);
    }
  }

  // Todo: Pagination
  findAll({ limit = 10, offset = 0 }: PaginationDto) {
    return this.catRepository.find({ take: limit, skip: offset });
  }

  async findOne(term: string) {
    let cat: Cat;

    if (isUUID(term)) {
      cat = await this.catRepository.findOneBy({ id: term });
    } else {
      const query = this.catRepository.createQueryBuilder();
      cat = await query
        .where(
          'UPPER(name) =:name or LOWER(gender) =:gender or LOWER(size) =:size or LOWER(moniker) =:moniker',
          {
            name: term.toUpperCase(),
            size: term.toLowerCase(),
            gender: term.toLowerCase(),
            moniker: term.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!cat) throw new NotFoundException(`Product with ${term} not found`);
    return cat;
  }

  async update(id: string, updatecatdto: UpdateCatDto) {
    const cat = await this.catRepository.preload({ id, ...updatecatdto });
    if (!cat)
      throw new NotFoundException(`I didn't find the cat with the ID ${id}`);

    try {
      await this.catRepository.save(cat);
      return cat;
    } catch (err) {
      this.michisHandleExceptions(err);
    }
  }

  async remove(id: string) {
    const cat = await this.findOne(id);
    await this.catRepository.remove(cat);
  }

  //* Manejando errores
  private michisHandleExceptions(err: any) {
    if (err.code === '500') throw new BadRequestException(err.detail);
    this.logger.error(err);
    throw new InternalServerErrorException(
      'Unexpected error, please verify your code or logs😾',
    );
  }
}

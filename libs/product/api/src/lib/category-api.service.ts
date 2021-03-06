import {
  CategoryEntity,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@esc/product/models';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async getCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne(id);

    if (!category) {
      throw new NotFoundException();
    } else {
      return category;
    }
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const categoryExisting = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });

    if (categoryExisting) {
      return categoryExisting;
    }

    const category = this.categoryRepository.create(dto);

    try {
      const savedCategory = await this.categoryRepository.save(category);
      return savedCategory;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto
  ): Promise<CategoryEntity> {
    const category = await this.getCategoryById(id);

    Object.assign(category, dto);

    await this.categoryRepository.update(id, dto);

    return await this.getCategoryById(id);
  }

  async deleteCategoryById(id: string): Promise<{ categoryDeleted: string }> {
    const result = await this.categoryRepository.delete(id);

    if (result.affected) {
      return { categoryDeleted: id };
    }

    throw new NotFoundException();
  }
}

import {
  RegisterUserDto,
  UserResponse,
  UserEntity,
  UpdateUserDto,
} from '@esc/user/entities';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserApiService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<UserResponse> {
    const isUserExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    const newUser = this.userRepository.create(dto);

    try {
      const { password, ...user } = await this.userRepository.save(newUser);

      return {
        user: {
          ...user,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async listUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto
  ): Promise<UserResponse | UpdateResult> {
    const isUserExist = await this.userRepository.findOne(id, {
      select: ['password'],
    });

    let newPassword;

    if (dto.password) {
      newPassword = await hash(dto.password, 10);
    } else {
      newPassword = isUserExist?.password;
    }

    const result = await this.userRepository.update(id, {
      ...dto,
      password: newPassword,
    });

    if (result.affected) {
      const updatedUser = (await this.userRepository.findOne(id)) as UserEntity;
      return {
        user: {
          ...updatedUser,
        },
      };
    } else {
      return result;
    }
  }
}

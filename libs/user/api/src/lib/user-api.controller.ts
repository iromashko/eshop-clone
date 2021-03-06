import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserApiService } from './user-api.service';
import {
  RegisterUserDto,
  UserEntity,
  UpdateUserDto,
  LoginUserDto,
  LoginResponse,
  UserFromServer,
} from '@esc/user/models';
import { CountResponse, DeleteResponse } from '@esc/shared/util-models';

@Controller('users')
export class UserApiController {
  constructor(private userApiService: UserApiService) {}

  @Post()
  registerUser(@Body() dto: RegisterUserDto): Promise<UserFromServer> {
    return this.userApiService.registerUser(dto);
  }

  @Get()
  listUsers(): Promise<UserEntity[]> {
    return this.userApiService.listUsers();
  }

  @Get('check')
  isUserExist(@Query('email') email: string): Promise<boolean> {
    return this.userApiService.isUserExist(email);
  }

  @Get('count')
  getUsersCount(): Promise<CountResponse> {
    return this.userApiService.getUserCount();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.userApiService.getUserById(id);
  }

  @Put(':id')
  updateUser(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<UserFromServer> {
    return this.userApiService.updateUser(id, dto);
  }

  @Post('login')
  loginUser(@Body() dto: LoginUserDto): Promise<LoginResponse> {
    return this.userApiService.loginUser(dto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResponse> {
    return this.userApiService.deleteUser(id);
  }
}

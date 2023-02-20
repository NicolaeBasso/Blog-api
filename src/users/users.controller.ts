import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/utils/constants';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteAllUsers(): Promise<DeleteResult> {
    return this.usersService.removeAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<string> {
    return this.usersService.remove(id);
  }
}

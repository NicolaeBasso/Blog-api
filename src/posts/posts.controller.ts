import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/utils/constants';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { DeleteResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('all/published')
  async findAllpublished(): Promise<PostEntity[]> {
    return this.postsService.findAllpublished();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Delete('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeAll(): Promise<DeleteResult> {
    return this.postsService.removeAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async find(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.find(id, user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    const post: PostEntity = await this.postsService.create(
      user,
      createPostDto,
    );

    return post;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.update(user, id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<DeleteResult> {
    return this.postsService.remove(user, id);
  }

  @Patch(':id/publish')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async publish(@Param('id') id, @GetUser() user: User): Promise<PostEntity> {
    return this.postsService.publish(user, id);
  }

  @Patch(':id/hide')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async hide(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.hide(user, id);
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async findAllByUserId(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<PostEntity[]> {
    return this.postsService.findAllByUserId(userId, user);
  }

  @Get('user/:userId/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async findAllpublishedByUserId(
    @Param('userId') userId: string,
  ): Promise<PostEntity[]> {
    return this.postsService.findAllpublishedByUserId(userId);
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  async findAllByUser(@GetUser() user: User): Promise<PostEntity[]> {
    return this.postsService.findAllByUser(user);
  }

  @Delete(':id/published')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BLOGGER)
  async removePublished(@Param('id') id: string): Promise<DeleteResult> {
    return this.postsService.removePublished(id);
  }
}

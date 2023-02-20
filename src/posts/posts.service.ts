import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/utils/constants';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return this.postRepository.findOne({ where: { id } });
  }

  async find(id: string, user: User): Promise<Post> {
    const post = await this.findOne(id);

    if (!post || (!post.published && post.author.id !== user.id)) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const { id: userId } = user;
    const dbUser = await this.usersService.findOneById(userId);

    const newPost = this.postRepository.create(createPostDto);
    newPost.author = dbUser;

    return this.postRepository.save(newPost);
  }

  async update(
    user: User,
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (!post || post.author.id !== user.id) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    const { title, body, published } = updatePostDto;
    post.title = title;
    post.body = body;
    post.published = published;

    return this.postRepository.save(post);
  }

  async remove(user: User, id: string): Promise<DeleteResult> {
    const post = await this.findOne(id);
    if (
      !post ||
      (post.author.id !== user.id &&
        (!post.published || user.role !== UserRole.ADMIN))
    ) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.postRepository.delete(id);
  }

  async publish(user: User, id: string): Promise<Post> {
    const post = await this.findOne(id);
    if (
      !post ||
      (post.author.id !== user.id && post.author.role !== UserRole.ADMIN)
    ) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    post.published = true;

    return this.postRepository.save(post);
  }

  async hide(user: User, id: string): Promise<Post> {
    const post = await this.findOne(id);

    if (
      !post ||
      (post.author.id !== user.id &&
        (!post.published || user.role !== UserRole.ADMIN))
    ) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    post.published = false;

    return this.postRepository.save(post);
  }

  async findAllpublished(): Promise<Post[]> {
    return this.postRepository.find({ where: { published: true } });
  }

  async findAllpublishedByUserId(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { published: true, author: { id: userId } },
    });
  }

  async findAllByUserId(userId: string, user: User): Promise<Post[]> {
    if (userId !== user.id) throw new ForbiddenException(`Forbidden`);

    return this.postRepository.find({
      where: { author: { id: userId } },
    });
  }

  async findAllByUser(user: User): Promise<Post[]> {
    return this.postRepository.find({ where: { author: { id: user.id } } });
  }

  async findOnepublished(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id, published: true },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async removePublished(id: string): Promise<DeleteResult> {
    return this.postRepository.delete({ id });
  }

  async removeAll(): Promise<DeleteResult> {
    return this.postRepository.delete({});
  }
}

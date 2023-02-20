import { Exclude, instanceToPlain } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: false })
  published: boolean;

  @Exclude()
  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  toJSON() {
    return {
      ...instanceToPlain(this),
      authorId: this.author?.id ?? null,
      authorName: this.author?.name,
    };
  }
}

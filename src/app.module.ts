import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { PostsModule } from './posts/posts.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { GlobalInterceptor } from './utils/interceptors/post.interceptor';

@Module({
  imports: [CommonModule, UsersModule, PostsModule, AuthModule, SeedModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    AppService,
    JwtService,
  ],
  controllers: [AppController],
  exports: [CommonModule],
})
export class AppModule {}

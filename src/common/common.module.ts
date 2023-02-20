import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { JwtModule } from './jwt/jwt.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule, JwtModule, DatabaseModule],
  exports: [ConfigModule, DatabaseModule],
})
export class CommonModule {}

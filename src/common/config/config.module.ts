import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';

@Module({
  imports: [
    NestConfig.forRoot({
      envFilePath: (() => {
        const env = process.env.env;

        switch (env) {
          case 'PRODUCTION':
            return '.production.env';
          case 'STAGING':
            return '.staging.env';
        }

        return 'dev.env';
      })(),
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/utils/constants';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, JwtModule],
  providers: [AuthService],
})
export class SeedModule {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  name = this.configService.get<string>('ADMIN_DEFAULT_NAME');
  email = this.configService.get<string>('ADMIN_DEFAULT_EMAIL');
  password = this.configService.get<string>('ADMIN_DEFAULT_PASSWORD');

  async onModuleInit() {
    // seed default admin user
    this.userService.findOneByEmail(this.email).catch(async () => {
      const admin: User = await this.userService.create({
        name: this.name,
        email: this.email,
        password: this.password,
        role: UserRole.ADMIN,
      });
      const accessToken = this.authService.generateAccessToken(admin);
      const refreshToken = this.authService.generateRefreshToken(admin);
      return { admin, accessToken, refreshToken };
    });
  }
}

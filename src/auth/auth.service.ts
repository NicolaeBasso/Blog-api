import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;

        return result;
      }
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async login(
    user: Partial<User>,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const dbUser = await this.validateUser(user.email, user.password);

      const accessToken = await this.generateAccessToken(dbUser);
      const refreshToken = await this.generateRefreshToken(dbUser);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new HttpException(`Invalid credentials`, 400);
    }
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.usersService.create({
        ...createUserDto,
        role: UserRole.BLOGGER,
      });
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new HttpException('Email already in use', 400);
    }
  }

  async refresh(refreshToken: string) {
    const { userId } = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_refreshToken_SECRET,
    });

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async generateAccessToken(user: Partial<User>) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ?? UserRole.BLOGGER,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });
  }

  async generateRefreshToken(user: Partial<User>): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ?? UserRole.BLOGGER,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return token;
  }
}

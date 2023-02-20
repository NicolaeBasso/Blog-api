import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.register(createUserDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
    );
    const expiresIn = 60 * 3600;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: expiresIn * 1000,
    });
    res.cookie('accessToken', accessToken, { maxAge: expiresIn * 1000 });

    return { message: 'Logged in successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }

  @Post('logout')
  async logout(@Request() req) {
    req.res.clearCookie('accessToken');
    req.res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }
}

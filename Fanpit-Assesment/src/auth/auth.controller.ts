import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Raw body received:', JSON.stringify(registerDto));
    console.log('Received registration data:', registerDto);
    console.log('Role from DTO:', registerDto.role);
    console.log('Role type:', typeof registerDto.role);
    const user = await this.userService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role,
      registerDto.name
    );
    console.log('Created user with role:', user.role);
    const loginResponse = this.authService.login(user);
    console.log('Login response user role:', (await loginResponse).data.user.role);
    return loginResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    const user = await this.userService.findById(req.user.sub);
    const { password, ...result } = user.toObject();
    return result;
  }
}

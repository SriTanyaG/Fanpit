import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // remove password before returning
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    console.log('AuthService.login called with user:', user);
    console.log('AuthService.login user.role:', user.role);
    const payload = { email: user.email, role: user.role, sub: user._id };
    const response = {
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      }
    };
    console.log('AuthService.login returning response:', response);
    return response;
  }
}

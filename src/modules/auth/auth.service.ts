import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDocument } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findByUsername(username);
    if (
      user &&
      (await this.userService.validatePassword(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

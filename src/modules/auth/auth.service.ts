import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { type User, type UserDocument } from '../entities'

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser (
    username: string,
    password: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByUsername(username)
    if (
      user &&
      (await this.userService.validatePassword(password, user.password))
    ) {
      const { password, ...result } = user

      return result
    }
    return null
  }

  async login (user: UserDocument): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}

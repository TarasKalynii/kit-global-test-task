import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async register (@Body() body: { username: string, password: string }) {
    const user = await this.userService.findByUsername(body.username)

    if (user) {
      throw new BadRequestException('Username already exists.')
    }

    const { password, ...result } = await this.userService.create(
      body.username,
      body.password
    )

    return result
  }

  @Post('login')
  async login (@Body() body: { username: string, password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password
    )
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return await this.authService.login(user)
  }
}

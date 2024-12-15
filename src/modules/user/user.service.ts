import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User, type UserDocument } from '../entities'

@Injectable()
export class UserService {
  constructor (
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async findByUsername (username: string): Promise<User | null> {
    const userDocument = await this.userModel.findOne({ username }).exec()

    if (userDocument === null) {
      return null
    }

    return userDocument.toObject()
  }

  async create (username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new this.userModel({ username, password: hashedPassword })
    const user = await newUser.save()

    return user.toObject()
  }

  async validatePassword (password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}

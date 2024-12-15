import { IsEnum, IsOptional, IsString } from 'class-validator'
import { TaskStatus } from '../../entities'

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
    title?: string

  @IsOptional()
  @IsEnum(TaskStatus)
    status?: TaskStatus
}

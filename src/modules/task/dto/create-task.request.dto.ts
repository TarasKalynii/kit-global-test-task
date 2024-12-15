import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Task title'
  })
    title: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Project id'
  })
    projectId: string
}

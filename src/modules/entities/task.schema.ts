import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Schema()
export class Task {
  @Prop({ required: true })
  @ApiProperty({
    type: 'string',
    description: 'Task title',
  })
  title: string;

  @Prop({ default: TaskStatus.NEW })
  @ApiProperty({
    type: 'string',
    enum: TaskStatus,
    description: 'Task status',
  })
  status: TaskStatus;

  @Prop({ required: true, ref: 'Project' })
  projectId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

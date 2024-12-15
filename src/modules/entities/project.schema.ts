import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { type Document } from 'mongoose'

export type ProjectDocument = Project & Document

@Schema()
export class Project {
  @Prop({ required: true, ref: 'User' })
    userId: string

  @Prop({ required: true })
    name: string

  @Prop({ default: [], ref: 'Task' })
    taskIds: string[]
}

export const ProjectSchema = SchemaFactory.createForClass(Project)

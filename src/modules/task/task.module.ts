import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { Task, TaskSchema, Project, ProjectSchema } from '../entities'
import { ProjectModule } from '../project'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema }
    ]),
    ProjectModule
  ],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}

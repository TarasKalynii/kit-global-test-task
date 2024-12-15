import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Task,
  type TaskDocument,
  Project,
  type ProjectDocument
} from '../entities'

@Injectable()
export class ProjectService {
  constructor (
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>
  ) {}

  async createProject (project: Partial<Project>): Promise<Project> {
    return await new this.projectModel(project).save()
  }

  async getProjects (userId: string): Promise<Project[]> {
    return await this.projectModel
      .find({ userId })
      .populate('taskIds', undefined, this.taskModel)
      .exec()
  }

  async isProjectOwner (projectId: string, userId: string): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec()

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this project')
    }
  }
}

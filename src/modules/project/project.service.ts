import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, Project, ProjectDocument } from '../entities';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(project: Partial<Project>): Promise<Project> {
    return new this.projectModel(project).save();
  }

  async getProjects(userId: string): Promise<Project[]> {
    return this.projectModel
      .find({ userId })
      .populate('taskIds', undefined, this.taskModel)
      .exec();
  }

  async isProjectOwner(projectId: string, userId: string): Promise<boolean> {
    const project = await this.projectModel.findById(projectId).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    return true;
  }
}

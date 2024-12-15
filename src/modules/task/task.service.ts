import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, Project, ProjectDocument } from '../entities';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createTask(task: Partial<Task>): Promise<Task> {
    const createdTask = await new this.taskModel(task).save();

    await this.projectModel.updateOne(
      { _id: task.projectId },
      { $push: { taskIds: createdTask._id } },
    );

    return createdTask;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<void> {
    const result = await this.taskModel
      .findByIdAndUpdate(id, task, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteTask(id: string): Promise<void> {
    // TODO: use session to prevent partial operation
    const result = await this.taskModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    await this.projectModel.updateOne(
      { _id: result.projectId },
      { $pull: { taskIds: new Types.ObjectId(id) } },
    );
  }

  async isTaskOwner(taskId: string, userId: string): Promise<void> {
    const task = await this.taskModel
      .findById(taskId)
      .populate('projectId', 'userId', this.projectModel)
      .exec();

    if (!task || !task.toObject().projectId) {
      throw new NotFoundException('Task or associated project not found');
    }

    const project = task.toObject().projectId as unknown as Pick<
      Project,
      'userId'
    >;

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }
  }
}

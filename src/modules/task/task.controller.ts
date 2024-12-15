import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { ProjectService } from '../project';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { Task } from '../entities';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 200, description: 'Task created', type: Task })
  async createTask(@Body() task: CreateTaskDto, @Req() req) {
    const userId: string = req.user.userId;
    const projectId: string = task.projectId;
    await this.projectService.isProjectOwner(projectId, userId);

    return this.taskService.createTask(task);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @Req() req,
  ) {
    const userId: string = req.user.userId;
    // TODO: can be moved to Guard
    await this.taskService.isTaskOwner(id, userId);

    return this.taskService.updateTask(id, task);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.userId;
    await this.taskService.isTaskOwner(id, userId);

    return this.taskService.deleteTask(id);
  }
}

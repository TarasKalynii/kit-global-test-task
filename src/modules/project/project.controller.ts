import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '../entities';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  createProject(@Body() project: Partial<Project>, @Req() req: any) {
    const userId: string = req.user.userId;

    return this.projectService.createProject({ ...project, userId });
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getProjects(@Req() req: any) {
    const userId: string = req.user.userId;

    return this.projectService.getProjects(userId);
  }
}

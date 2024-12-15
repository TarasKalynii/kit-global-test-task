import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ProjectService } from './project.service'
import { type Project } from '../entities'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('projects')
export class ProjectController {
  constructor (private readonly projectService: ProjectService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createProject (@Body() project: Partial<Project>, @Req() req) {
    const userId: string = req.user.userId

    return await this.projectService.createProject({ ...project, userId })
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getProjects (@Req() req) {
    const userId: string = req.user.userId

    return await this.projectService.getProjects(userId)
  }
}

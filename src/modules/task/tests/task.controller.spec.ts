import { Test, type TestingModule } from '@nestjs/testing'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { TaskController } from '../task.controller'
import { TaskService } from '../task.service'
import { ProjectService } from '../../project'
import { type CreateTaskDto, type UpdateTaskDto } from '../dto'
import { type Task } from '../../entities'

describe('TaskController', () => {
  let taskController: TaskController
  let taskService: TaskService
  let projectService: ProjectService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
            isTaskOwner: jest.fn()
          }
        },
        {
          provide: ProjectService,
          useValue: {
            isProjectOwner: jest.fn()
          }
        }
      ]
    }).compile()

    taskController = module.get<TaskController>(TaskController)
    taskService = module.get<TaskService>(TaskService)
    projectService = module.get<ProjectService>(ProjectService)
  })

  it('should be defined', () => {
    expect(taskController).toBeDefined()
  })

  describe('createTask', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      projectId: 'testProjectId'
    }

    const req = {
      user: { userId: 'testUserId' }
    }

    describe('Task creation', () => {
      it('should call projectService.isProjectOwner with the correct parameters', async () => {
        jest.spyOn(projectService, 'isProjectOwner').mockResolvedValue()
        jest
          .spyOn(taskService, 'createTask')
          .mockResolvedValue(createTaskDto as unknown as Task)

        await taskController.createTask(createTaskDto, req)

        expect(projectService.isProjectOwner).toHaveBeenCalledWith(
          'testProjectId',
          'testUserId'
        )
      })

      it('should call taskService.createTask with the correct parameters', async () => {
        jest
          .spyOn(projectService, 'isProjectOwner')
          .mockResolvedValue(undefined as any)
        jest
          .spyOn(taskService, 'createTask')
          .mockResolvedValue(createTaskDto as unknown as Task)

        await taskController.createTask(createTaskDto, req)

        expect(taskService.createTask).toHaveBeenCalledWith(createTaskDto)
      })

      it('should return the correct result from createTask', async () => {
        jest
          .spyOn(projectService, 'isProjectOwner')
          .mockResolvedValue(undefined as any)
        jest
          .spyOn(taskService, 'createTask')
          .mockResolvedValue(createTaskDto as unknown as Task)

        const result = await taskController.createTask(createTaskDto, req)

        expect(result).toEqual(createTaskDto)
      })
    })

    it('should throw UnauthorizedException if the user is not the project owner', async () => {
      jest
        .spyOn(projectService, 'isProjectOwner')
        .mockRejectedValue(new UnauthorizedException())

      await expect(
        taskController.createTask(createTaskDto, req)
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('updateTask', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task'
    }

    const req = {
      user: { userId: 'testUserId' }
    }

    describe('Task update', () => {
      it('should call taskService.isTaskOwner with the correct parameters', async () => {
        jest
          .spyOn(taskService, 'isTaskOwner')
          .mockResolvedValue(undefined as any)
        jest
          .spyOn(taskService, 'updateTask')
          .mockResolvedValue(undefined as any)

        await taskController.updateTask('testTaskId', updateTaskDto, req)

        expect(taskService.isTaskOwner).toHaveBeenCalledWith(
          'testTaskId',
          'testUserId'
        )
      })

      it('should call taskService.updateTask with the correct parameters', async () => {
        jest
          .spyOn(taskService, 'isTaskOwner')
          .mockResolvedValue(undefined as any)
        jest
          .spyOn(taskService, 'updateTask')
          .mockResolvedValue(undefined as any)

        await taskController.updateTask('testTaskId', updateTaskDto, req)

        expect(taskService.updateTask).toHaveBeenCalledWith(
          'testTaskId',
          updateTaskDto
        )
      })

      it('should return the correct result from updateTask', async () => {
        jest
          .spyOn(taskService, 'isTaskOwner')
          .mockResolvedValue(undefined as any)
        jest
          .spyOn(taskService, 'updateTask')
          .mockResolvedValue(undefined as any)

        const result = await taskController.updateTask(
          'testTaskId',
          updateTaskDto,
          req
        )

        expect(result).toEqual(undefined)
      })
    })

    it('should throw UnauthorizedException if the user is not the task owner', async () => {
      jest
        .spyOn(taskService, 'isTaskOwner')
        .mockRejectedValue(new UnauthorizedException())

      await expect(
        taskController.updateTask('testTaskId', updateTaskDto, req)
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('deleteTask', () => {
    const req = {
      user: { userId: 'testUserId' }
    }

    it('should delete the task if the user is the task owner', async () => {
      jest.spyOn(taskService, 'isTaskOwner').mockResolvedValue(undefined)
      jest.spyOn(taskService, 'deleteTask').mockResolvedValue(undefined)

      const result = await taskController.deleteTask('testTaskId', req)

      expect(taskService.isTaskOwner).toHaveBeenCalledWith(
        'testTaskId',
        'testUserId'
      )
      expect(taskService.deleteTask).toHaveBeenCalledWith('testTaskId')
      expect(result).toBeUndefined()
    })

    it('should throw UnauthorizedException if the user is not the task owner', async () => {
      jest
        .spyOn(taskService, 'isTaskOwner')
        .mockRejectedValue(new UnauthorizedException())

      await expect(
        taskController.deleteTask('testTaskId', req)
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw NotFoundException if the task does not exist', async () => {
      jest.spyOn(taskService, 'isTaskOwner').mockResolvedValue(undefined)
      jest
        .spyOn(taskService, 'deleteTask')
        .mockRejectedValue(new NotFoundException())

      await expect(
        taskController.deleteTask('testTaskId', req)
      ).rejects.toThrow(NotFoundException)
    })
  })
})

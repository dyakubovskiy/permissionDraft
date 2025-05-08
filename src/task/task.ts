import type { BasePermissionConfig } from '../permission'
import type { User } from '../user'
import type { Task } from './types'

import { useBasePermission } from '../permission'
import { user } from '../user'

type TaskAction = 'create' | 'read' | 'delete' | 'reset'

interface TaskPermissions {
  canCreate: () => boolean
  canRead: () => boolean
  canDelete: (task: Task) => boolean
  canReset: (task: Task) => boolean
}

const TASK_PERMISSION = {
  admin: {
    create: () => true,
    read: () => true,
    delete: (_task: Task) => true,
    reset: (task: Task, _: User) => task.status === 'done'
  },
  user: {
    create: () => false,
    read: () => true,
    delete: (task: Task) => task.status !== 'done',
    reset: (task: Task, user: User) => task.status === 'done' && task.executorId === user.id
  }
} as const satisfies BasePermissionConfig<TaskAction, Task>

export const useTaskPermission = (): TaskPermissions => {
  const { checkByAction, checkByResource, complexCheck } = useBasePermission<TaskAction, Task>(
    user.value.role,
    TASK_PERMISSION
  )

  const canCreate: TaskPermissions['canCreate'] = () => checkByAction('create')
  const canRead: TaskPermissions['canRead'] = () => checkByAction('read')
  const canDelete: TaskPermissions['canDelete'] = (task: Task) => checkByResource('delete', task)
  const canReset: TaskPermissions['canReset'] = (task: Task) =>
    complexCheck('reset', task, user.value)

  return { canCreate, canRead, canDelete, canReset }
}

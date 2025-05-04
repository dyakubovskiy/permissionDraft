import type { BasePermissionConfig } from '../permission'
import type { User } from '../user'
import type { Task } from './types'

import { useBasePermission } from '../permission'
import { user } from '../user'

type TaskAction = 'create' | 'read' | 'delete' | 'reset'

const TASK_PERMISSION = {
  admin: {
    create: () => true,
    read: () => true,
    delete: (_task: Task) => true,
    reset: (task: Task, _: User) => task.status === 'done',
  },
  user: {
    create: () => false,
    read: () => true,
    delete: (task: Task) => task.status !== 'done',
    reset: (task: Task, user: User) => task.status === 'done' && task.executorId === user.id,
  },
} as const satisfies BasePermissionConfig<TaskAction, Task>

export const useTaskPermission = () => {
  console.log('useTaskPermission init')
  const { checkByAction, checkByResource, complexCheck } = useBasePermission<TaskAction, Task>(
    user.value.role,
    TASK_PERMISSION,
  )

  const canCreate = () => checkByAction('create')
  const canRead = () => checkByAction('read')
  const canDelete = (task: Task) => checkByResource('delete', task)
  const canReset = (task: Task) => complexCheck('reset', task, user.value)

  return { canCreate, canRead, canDelete, canReset }
}

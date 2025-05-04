import type { Resource } from '../permission'

type Status = 'created' | 'work' | 'done'

export interface Task extends Resource {
  executorId: string
  status: Status
}

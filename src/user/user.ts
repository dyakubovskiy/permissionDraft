import { ref } from 'vue'
import type { Subject } from '../permission'

export type Role = 'admin' | 'user'

export interface User extends Subject<Role> {
  name: string
}

export const user = ref<User>({
  id: '2',
  name: 'John Doe',
  role: 'user',
})

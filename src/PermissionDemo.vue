<template>
  <div class="task-creation">
    <h2>Create New Task</h2>
    <div>Can create: {{ canCreate() ? '✅' : '❌' }}</div>
    <input v-model="newTaskName" placeholder="Task name" :disabled="!canCreate()" />
    <button @click="addTask" :disabled="!canCreate()">Add Task</button>
  </div>

  <div class="task-list">
    <h2>Tasks ({{ tasks.length }})</h2>
    <div v-for="task in tasks" :key="task.id" class="task-item">
      <div class="task-info">
        <h3>{{ task.name }}</h3>
        <p>
          Status:
          <select
            :value="task.status"
            @change="
              (event) => {
                updateTaskStatus(task, (event.target as HTMLSelectElement).value as Task['status'])
              }
            "
          >
            <option value="created">created</option>
            <option value="work">work</option>
            <option value="done">Done</option>
          </select>
        </p>
        <p>Executor ID: <input type="string" v-model="task.executorId" /></p>
      </div>

      <div class="task-actions">
        <button @click="deleteTask(task)" :class="{ disabled: !canDelete(task) }">Delete</button>
        <button @click="resetTask(task)" :class="{ disabled: !canReset(task) }">Reset</button>
      </div>

      <div class="permissions-info">
        <div>Can read: {{ canRead() ? '✅' : '❌' }}</div>
        <div>Can delete: {{ canDelete(task) ? '✅' : '❌' }}</div>
        <div>Can reset: {{ canReset(task) ? '✅' : '❌' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from './task'

import { ref, reactive } from 'vue'
import { useTaskPermission } from './task'

const tasks = reactive<Task[]>([
  { id: '1', name: 'Task 1', status: 'done', executorId: '1' },
  { id: '2', name: 'Task 2', status: 'work', executorId: '2' },
  { id: '3', name: 'Task 3', status: 'created', executorId: '1' },
])

const newTaskName = ref('')

const { canCreate, canRead, canDelete, canReset } = useTaskPermission()

// Методы для управления состоянием
const addTask = () => {
  if (!canCreate()) return

  tasks.push({
    id: '',
    name: newTaskName.value,
    status: 'created',
    executorId: '1',
  })
  newTaskName.value = ''
}

const updateTaskStatus = (task: Task, status: Task['status']) => {
  task.status = status
}

const deleteTask = (task: Task) => {
  if (canDelete(task)) {
    const index = tasks.findIndex((t) => t.id === task.id)
    tasks.splice(index, 1)
  }
}

const resetTask = (task: Task) => {
  if (canReset(task)) {
    task.status = 'created'
  }
}
</script>

<style scoped>
.task-list {
  overflow: auto;
  max-height: 800px;
}
</style>

<template>
  <div class="taskCreation">
    <h2>Create New Task</h2>
    <div>Can create: {{ getStatusIcon(canCreate) }}</div>
    <input
      v-model="newTaskName"
      placeholder="Task name"
      :disabled="!canCreate()" />
    <button
      @click="addTask"
      :disabled="!canCreate()">
      Add Task
    </button>
  </div>

  <div class="taskList">
    <h2>Tasks ({{ tasks.length }})</h2>
    <div
      v-for="task in tasks"
      :key="task.id"
      class="task">
      <div class="info">
        <h3>{{ task.name }}</h3>
        <p>
          Status:
          <select v-model="task.status">
            <option
              disabled
              value>
              Select status
            </option>
            <option
              v-for="status in TASK_STATUS"
              :key="status">
              {{ status }}
            </option>
          </select>
        </p>
        <p>
          Executor ID:
          <input
            type="string"
            v-model="task.executorId" />
        </p>
      </div>
      <div class="actions">
        <button
          @click="deleteTask(task)"
          :class="{ disabled: !canDelete(task) }">
          Delete
        </button>
        <button
          @click="resetTask(task)"
          :class="{ disabled: !canReset(task) }">
          Reset
        </button>
      </div>
      <div class="permissionsInfo">
        <div>Can read: {{ getStatusIcon(canRead) }}</div>
        <div>Can delete: {{ getStatusIcon(() => canDelete(task)) }}</div>
        <div>Can reset: {{ getStatusIcon(() => canReset(task)) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { Task } from './task'

import { ref } from 'vue'
import { useTaskPermission } from './task'

const { canCreate, canRead, canDelete, canReset } = useTaskPermission()

const tasks: Ref<Array<Task>> = ref([
  { id: '1', name: 'Task 1', status: 'done', executorId: '1' },
  { id: '2', name: 'Task 2', status: 'work', executorId: '2' },
  { id: '3', name: 'Task 3', status: 'created', executorId: '1' }
])

const TASK_STATUS = ['created', 'work', 'done'] as const satisfies Array<Task['status']>

const getStatusIcon = (checker: () => boolean): string => (checker() ? '✅' : '❌')

const newTaskName: Ref<string> = ref('')

const addTask = (): void => {
  if (!canCreate()) return

  tasks.value.push({
    id: '',
    name: newTaskName.value,
    status: 'created',
    executorId: '1'
  })
  newTaskName.value = ''
}

const deleteTask = (task: Task): void => {
  if (!canDelete(task)) return

  const index = tasks.value.findIndex((t) => t.id === task.id)
  tasks.value.splice(index, 1)
}

const resetTask = (task: Task): void => {
  if (!canReset(task)) return

  task.status = 'created'
}
</script>

<style scoped>
.taskCreation {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  width: max-content;
}

.taskList {
  overflow: auto;
  max-height: 800px;
}

.task {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info,
.actions {
  flex: 1;
  margin: 0 10px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input,
select {
  margin: 5px;
  padding: 5px;
}
</style>

<script setup lang="ts">
import type { Role } from './user'
import { user } from './user'

import { ref, watch } from 'vue'

import Demo from './PermissionDemo.vue'

const showDemo = ref(true)
const componentKey = ref(0)
watch(
  user,
  async () => {
    componentKey.value++
  },
  { deep: true },
)

const PERMISSION_RULES = {
  admin: {
    create: { description: 'Всегда разрешено', condition: 'true' },
    read: { description: 'Всегда разрешено', condition: 'true' },
    delete: { description: 'Всегда разрешено', condition: 'true' },
    reset: {
      description: 'Только завершенные задачи',
      condition: "task.status === 'done'",
    },
  },
  user: {
    create: { description: 'Запрещено', condition: 'false' },
    read: { description: 'Всегда разрешено', condition: 'true' },
    delete: {
      description: 'Только незавершенные задачи',
      condition: "task.status !== 'done'",
    },
    reset: {
      description: 'Только свои завершенные задачи',
      condition: "task.status === 'done' && task.executorId === user.id",
    },
  },
}
</script>

<template>
  <div class="permissions-demo">
    <div class="user-controls">
      <h2>User Settings</h2>
      <div>
        <label>Role:</label>
        <select
          :value="user.role"
          @change="(event) => (user.role = (event.target as HTMLSelectElement).value as Role)"
        >
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
      </div>
      <div>
        <label>User ID:</label>
        <input type="text" v-model="user.id" />
      </div>
    </div>

    <div class="rules-visualization">
      <h2>Правила доступа</h2>

      <div class="roles-container">
        <div
          v-for="(rules, role) in PERMISSION_RULES"
          :key="role"
          class="role-card"
          :class="{ active: user.role === role }"
        >
          <h3 class="role-title">{{ role }}</h3>

          <div class="permission-list">
            <div v-for="(permission, action) in rules" :key="action" class="permission-item">
              <div class="action-name">{{ action }}</div>
              <div class="permission-info">
                <div class="description">{{ permission.description }}</div>
                <code class="condition">{{ permission.condition }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Demo v-if="showDemo" :key="componentKey" />
  </div>
</template>

<style>
.permissions-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.user-controls,
.task-creation {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.task-item {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info,
.task-actions,
.permissions-info {
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

.rules-visualization {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.roles-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.role-card {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.2s;
}

.role-card.active {
  border-color: #42b983;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.role-title {
  margin: 0 0 1rem;
  color: #2c3e50;
  text-transform: capitalize;
  font-size: 1.25rem;
}

.permission-list {
  display: grid;
  gap: 1rem;
}

.permission-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.action-name {
  min-width: 80px;
  font-weight: 500;
  color: #42b983;
  text-transform: capitalize;
}

.permission-info {
  flex: 1;
}

.description {
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9em;
}

.condition {
  display: block;
  padding: 0.5rem;
  background: #e9ecef;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85em;
  color: #2c3e50;
}
</style>

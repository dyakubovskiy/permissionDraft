<template>
  <div class="wrapper">
    <div class="settings">
      <div class="userControls">
        <h2>User Settings</h2>
        <div>
          <label>Role:</label>
          <select v-model="user.role">
            <option
              disabled
              value>
              Select a role
            </option>
            <option
              v-for="role in USER_ROLES"
              :key="role"
              :value="role">
              {{ role }}
            </option>
          </select>
        </div>
        <div>
          <label>User ID:</label>
          <input
            v-model="user.id"
            type="text" />
        </div>
      </div>
      <div class="rulesDesc">
        <h2>Правила доступа</h2>
        <div class="roles">
          <div
            v-for="(rules, role) in PERMISSION_RULES"
            :key="role"
            class="roleCard"
            :class="{ active: user.role === role }"
            @click="setUser(role)">
            <h3 class="roleTitle">{{ role }}</h3>
            <div class="permissions">
              <div
                v-for="({ description, condition }, action) in rules"
                :key="action"
                class="permission">
                <div class="actionName">
                  {{ action }}
                </div>
                <div class="permissionInfo">
                  <div class="description">
                    {{ description }}
                  </div>
                  <code class="condition">
                    {{ condition }}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="examples">
      <Demo :key="componentKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { Role } from './user'

import { ref, watch } from 'vue'
import { user } from './user'
import Demo from './PermissionDemo.vue'

const USER_ROLES = ['admin', 'user'] as const satisfies Array<Role>

const PERMISSION_RULES = {
  admin: {
    create: { description: 'Всегда разрешено', condition: 'true' },
    read: { description: 'Всегда разрешено', condition: 'true' },
    delete: { description: 'Всегда разрешено', condition: 'true' },
    reset: {
      description: 'Только завершенные задачи',
      condition: "task.status === 'done'"
    }
  },
  user: {
    create: { description: 'Запрещено', condition: 'false' },
    read: { description: 'Всегда разрешено', condition: 'true' },
    delete: {
      description: 'Только незавершенные задачи',
      condition: "task.status !== 'done'"
    },
    reset: {
      description: 'Только свои завершенные задачи',
      condition: "task.status === 'done' && task.executorId === user.id"
    }
  }
} as const satisfies Record<Role, Record<string, { description: string; condition: string }>>

const componentKey: Ref<number> = ref(0)
watch(
  user,
  () => {
    componentKey.value++
  },
  { deep: true }
)

const setUser = (role: Role) => (user.value.role = role)
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  margin: 0 auto;
}

.userControls {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  width: max-content;
}

.permissionsInfo {
  flex: 1;
  margin: 0 10px;
}

.rulesDesc {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.roles {
  display: flex;
  gap: 16px;
}

.roleCard {
  flex: 1;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.2s;
  cursor: pointer;
}

.roleCard.active {
  border-color: #42b983;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.roleTitle {
  margin: 0 0 1rem;
  color: #2c3e50;
  text-transform: capitalize;
  font-size: 1.25rem;
}

.permissions {
  display: grid;
  gap: 1rem;
}

.permission {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.actionName {
  min-width: 80px;
  font-weight: 500;
  color: #42b983;
  text-transform: capitalize;
}

.permissionInfo {
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
  width: fit-content;
}
</style>

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
</style>

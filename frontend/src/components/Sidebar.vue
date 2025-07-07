<template>
  <div class="bg-slate-800 text-white w-64 min-h-screen py-4 px-2 shadow-lg">
    <div class="px-4 py-3 border-b border-slate-700">
      <h2 class="text-xl font-bold">Admin Panel</h2>
    </div>

    <nav class="mt-6">
      <ul class="space-y-2">
        <li>
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-3 rounded-lg transition-colors"
            :class="
              isActive('/dashboard')
                ? 'bg-cyan-700 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            "
          >
            <span class="mr-3">📊</span>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/users"
            class="flex items-center px-4 py-3 rounded-lg transition-colors"
            :class="
              isActive('/users')
                ? 'bg-cyan-700 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            "
          >
            <span class="mr-3">👥</span>
            <span>Users</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/leave-requests"
            class="flex items-center px-4 py-3 rounded-lg transition-colors"
            :class="
              isActive('/leave-requests')
                ? 'bg-cyan-700 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            "
          >
            <span class="mr-3">📝</span>
            <span>Leave Requests</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/settings"
            class="flex items-center px-4 py-3 rounded-lg transition-colors"
            :class="
              isActive('/settings')
                ? 'bg-cyan-700 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            "
          >
            <span class="mr-3">⚙️</span>
            <span>Settings</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/add-employee"
            class="flex items-center px-4 py-3 rounded-lg transition-colors"
            :class="
              isActive('/add-employee')
                ? 'bg-cyan-700 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            "
          >
            <span class="mr-3">👤+</span>
            <span>Add Employee</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "Sidebar",
  setup() {
    const route = useRoute();

    const isActive = (path: string) => {
      return route.path.includes(path);
    };

    return {
      isActive,
    };
  },
});
</script>

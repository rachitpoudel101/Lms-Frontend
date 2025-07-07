<template>
  <div class="p-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p class="text-gray-600">Manage users and system settings</p>
    </div>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Users List</h2>
      </div>
      
      <div v-if="isLoading" class="p-8 text-center">
        <div class="text-gray-600">Loading users...</div>
      </div>

      <div v-else-if="errorMessage" class="p-6">
        <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>
      </div>

      <div v-else-if="users.length === 0" class="p-8 text-center text-gray-600">
        No users found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ user.first_name }} {{ user.last_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ user.role || 'User' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { user } from '../endpoints/lms'

axios.defaults.baseURL = 'http://localhost:8000'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  role?: string
}

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const users = ref<User[]>([])
    const isLoading = ref(false)
    const errorMessage = ref('')
    const router = useRouter()

    const fetchUsers = async () => {
      isLoading.value = true
      errorMessage.value = ''

      try {
        const token = localStorage.getItem('authToken')
        console.log('Token found:', token ? 'Yes' : 'No')
        
        if (!token) {
          router.push('/login')
          return
        }

        console.log('Fetching users from:', `${axios.defaults.baseURL}/${user}`)
        
        const response = await axios.get(user, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        console.log('Users API response:', response.data)
        users.value = Array.isArray(response.data) ? response.data : response.data.users || []
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          router.push('/login')
        } else {
          errorMessage.value = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch users'
        }
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      isLoading,
      errorMessage,
      fetchUsers
    }
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
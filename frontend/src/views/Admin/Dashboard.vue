<template>
  <div class="flex">
    <Sidebar />
    
    <div class="flex-1">
      <div class="p-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p class="text-gray-600">Overview of system activities</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Dashboard Stat Cards -->
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="font-semibold text-gray-500 text-sm uppercase">Total Users</h3>
            <div class="flex items-center mt-2">
              <span class="text-3xl font-bold text-gray-800">{{ users.length }}</span>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="font-semibold text-gray-500 text-sm uppercase">Pending Requests</h3>
            <div class="flex items-center mt-2">
              <span class="text-3xl font-bold text-gray-800">0</span>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="font-semibold text-gray-500 text-sm uppercase">Active Leaves</h3>
            <div class="flex items-center mt-2">
              <span class="text-3xl font-bold text-gray-800">0</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">Recent Activity</h2>
          </div>
          
          <div class="p-6">
            <p class="text-gray-600">No recent activities to display.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { user } from '../../endpoints/lms'
import Sidebar from '../../components/Sidebar.vue'

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
  components: {
    Sidebar
  },
  setup() {
    const users = ref<User[]>([])
    const isLoading = ref(false)
    const errorMessage = ref('')
    const router = useRouter()

    // Cookie utility function
    const getCookie = (name: string): string | null => {
      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
      return null;
    };
    
    const removeCookie = (name: string) => {
      document.cookie = `${name}=; Max-Age=-99999999; path=/`;
    };

    const fetchUsers = async () => {
      isLoading.value = true
      errorMessage.value = ''

      try {
        const token = getCookie('authToken')
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
          removeCookie('authToken')
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
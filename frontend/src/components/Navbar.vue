<template>
  <nav class="bg-sky-700 px-8 py-4 flex justify-between items-center shadow-md">
    <div class="flex gap-4">
        <router-link v-if="!isAdminRoute" to="/" 
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold">
          Home
        </router-link>
        <router-link v-if="!isAdminRoute" to="/about"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold">
          About
        </router-link>
        <div v-if="isAdminRoute" class="text-white font-bold px-4 py-2">
          Admin Panel
        </div>
    </div>
    <div class="flex gap-4">
      <router-link v-if="!isAuthenticated && !isLoginPage" to="/login" 
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold">
        Login
      </router-link>
      <button v-if="isAuthenticated && !isLoginPage" @click="handleLogout"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors bg-transparent border-none cursor-pointer">
        Logout
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Navbar',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authToken = ref(localStorage.getItem('authToken'))

    const isAdminRoute = computed(() => {
      const adminRoutes = [
        '/dashboard', 
        '/users', 
        '/leave-requests', 
        '/settings', 
        '/admin'
      ];
      return adminRoutes.some(path => route.path.startsWith(path));
    })

    const isLoginPage = computed(() => {
      return route.path === '/login'
    })

    const isAuthenticated = computed(() => {
      return !!authToken.value
    })
    watch(() => route.path, () => {
      authToken.value = localStorage.getItem('authToken')
    })
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken') {
        authToken.value = event.newValue
      }
    })

    const handleLogout = () => {
      localStorage.removeItem('authToken')
      authToken.value = null
      router.push('/login')
    }

    return {
      isAdminRoute,
      isLoginPage,
      isAuthenticated,
      handleLogout
    }
  }
})
</script>


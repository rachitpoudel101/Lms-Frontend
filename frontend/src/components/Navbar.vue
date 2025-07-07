<template>
  <nav class="bg-sky-700 px-8 py-4 flex justify-between items-center shadow-md">
    <div class="flex gap-4">
        <router-link to="/" 
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold">
          Home
        </router-link>
        <router-link to="/about"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold">
          About
        </router-link>
    </div>
    <div class="flex gap-4">
      <router-link to="/login" 
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold">
        Login
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Navbar',
  setup() {
    return {}
  }
})
</script>


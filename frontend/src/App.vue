<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>
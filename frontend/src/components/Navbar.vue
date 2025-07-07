<template>
  <nav class="bg-sky-700 px-8 py-4 flex justify-between items-center shadow-md">
    <div class="flex gap-4">
      <router-link
        v-if="!isAdminRoute"
        to="/"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold"
      >
        Home
      </router-link>
      <router-link
        v-if="!isAdminRoute"
        to="/about"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold"
      >
        About
      </router-link>
      <div v-if="isAdminRoute" class="text-white font-bold px-4 py-2">
        Admin Panel
      </div>
    </div>
    <div class="flex gap-4">
      <router-link
        v-if="!isAuthenticated && !isLoginPage"
        to="/login"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors router-link-active:bg-sky-700 router-link-active:text-white router-link-active:font-bold"
      >
        Login
      </router-link>
      <button
        v-if="isAuthenticated && !isLoginPage"
        @click="handleLogout"
        class="text-white no-underline px-4 py-2 rounded hover:bg-sky-600 hover:bg-opacity-60 transition-colors bg-transparent border-none cursor-pointer"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Navbar",
  setup() {
    const route = useRoute();
    const router = useRouter();

    // Cookie utility functions
    const getCookie = (name: string): string | null => {
      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(";");
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

    const authToken = ref(getCookie("authToken"));

    const isAdminRoute = computed(() => {
      const adminRoutes = [
        "/dashboard",
        "/users",
        "/leave-requests",
        "/settings",
        "/admin",
        "/add-employee",
      ];
      return adminRoutes.some((path) => route.path.startsWith(path));
    });

    const isLoginPage = computed(() => {
      return route.path === "/login";
    });

    const isAuthenticated = computed(() => {
      return !!authToken.value;
    });

    watch(
      () => route.path,
      () => {
        authToken.value = getCookie("authToken");
      },
    );

    // Monitor cookie changes (less reliable than localStorage events)
    setInterval(() => {
      const currentToken = getCookie("authToken");
      if (currentToken !== authToken.value) {
        authToken.value = currentToken;
      }
    }, 1000);

    const handleLogout = () => {
      removeCookie("authToken");
      authToken.value = null;
      router.push("/login");
    };

    return {
      isAdminRoute,
      isLoginPage,
      isAuthenticated,
      handleLogout,
    };
  },
});
</script>

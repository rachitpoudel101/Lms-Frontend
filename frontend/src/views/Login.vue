<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-80px)] p-8">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block mb-2 font-semibold text-gray-700"
            >Username:</label
          >
          <input
            type="text"
            id="username"
            v-model="username"
            required
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div>
          <label for="password" class="block mb-2 font-semibold text-gray-700"
            >Password:</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div
          v-if="errorMessage"
          class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"
        >
          {{ errorMessage }}
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full p-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { login } from "../endpoints/lms";
axios.defaults.baseURL = "http://localhost:8000"; // Adjust this to your backend URL

export default defineComponent({
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const isLoading = ref(false);
    const router = useRouter();

    // Cookie utility functions
    const setCookie = (name: string, value: string, days: number = 7) => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      const cookieValue =
        encodeURIComponent(value) +
        (days ? `; expires=${expiryDate.toUTCString()}` : "") +
        "; path=/; SameSite=Strict";
      document.cookie = `${name}=${cookieValue}`;
    };
    const handleLogin = async () => {
      errorMessage.value = "";
      isLoading.value = true;

      try {
        console.log(
          "Attempting login to:",
          `${axios.defaults.baseURL}/${login}`,
        );
        const response = await axios.post(login, {
          username: username.value,
          password: password.value,
        });
        console.log("Login response:", response.data);

        // Check for different possible token field names
        const token =
          response.data.access_token ||
          response.data.token ||
          response.data.access;

        if (token) {
          // Store token in cookie instead of localStorage
          setCookie("authToken", token);
          console.log("Token saved to cookie");
          await router.push("/dashboard");
          console.log("Redirected to dashboard");
        } else {
          console.error("No token found in response:", response.data);
          errorMessage.value = "Login successful but no token received";
        }
      } catch (error: any) {
        console.error("Login error:", error);
        console.error("Error response:", error.response?.data);
        errorMessage.value =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Login failed. Please try again.";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      password,
      errorMessage,
      isLoading,
      handleLogin,
    };
  },
});
</script>

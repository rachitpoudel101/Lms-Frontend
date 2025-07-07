<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1">
      <div class="p-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Add New Employee
          </h1>
          <p class="text-gray-600">Create a new user account</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">
              Employee Information
            </h2>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  for="firstName"
                  class="block mb-2 font-semibold text-gray-700"
                  >First Name</label
                >
                <input
                  type="text"
                  id="firstName"
                  v-model="form.firstName"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  for="lastName"
                  class="block mb-2 font-semibold text-gray-700"
                  >Last Name</label
                >
                <input
                  type="text"
                  id="lastName"
                  v-model="form.lastName"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block mb-2 font-semibold text-gray-700"
                  >Email</label
                >
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  for="username"
                  class="block mb-2 font-semibold text-gray-700"
                  >Username</label
                >
                <input
                  type="text"
                  id="username"
                  v-model="form.username"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  for="password"
                  class="block mb-2 font-semibold text-gray-700"
                  >Password</label
                >
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  for="department"
                  class="block mb-2 font-semibold text-gray-700"
                  >Department</label
                >
                <input
                  type="department"
                  id="department"
                  v-model="form.department"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  for="employee_id"
                  class="block mb-2 font-semibold text-gray-700"
                  >Employee ID</label
                >
                <input
                  type="employee_id"
                  id="department"
                  v-model="form.employee_id"
                  required
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="role" class="block mb-2 font-semibold text-gray-700"
                  >Role</label
                >
                <select
                  id="role"
                  v-model="form.role"
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
            >
              {{ errorMessage }}
            </div>

            <div
              v-if="successMessage"
              class="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"
            >
              {{ successMessage }}
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50"
              >
                {{ isLoading ? "Creating..." : "Add Employee" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";
import { user } from "../../endpoints/lms"; // Import the user endpoint from lms.ts

axios.defaults.baseURL = "http://localhost:8000";

export default defineComponent({
  name: "AddEmployee",
  components: {
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      department: "",
      role: "employee",
      employee_id: "",
    });

    // Cookie utility function
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

    const handleSubmit = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = "";
        successMessage.value = "";

        const token = getCookie("authToken");

        if (!token) {
          router.push("/login");
          return;
        }
        const response = await axios.post(
          user,
          {
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            email: form.value.email,
            employee_id: form.value.employee_id,
            username: form.value.username,
            password: form.value.password,
            department: form.value.department,
            role: form.value.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Employee added successfully:", response.data);
        successMessage.value = "Employee added successfully!";

        // Reset form after successful submission
        form.value = {
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          department: "",
          employee_id: "",
          role: "employee",
        };
      } catch (error: any) {
        console.error("Error adding employee:", error);
        errorMessage.value =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to add employee. Please try again.";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      isLoading,
      errorMessage,
      successMessage,
      handleSubmit,
    };
  },
});
</script>

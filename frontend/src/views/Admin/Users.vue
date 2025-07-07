<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1">
      <div class="p-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p class="text-gray-600">View and manage system users</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">Users List</h2>
          </div>

          <div v-if="isLoading" class="p-8 text-center">
            <div class="text-gray-600">Loading users...</div>
          </div>

          <div v-else-if="errorMessage" class="p-6">
            <div
              class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
            >
              {{ errorMessage }}
            </div>
          </div>

          <div
            v-else-if="users.length === 0"
            class="p-8 text-center text-gray-600"
          >
            No users found.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    Employee ID
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    Full Name
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    Username
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr
                  v-for="(user, index) in users"
                  :key="user.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-200"
                  >
                    {{ user.id }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200"
                  >
                    {{ user.employee_id || "-" }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-200"
                  >
                    {{ `${user.first_name} ${user.last_name}`.trim() }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200"
                  >
                    {{ user.email }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200"
                  >
                    {{ user.username }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap border-b border-gray-200"
                  >
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {{ user.role || "User" }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200"
                  >
                    <button
                      class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-1 px-3 rounded-md mr-2 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1 px-3 rounded-md transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { user } from "../../endpoints/lms";
import Sidebar from "../../components/Sidebar.vue";

axios.defaults.baseURL = "http://localhost:8000";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  employee_id?: string;
  department?: string;
  role?: string;
}

export default defineComponent({
  name: "Users",
  components: {
    Sidebar,
  },
  setup() {
    const users = ref<User[]>([]);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const router = useRouter();

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

    const removeCookie = (name: string) => {
      document.cookie = `${name}=; Max-Age=-99999999; path=/`;
    };

    const fetchUsers = async () => {
      isLoading.value = true;
      errorMessage.value = "";

      try {
        const token = getCookie("authToken");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Raw API response:", response.data);

        if (Array.isArray(response.data)) {
          users.value = response.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          users.value = response.data.users;
        } else {
          // If the API returns a different structure, try to extract users
          const extractedUsers = Object.values(response.data).filter(
            (item) => typeof item === "object" && item !== null,
          );

          if (extractedUsers.length > 0) {
            users.value = extractedUsers as User[];
            console.log("Extracted users:", users.value);
          } else {
            console.error(
              "Unable to parse users from response:",
              response.data,
            );
            errorMessage.value =
              "Unable to parse user data from server response";
            users.value = [];
          }
        }

        // Debug log each user to check field names
        users.value.forEach((user, index) => {
          console.log(`User ${index}:`, user);
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          removeCookie("authToken");
          router.push("/login");
        } else {
          errorMessage.value =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Failed to fetch users";
        }
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      isLoading,
      errorMessage,
      fetchUsers,
    };
  },
});
</script>

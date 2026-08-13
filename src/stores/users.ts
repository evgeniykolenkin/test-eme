import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User" | "Manager";
  status: "Active" | "Inactive" | "Pending";
  registrationDate: string;
}

export type SortKey = "name" | "email" | "role" | "status" | "registrationDate";
export type SortOrder = "asc" | "desc";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filterRole = ref<string>("all");
  const filterStatus = ref<string>("all");
  const sortBy = ref<SortKey>("name");
  const sortOrder = ref<SortOrder>("asc");
  const currentPage = ref(1);
  const pageSize = ref(10);

  const fetchUsers = async () => {
    if (users.value.length > 0) return;

    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );
      if (!response.ok) throw new Error("Ошибка при загрузке пользователей");

      const baseData = await response.json();

      const roles: User["role"][] = ["Admin", "User", "Manager"];
      const statuses: User["status"][] = ["Active", "Inactive", "Pending"];

      const generatedUsers: User[] = [];

      for (let i = 0; i < 10; i++) {
        baseData.forEach((user: any, index: number) => {
          const globalIndex = i * 10 + index;
          const date = new Date(
            2026,
            globalIndex % 12,
            ((globalIndex * 3) % 28) + 1,
          );

          const selectedRole = roles[
            globalIndex % roles.length
          ] as User["role"];
          const selectedStatus = statuses[
            globalIndex % statuses.length
          ] as User["status"];
          const formattedDate = date.toISOString().split("T")[0] || "";

          generatedUsers.push({
            id: globalIndex + 1,
            name: `${user.name} (${globalIndex + 1})`,
            email: `${i}_${user.email.toLowerCase()}`,
            role: selectedRole,
            status: selectedStatus,
            registrationDate: formattedDate,
          });
        });
      }

      users.value = generatedUsers;
    } catch (err: any) {
      error.value = err.message || "Что-то пошло не так";
    } finally {
      isLoading.value = false;
    }
  };

  const filteredUsers = computed(() => {
    return users.value.filter((user) => {
      const matchesRole =
        filterRole.value === "all" || user.role === filterRole.value;
      const matchesStatus =
        filterStatus.value === "all" || user.status === filterStatus.value;
      return matchesRole && matchesStatus;
    });
  });

  const sortedUsers = computed(() => {
    const list = [...filteredUsers.value];
    const key = sortBy.value;
    const order = sortOrder.value === "asc" ? 1 : -1;

    return list.sort((a, b) => {
      if (a[key] < b[key]) return -1 * order;
      if (a[key] > b[key]) return 1 * order;
      return 0;
    });
  });

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedUsers.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(sortedUsers.value.length / pageSize.value) || 1;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy.value === key) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = key;
      sortOrder.value = "asc";
    }
    currentPage.value = 1;
  };

  return {
    isLoading,
    error,
    filterRole,
    filterStatus,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
    paginatedUsers,
    totalPages,
    filteredUsers,
    fetchUsers,
    toggleSort,
  };
});

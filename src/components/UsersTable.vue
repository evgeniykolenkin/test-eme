<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useUsersStore } from "@/stores/users";
import { storeToRefs } from "pinia";

const { fetchUsers, toggleSort } = useUsersStore();
const {
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
} = storeToRefs(useUsersStore());

watch(
  [() => filterRole.value, () => filterStatus.value, () => pageSize.value],
  () => {
    currentPage.value = 1;
  },
);

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="table-wrapper">
    <div class="table-controls">
      <div class="control-group">
        <label>Роль:</label>
        <div class="select-wrapper">
          <select v-model="filterRole" class="table-select">
            <option value="all">Все роли</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
      </div>

      <div class="control-group">
        <label>Статус:</label>
        <div class="select-wrapper">
          <select v-model="filterStatus" class="table-select">
            <option value="all">Все статусы</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div class="control-group control-group--size">
        <label>Показывать по:</label>
        <div class="select-wrapper">
          <select v-model.number="pageSize" class="table-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="table-status">
      Загрузка данных пользователей...
    </div>
    <div v-else-if="error" class="table-status table-status--error">
      {{ error }}
    </div>

    <div v-else class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th @click="toggleSort('name')" class="sortable">
              Имя
              <span class="sort-icon">{{
                sortBy === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""
              }}</span>
            </th>
            <th @click="toggleSort('email')" class="sortable">
              Email
              <span class="sort-icon">{{
                sortBy === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""
              }}</span>
            </th>
            <th @click="toggleSort('role')" class="sortable">
              Роль
              <span class="sort-icon">{{
                sortBy === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""
              }}</span>
            </th>
            <th @click="toggleSort('status')" class="sortable">
              Статус
              <span class="sort-icon">{{
                sortBy === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""
              }}</span>
            </th>
            <th @click="toggleSort('registrationDate')" class="sortable">
              Дата регистрации
              <span class="sort-icon">{{
                sortBy === "registrationDate"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="font-semibold">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span
                :class="['badge', `badge--role-${user.role.toLowerCase()}`]"
                >{{ user.role }}</span
              >
            </td>
            <td>
              <span
                :class="['badge', `badge--status-${user.status.toLowerCase()}`]"
                >{{ user.status }}</span
              >
            </td>
            <td class="color-gray">{{ user.registrationDate }}</td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="5" class="table-empty-row">
              Пользователи с выбранными фильтрами не найдены
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="totalPages > 1">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination__btn"
        >
          Назад
        </button>
        <span class="pagination__info">
          Страница <strong>{{ currentPage }}</strong> из
          {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination__btn"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.table-wrapper {
  width: 100%;
}

.table-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid $color-gray;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
  }

  &--size {
    margin-left: auto;
  }
}

.select-wrapper {
  position: relative;
  display: inline-block;

  &::after {
    content: "▼";
    font-size: 11px;
    color: #64748b;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  &:focus-within::after {
    color: $color-primary;
  }
}

.table-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid $color-gray;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  color: $color-dark;
  outline: none;
  cursor: pointer;
  width: 100%;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    border-color: $color-primary;
  }
}

.table-container {
  border: 1px solid $color-gray;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 15px;

  th,
  td {
    padding: 14px 18px;
    border-bottom: 1px solid $color-gray;
  }

  th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    user-select: none;

    &.sortable {
      cursor: pointer;
      &:hover {
        background-color: #f1f5f9;
        color: $color-dark;
      }
    }
  }

  tbody tr {
    transition: background-color 0.15s ease;

    &:last-child td {
      border-bottom: none;
    }

    &:hover {
      background-color: #f8fafc;
    }
  }
}

.sort-icon {
  display: inline-block;
  font-size: 11px;
  margin-left: 4px;
  color: $color-primary;
}

.table-empty-row {
  text-align: center;
  color: #94a3b8;
  padding: 40px !important;
  font-style: italic;
}

.table-status {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #64748b;

  &--error {
    color: #ef4444;
  }
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;

  &--role-admin {
    background-color: #fee2e2;
    color: #ef4444;
  }
  &--role-user {
    background-color: #e0f2fe;
    color: #0284c7;
  }
  &--role-manager {
    background-color: #fef3c7;
    color: #d97706;
  }

  &--status-active {
    background-color: #dcfce7;
    color: #16a34a;
  }
  &--status-inactive {
    background-color: #f1f5f9;
    color: #64748b;
  }
  &--status-pending {
    background-color: #f3e8ff;
    color: #9333ea;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background-color: #f8fafc;
  border-top: 1px solid $color-gray;

  &__btn {
    padding: 8px 16px;
    border: 1px solid $color-gray;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: #cbd5e1;
      background-color: #f1f5f9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__info {
    font-size: 14px;
    color: #475569;
  }
}

.font-semibold {
  font-weight: 600;
}
.color-gray {
  color: #64748b;
}

@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .control-group {
    justify-content: space-between;

    &--size {
      margin-left: 0;
    }
  }

  .select-wrapper {
    width: 60%;
  }

  .table-select {
    width: 100%;
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .users-table {
    min-width: 850px;

    th,
    td {
      padding: 12px 14px;
      font-size: 14px;
    }
  }
}
</style>

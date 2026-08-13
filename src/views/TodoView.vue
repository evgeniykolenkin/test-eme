<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from "vue";
import { useTodoStore, type TodoFilter } from "@/stores/todolist";
import { storeToRefs } from "pinia";

const { updateTodoText, removeTodo, addTodo, changeFilter, toggleTodoStatus } =
  useTodoStore();
const { currentFilter, filteredTodos } = storeToRefs(useTodoStore());

const editInputsRef = useTemplateRef<HTMLInputElement[]>("editInputs");

const newTodoText = ref("");
const editingId = ref<string | null>(null);
const editingText = ref("");

const startEdit = async (id: string, text: string) => {
  editingId.value = id;
  editingText.value = text;

  await nextTick();

  if (editInputsRef.value) {
    const targetInput = editInputsRef.value.find(
      (input) => input.dataset.id === id,
    );
    targetInput?.focus();
  }
};

const saveEdit = (id: string) => {
  if (editingId.value === null) return;

  if (editingText.value.trim()) {
    updateTodoText(id, editingText.value);
  } else {
    removeTodo(id);
  }
  editingId.value = null;
};

const cancelEdit = () => {
  editingId.value = null;
};

const handleBlur = (event: FocusEvent) => {
  const target = event.relatedTarget as HTMLElement | null;

  if (target && target.classList.contains("todo-btn--save")) {
    return;
  }

  cancelEdit();
};

const handleAddTodo = () => {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value);
    newTodoText.value = "";
  }
};
</script>

<template>
  <section class="todo-section">
    <h1 class="todo-title">Список задач</h1>

    <form @submit.prevent="handleAddTodo" class="todo-form">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="Добавь задачу"
        class="todo-input"
      />
      <button
        type="submit"
        class="todo-btn todo-btn--add"
        aria-label="Добавить задачу"
      >
        <span class="todo-btn__text">Добавить</span>
        <span class="todo-btn__icon">＋</span>
      </button>
    </form>

    <div class="todo-filters">
      <button
        v-for="filter in ['all', 'active', 'completed'] as TodoFilter[]"
        :key="filter"
        @click="changeFilter(filter)"
        :class="[
          'filter-btn',
          { 'filter-btn--active': currentFilter === filter },
        ]"
      >
        <span v-if="filter === 'all'">Все</span>
        <span v-if="filter === 'active'">Активные</span>
        <span v-if="filter === 'completed'">Выполненные</span>
      </button>
    </div>

    <ul class="todo-list" v-if="filteredTodos.length > 0">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="['todo-item', { 'todo-item--completed': todo.completed }]"
      >
        <div class="todo-item__main">
          <label class="checkbox-container">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodoStatus(todo.id)"
            />
            <span class="checkmark"></span>
          </label>

          <div class="todo-item__content-wrapper">
            <span
              v-if="editingId !== todo.id"
              class="todo-item__text"
              @dblclick="startEdit(todo.id, todo.text)"
              title="Двойной клик для редактирования"
            >
              {{ todo.text }}
            </span>

            <input
              v-else
              ref="editInputs"
              :data-id="todo.id"
              v-model="editingText"
              type="text"
              class="todo-input todo-input--edit"
              @blur="handleBlur"
              @keydown.enter="saveEdit(todo.id)"
              @keydown.esc="cancelEdit"
            />
          </div>
        </div>

        <div class="todo-item__actions">
          <button
            v-if="editingId === todo.id"
            @click="saveEdit(todo.id)"
            class="todo-btn todo-btn--save"
            title="Сохранить изменения"
            tabindex="0"
          >
            ✔️
          </button>

          <button
            v-else-if="!todo.completed"
            @click="startEdit(todo.id, todo.text)"
            class="todo-btn todo-btn--edit"
            title="Редактировать задачу"
          >
            ✏️
          </button>

          <button
            @click="removeTodo(todo.id)"
            class="todo-btn todo-btn--delete"
            aria-label="Delete todo"
          >
            &times;
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="todo-empty">Список задач пуст...</p>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.todo-section {
  background: $color-light;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  margin: 0 auto;
}

.todo-title {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: $color-dark;
}

.todo-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid $color-gray;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: $color-primary;
  }

  &--edit {
    height: 36px;
    padding: 0 10px;
    margin: 0;
    font-size: 16px;
    width: 100%;
    border: 1px solid $color-primary;
    border-radius: 6px;
    box-sizing: border-box;
    display: block;
  }
}

.todo-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &--add {
    background-color: $color-primary;
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &__icon {
    display: none;
    font-size: 20px;
    line-height: 1;
  }

  &--edit,
  &--save {
    background: none;
    font-size: 14px;
    padding: 0 4px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  &--delete {
    background: none;
    color: #ef4444;
    font-size: 24px;
    padding: 0 4px;
    line-height: 1;
    border: none;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #b91c1c;
    }
  }
}

.todo-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid $color-gray;
  padding-bottom: 16px;
}

.filter-btn {
  background: none;
  border: 1px solid transparent;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    color: $color-dark;
    background-color: #f1f5f9;
  }

  &--active {
    background-color: $color-primary !important;
    color: white !important;
  }
}

.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 52px;
  padding: 8px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #cbd5e1;
  transition: all 0.2s;
  box-sizing: border-box;

  &:hover {
    background-color: #f1f5f9;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    margin-right: 16px;
  }

  &__content-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 36px;
  }

  &__text {
    font-size: 16px;
    line-height: 36px;
    cursor: pointer;
    word-break: break-all;
    user-select: none;
    display: block;
    width: 100%;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &--completed {
    border-left-color: $color-primary;

    .todo-item__text {
      text-decoration: line-through;
      color: #94a3b8;
    }
  }
}

.todo-empty {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  margin-top: 20px;
}

.checkbox-container {
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkmark {
      background-color: $color-primary;
      border-color: $color-primary;

      &:after {
        display: block;
      }
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #fff;
    border: 2px solid #cbd5e1;
    border-radius: 4px;
    transition: all 0.2s;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 5px;
      top: 0px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}

@media (max-width: 576px) {
  .todo-section {
    padding: 20px 16px;
    border-radius: 8px;
  }

  .todo-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .todo-form {
    gap: 8px;
    margin-bottom: 16px;
  }

  .todo-input {
    padding: 10px 12px;
    font-size: 15px;
  }

  .todo-btn--add {
    padding: 0;
    width: 44px;
    height: 44px;
    flex-shrink: 0;

    .todo-btn__text {
      display: none;
    }

    .todo-btn__icon {
      display: block;
    }
  }

  .todo-filters {
    gap: 4px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    justify-content: space-between;
  }

  .filter-btn {
    padding: 6px 10px;
    font-size: 13px;
    flex: 1;
    text-align: center;
  }

  .todo-list {
    gap: 8px;
  }

  .todo-item {
    padding: 6px 12px;
    min-height: 46px;

    &__main {
      margin-right: 8px;
      gap: 10px;
    }

    &__content-wrapper {
      min-height: 32px;
    }

    &__text {
      font-size: 15px;
      line-height: 32px;
    }

    &__actions {
      gap: 4px;
    }
  }

  .todo-input--edit {
    height: 32px;
    font-size: 15px;
    padding: 0 8px;
  }

  .todo-btn--delete {
    font-size: 20px;
  }
}
</style>

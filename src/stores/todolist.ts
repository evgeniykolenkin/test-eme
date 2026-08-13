import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export type TodoFilter = "all" | "active" | "completed";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<TodoItem[]>(
    JSON.parse(localStorage.getItem("eme-todos") || "[]"),
  );

  const currentFilter = ref<TodoFilter>("all");

  const filteredTodos = computed(() => {
    if (currentFilter.value === "active") {
      return todos.value.filter((todo) => !todo.completed);
    }
    if (currentFilter.value === "completed") {
      return todos.value.filter((todo) => todo.completed);
    }
    return todos.value;
  });

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    todos.value.push({
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    });
  };

  const removeTodo = (id: string) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  };

  const updateTodoText = (id: string, newText: string) => {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo && newText.trim()) {
      todo.text = newText.trim();
    }
  };

  const toggleTodoStatus = (id: string) => {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };

  const changeFilter = (filter: TodoFilter) => {
    currentFilter.value = filter;
  };

  watch(
    todos,
    (newTodos) => {
      localStorage.setItem("eme-todos", JSON.stringify(newTodos));
    },
    { deep: true },
  );

  return {
    todos,
    currentFilter,
    filteredTodos,
    addTodo,
    removeTodo,
    updateTodoText,
    toggleTodoStatus,
    changeFilter,
  };
});

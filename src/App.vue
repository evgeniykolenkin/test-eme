<script setup>
import { ref, computed } from 'vue'

// Состояние: список задач
const todos = ref([
  { id: 1, text: 'Изучить Vue 3.5', done: true },
  { id: 2, text: 'Развернуть проект на GitLab', done: false }
])

// Состояние: текст новой задачи
const newTodoText = ref('')

// Функция добавления задачи
const addTodo = () => {
  if (!newTodoText.value.trim()) return
  
  todos.value.push({
    id: Date.now(),
    text: newTodoText.value.trim(),
    done: false
  })
  
  newTodoText.value = '' // Очищаем поле ввода
}

// Функция удаления задачи
const removeTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id)
}

// Счетчик оставшихся задач
const activeCount = computed(() => {
  return todos.value.filter(todo => !todo.done).length
})
</script>

<template>
  <div class="todo-app">
    <h2>Мой список задач</h2>

    <!-- Форма добавления -->
    <form @submit.prevent="addTodo" class="todo-form">
      <input 
        v-model="newTodoText" 
        type="text" 
        placeholder="Что нужно сделать?" 
        maxlength="50"
      />
      <button type="submit">Добавить</button>
    </form>

    <!-- Список задач -->
    <ul v-if="todos.length" class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.done }">
        <label>
          <input type="checkbox" v-model="todo.done" />
          <span>{{ todo.text }}</span>
        </label>
        <button @click="removeTodo(todo.id)" class="delete-btn">&times;</button>
      </li>
    </ul>
    
    <p v-else class="empty-msg">Список задач пуст. Отдыхайте!</p>

    <!-- Статистика -->
    <div class="todo-footer">
      <span>Осталось сделать: {{ activeCount }}</span>
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: sans-serif;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

h2 {
  margin-top: 0;
  color: #333;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.todo-form input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.todo-form button {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-form button:hover {
  background-color: #35495e;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.todo-list li label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.completed span {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}

.delete-btn:hover {
  color: #cc0000;
}

.empty-msg {
  color: #666;
  font-style: italic;
  text-align: center;
}

.todo-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}
</style>

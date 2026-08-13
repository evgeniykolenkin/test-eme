<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from "vue";

interface Post {
  id: number;
  title: string;
  body: string;
}

const posts = ref<Post[]>([]);
const isLoading = ref(false);
const isFinished = ref(false);
const page = ref(1);
const limit = 10;

const loadTriggerRef = useTemplateRef<HTMLElement>("loadTrigger");
let observer: IntersectionObserver | null = null;

const loadMorePosts = async () => {
  if (isLoading.value || isFinished.value) return;

  isLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page.value}&_limit=${limit}`,
    );

    if (!response.ok) throw new Error("Ошибка загрузки ленты");

    const data: Post[] = await response.json();

    if (data.length < limit) {
      isFinished.value = true;
    }

    posts.value.push(...data);
    page.value++;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        loadMorePosts();
      }
    },
    {
      rootMargin: "100px",
    },
  );

  if (loadTriggerRef.value) {
    observer.observe(loadTriggerRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer && loadTriggerRef.value) {
    observer.unobserve(loadTriggerRef.value);
  }
});
</script>

<template>
  <div class="feed-wrapper">
    <div class="posts-list">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <span class="post-card__id">#{{ post.id }}</span>
        <h3 class="post-card__title">{{ post.title }}</h3>
        <p class="post-card__body">{{ post.body }}</p>
      </article>
    </div>

    <div v-if="isLoading" class="skeleton-list">
      <div v-for="n in 3" :key="n" class="skeleton-card">
        <div class="skeleton-card__shimmer"></div>
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--body-1"></div>
        <div class="skeleton-line skeleton-line--body-2"></div>
      </div>
    </div>

    <div ref="loadTrigger" class="load-trigger"></div>

    <div v-if="isFinished" class="feed-end">
      <p>Вы просмотрели все доступные посты!</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.feed-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid $color-gray;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &__id {
    font-size: 12px;
    font-weight: 700;
    color: $color-primary;
    background-color: #dcfce7;
    padding: 2px 6px;
    border-radius: 4px;
    position: absolute;
    top: 16px;
    right: 16px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $color-dark;
    margin-bottom: 12px;
    padding-right: 40px;
    text-transform: capitalize;
  }

  &__body {
    font-size: 15px;
    line-height: 1.6;
    color: #475569;
  }
}

.skeleton-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid $color-gray;
  margin-top: 20px;
  position: relative;
  overflow: hidden;

  &__shimmer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100-percent
    );
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: loading-shimmer 1.5s infinite linear;
    opacity: 0.15;
    inset: 0;
  }
}

.skeleton-line {
  background-color: #e2e8f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  animation: pulse 1.5s infinite ease-in-out;

  &--title {
    width: 60%;
    height: 20px;
    margin-bottom: 16px;
  }

  &--body-1 {
    width: 100%;
    height: 14px;
    margin-bottom: 8px;
  }

  &--body-2 {
    width: 85%;
    height: 14px;
  }
}

.load-trigger {
  height: 20px;
  margin-top: 10px;
}

.feed-end {
  text-align: center;
  padding: 30px;
  color: #64748b;
  font-weight: 500;
  font-style: italic;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>

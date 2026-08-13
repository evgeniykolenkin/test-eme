<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UsersTable from "@/components/UsersTable.vue";
import PostsFeed from "@/components/PostsFeed.vue";

const route = useRoute();
const router = useRouter();

interface TabItem {
  id: string;
  title: string;
}

const tabs: TabItem[] = [
  { id: "users", title: "Таблица пользователей" },
  { id: "feed", title: "Бесконечный скролл" },
];

const DEFAULT_TAB_ID = "users";

const activeTabId = computed({
  get() {
    return (route.query.tab as string) || DEFAULT_TAB_ID;
  },
  set(newTabId: string) {
    router.replace({
      query: { ...route.query, tab: newTabId },
    });
  },
});
</script>

<template>
  <section class="tabs-section">
    <h1 class="tabs-title">Табы</h1>

    <div class="tabs-container">
      <div class="tabs-nav" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          :aria-selected="activeTabId === tab.id"
          :class="[
            'tabs-nav__btn',
            { 'tabs-nav__btn--active': activeTabId === tab.id },
          ]"
          @click="activeTabId = tab.id"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="tabs-content">
        <Transition name="fade-slide" mode="out-in">
          <div :key="activeTabId" class="tabs-content__panel">
            <div v-if="activeTabId === 'users'">
              <UsersTable />
            </div>

            <div v-else-if="activeTabId === 'feed'">
              <PostsFeed />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.tabs-section {
  background: $color-light;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.tabs-title {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: $color-dark;
}

.tabs-container {
  display: flex;
  flex-direction: column;
  border: 1px solid $color-gray;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8fafc;
  width: 100%;
}

.tabs-nav {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid $color-gray;
  gap: 4px;
  padding: 0 8px;

  &__btn {
    background: none;
    border: none;
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    position: relative;
    transition: color 0.2s ease;
    user-select: none;

    &:hover {
      color: $color-dark;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: $color-primary;
      transform: scaleX(0);
      transition: transform 0.23s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &--active {
      color: $color-primary;
      font-weight: 600;

      &::after {
        transform: scaleX(1);
      }
    }
  }
}

.tabs-content {
  padding: 24px;
  min-height: 300px;
  background-color: #fff;
  width: 100%;

  &__panel {
    width: 100%;

    h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: $color-dark;
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(5px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}
</style>

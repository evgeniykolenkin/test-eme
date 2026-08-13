<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { routesOrder } from "./router";
import AppHeader from "./components/AppHeader.vue";

const router = useRouter();
const route = useRoute();

const showScrollTop = ref(false);

const taskTitle = computed(() => {
  const currentName = route.name as string;
  if (currentName === "todo") return "Список задач";
  if (currentName === "tabs") return "Табы";
  return "Тестовое задание";
});

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const navigate = (direction: "next" | "prev") => {
  const currentName = route.name as string;
  const currentIndex = routesOrder.indexOf(currentName);

  if (currentIndex === -1) return;

  let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

  if (newIndex >= routesOrder.length) newIndex = 0;
  if (newIndex < 0) newIndex = routesOrder.length - 1;

  router.push({ name: routesOrder[newIndex] });
};
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="main-content">
      <div class="container">
        <div class="page-wrapper">
          <router-view />
        </div>

        <div class="task-navigation">
          <div class="task-navigation__core">
            <button
              class="arrow-btn arrow-btn--left"
              @click="navigate('prev')"
              aria-label="Previous task"
            >
              <img src="/images/arrow-right.png" alt="Prev" />
            </button>

            <h2 class="task-navigation__title">{{ taskTitle }}</h2>

            <button
              class="arrow-btn arrow-btn--right"
              @click="navigate('next')"
              aria-label="Next task"
            >
              <img src="/images/arrow-right.png" alt="Next" />
            </button>
          </div>

          <Transition name="fade-up">
            <button
              v-if="showScrollTop"
              class="scroll-top-btn"
              @click="scrollToTop"
              title="Наверх"
              aria-label="Scroll to top"
            >
              ▲
            </button>
          </Transition>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
@use "sass:color";
@use "@/assets/styles/variables" as *;

.main-content {
  padding: 40px 0 160px 0;
}

.task-navigation {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - ($container-padding * 2));
  max-width: calc(#{$container-max-width} - ($container-padding * 2));
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid $color-gray;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1);
  z-index: 90;
  display: flex;
  justify-content: center;

  &__core {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $color-dark;
    margin: 0;
    text-align: center;
    min-width: 140px;
  }
}

.scroll-top-btn {
  position: absolute;
  right: 12px;
  top: -60px;
  background-color: $color-primary;
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(66, 184, 131, 0.3);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    background-color: color.adjust(#42b883, $lightness: -5%);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.page-wrapper {
  padding: 0;
  width: 100%;
}

.arrow-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 36px;
    height: 36px;
    display: block;
  }

  &--left {
    transform: scaleX(-1);

    &:hover {
      transform: scaleX(-1) scale(1.1);
    }
  }

  &--right {
    &:hover {
      transform: scale(1.1);
    }
  }
}

.fade-up-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-leave-active {
  transition: all 0.2s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  transform: translateY(15px);
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 0 130px 0;
  }

  .task-navigation {
    bottom: 16px;
    padding: 10px 16px;

    &__core {
      gap: 16px;
    }

    &__title {
      font-size: 15px;
      min-width: 110px;
    }
  }

  .scroll-top-btn {
    top: -52px;
    width: 36px;
    height: 36px;
    font-size: 12px;
    right: 8px;
  }

  .arrow-btn img {
    width: 28px;
    height: 28px;
  }
}
</style>

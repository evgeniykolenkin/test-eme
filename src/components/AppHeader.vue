<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "./BaseModal.vue";

const router = useRouter();
const isMenuOpen = ref(false);

const isHidden = ref(false);
let lastScrollY = 0;

const navigateTo = (path: string, query?: Record<string, string>) => {
  isMenuOpen.value = false;
  router.push({ path, query });
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 80) {
    isHidden.value = false;
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY && currentScrollY > 160) {
    isHidden.value = true;
  } else if (currentScrollY < lastScrollY) {
    isHidden.value = false;
  }

  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header :class="['header', { 'header--hidden': isHidden }]">
    <div class="container header__wrapper">
      <a
        href="https://eme.ru/"
        target="_blank"
        rel="noopener noreferrer"
        class="header__logo"
      >
        <img src="/images/eme.png" alt="Logo" />
      </a>

      <button
        class="burger-btn"
        @click="isMenuOpen = true"
        aria-label="Open Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <BaseModal :isOpen="isMenuOpen" @close="isMenuOpen = false">
    <div class="burger-menu">
      <h2 class="burger-menu__title">Меню</h2>

      <p class="burger-menu__description">
        Это <strong>Модальное окно</strong> со слотом
      </p>

      <nav class="burger-menu__nav">
        <div class="nav-group">
          <button @click="navigateTo('/todo')" class="nav-link">
            TODO-лист
          </button>
        </div>

        <div class="nav-group">
          <button @click="navigateTo('/tabs')" class="nav-link">Табы</button>

          <ul class="nav-sublist">
            <li class="nav-sublist__item">
              <button
                @click="navigateTo('/tabs', { tab: 'users' })"
                class="nav-sublist__btn"
              >
                Таблица пользователей
              </button>
            </li>
            <li class="nav-sublist__item">
              <button
                @click="navigateTo('/tabs', { tab: 'feed' })"
                class="nav-sublist__btn"
              >
                Бесконечный скролл
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <hr class="burger-menu__divider" />

      <div class="burger-menu__contacts">
        <h3>Контакты & Репозиторий</h3>
        <p>
          Email:
          <a href="mailto:yosik-kolenkin@yandex.ru" class="contact-link">
            your-email@example.com
          </a>
        </p>

        <p>
          Telegram:
          <a href="https://t.me/kolenochkin" target="_blank" rel="noopener"
            >@kolenochkin</a
          >
        </p>
        <p>
          GitHub:
          <a
            href="https://github.com/evgeniykolenkin/test-eme"
            target="_blank"
            rel="noopener"
            >Репозиторий проекта</a
          >
        </p>
      </div>

      <footer class="burger-menu__footer">
        Было интересно выполнять эти тестовые задания, спасибо!
      </footer>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background-color: $color-light;
  border-bottom: 1px solid $color-gray;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);

  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;

  &--hidden {
    transform: translateY(-100%);
    box-shadow: none;
  }

  &__wrapper {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    img {
      height: 80px;
      display: block;
    }
  }
}

.header-spacer {
  height: 80px;
  width: 100%;
}

.burger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;

  span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: $color-dark;
    border-radius: 2px;
    transition: background-color 0.2s ease;
  }

  &:hover span {
    background-color: $color-primary;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 4px;
  }
}

.burger-menu {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__title {
    font-size: 22px;
    font-weight: 600;
    color: $color-dark;
    margin-bottom: 8px;
  }

  &__description {
    font-size: 14px;
    line-height: 1.5;
    color: #64748b;
    margin-bottom: 32px;
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 6px;
    border: 1px dashed $color-gray;

    strong {
      color: $color-primary;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.nav-group {
  display: flex;
  flex-direction: column;
}

.nav-link {
  background: none;
  border: 1px solid $color-gray;
  padding: 14px 16px;
  border-radius: 8px;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  color: $color-dark;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: #f8fafc;
    border-color: $color-primary;
    color: $color-primary;
  }
}

.nav-sublist {
  list-style: none;
  padding-left: 20px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-left: 2px solid $color-gray;
  margin-left: 16px;

  &__btn {
    background: none;
    border: none;
    padding: 6px 12px;
    text-align: left;
    font-size: 14px;
    color: #64748b;
    cursor: pointer;
    width: 100%;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
    border-radius: 4px;

    &:hover {
      color: $color-primary;
      transform: translateX(2px);
      background-color: #f8fafc;
    }
  }
}

.burger-menu__divider {
  border: none;
  border-top: 1px solid $color-gray;
  margin: 32px 0;
}

.burger-menu__contacts {
  h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 12px;
  }

  p {
    font-size: 15px;
    margin-bottom: 8px;
    color: $color-dark;

    a {
      color: $color-primary;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.burger-menu__footer {
  margin-top: auto;
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  font-style: italic;
  border-left: 3px solid $color-primary;
  padding-left: 12px;
}
</style>

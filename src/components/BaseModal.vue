<script setup lang="ts">
import { watch, onBeforeUnmount, useTemplateRef } from "vue";

const { isOpen = false } = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

let previousActiveElement: HTMLElement | null = null;

const contentRef = useTemplateRef<HTMLElement>("modalContent");

const focusableSelectors =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const handleFocusTrap = (event: KeyboardEvent) => {
  if (event.key !== "Tab" || !contentRef.value) return;

  const focusableElements =
    contentRef.value.querySelectorAll<HTMLElement>(focusableSelectors);

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;
  const activeEl = document.activeElement as HTMLElement;

  if (event.shiftKey) {
    if (activeEl === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  } else {
    if (activeEl === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    emit("close");
  }
};

const cleanup = () => {
  window.removeEventListener("keydown", handleFocusTrap, true);
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
};

watch(
  () => isOpen,
  (newVal) => {
    if (newVal) {
      previousActiveElement = document.activeElement as HTMLElement | null;

      window.addEventListener("keydown", handleFocusTrap, true);
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const focusableElements =
          contentRef.value?.querySelectorAll<HTMLElement>(focusableSelectors);
        if (focusableElements && focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      }, 50);
    } else {
      cleanup();
      previousActiveElement?.focus();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  cleanup();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="burger-fade">
      <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
        <div ref="modalContent" class="modal-content" @click.stop>
          <button
            class="modal-close-btn"
            @click="emit('close')"
            aria-label="Close menu"
          >
            &times;
          </button>

          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use "@/assets/styles/variables" as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}

.modal-content {
  background-color: #fff;
  width: 100%;
  max-width: 400px;
  height: 100%;
  box-shadow: -10px 0 25px rgba(0, 0, 0, 0.1);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  font-size: 36px;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $color-dark;
  }
}

.burger-fade-enter-active,
.burger-fade-leave-active {
  transition: opacity 0.3s ease;

  .modal-content {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.burger-fade-enter-from,
.burger-fade-leave-to {
  opacity: 0;

  .modal-content {
    transform: translateX(100%);
  }
}
</style>

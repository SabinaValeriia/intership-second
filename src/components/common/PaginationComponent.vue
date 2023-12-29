<template lang="pug">
.pagination
  ul
    li(
      :class="{ disabled: currentPage === 1 }",
      @click="changePage(currentPage - 1)"
    )
      i.icon.arrow
    li(
      v-for="(pageNumber, index) in totalPages",
      :key="index",
      :class="{ active: currentPage === pageNumber }",
      @click="changePage(pageNumber)"
    ) {{ pageNumber }}
    li(
      :class="{ disabled: currentPage === totalPages }",
      @click="changePage(currentPage + 1)"
    )
      i.icon.arrow
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  totalItems: {},
  itemsPerPage: {},
  isLoaded: { default: true, type: Boolean },
});

const emit = defineEmits(["onPageChange"]);

const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);
const changePage = (newPage: number) => {
  currentPage.value = newPage;
  emit("onPageChange", newPage);
};
</script>

<style lang="scss" scoped>
.pagination {
  margin: 40px 0 16px;
  @include media_mobile {
    margin: 20px 0 76px 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    @include media_mobile {
      justify-content: center;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 44px;
      height: 44px;
      margin: 0 4px;
      border-radius: 8px;
      z-index: 3;
      @include font(16px, 400, 24px, var(--text));
      @include media_mobile {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }

      &:hover {
        background-color: var(--primary);

        i.arrow {
          &::before {
            background: var(--text);
          }
        }
      }

      i.arrow {
        height: 11px;

        &::before {
          background: var(--accent);
        }
      }

      &.disabled {
        pointer-events: none;

        i.arrow {
          &::before {
            background: var(--placeholder);
          }
        }

        &:hover {
          background: transparent;
        }
      }

      &:first-child {
        transform: rotate(90deg);
        @include media_mobile {
          position: absolute;
          left: 0;
        }
      }

      &:last-child {
        transform: rotate(-90deg);
        @include media_mobile {
          position: absolute;
          right: 0;
        }
      }
    }

    .active {
      background-color: var(--accent);
      color: var(--white);

      &:hover {
        background-color: var(--accent);
      }
    }
  }
}
</style>

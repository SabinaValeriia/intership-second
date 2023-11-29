<template lang="pug">
.pagination
  ul
    li(
      @click="changePage(currentPage - 1)",
      :class="{ disabled: currentPage === 1 }"
    )
      i.icon.arrow
    li(
      v-for="pageNumber in totalPages",
      :key="pageNumber",
      @click="changePage(pageNumber)",
      :class="{ active: currentPage === pageNumber }"
    ) {{ pageNumber }}
    li(
      @click="changePage(currentPage + 1)",
      :class="{ disabled: currentPage === totalPages }"
    )
      i.icon.arrow
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

const props = defineProps(["totalItems", "itemsPerPage", "onPageChange"]);

const emit = defineEmits(["onPageChange"]);

const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);
const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    emit("onPageChange", newPage);
  }
};
</script>

<style scoped lang="scss">
.pagination {
  margin: 40px 0 16px;
  @include media_mobile {
    margin: 20px 0 0;
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
      margin: 0 5px;
      border-radius: 4px;
      @include font(16px, 400, 24px, var(--text));
      @include media_mobile {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }
      &:hover {
        background-color: var(--primary);
      }
      i.arrow {
        &::before {
          background: var(--accent);
        }
      }
      &.disabled {
        i.arrow {
          height: 12px;
          &::before {
            background: var(--placeholder);
          }
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
    }
  }
}
</style>

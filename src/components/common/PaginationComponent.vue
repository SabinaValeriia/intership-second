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
      :class="{ active: pageNumber === currentPage }"
    ) {{ pageNumber }}
    li(
      @click="changePage(currentPage + 1)",
      :class="{ disabled: currentPage === totalPages }"
    )
      i.icon.arrow
</template>

<script>
export default {
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    onPageChange: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.onPageChange(newPage);
      }
    },
  },
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

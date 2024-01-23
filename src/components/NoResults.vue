<template lang="pug">
.no-results
  .no-work-project(v-if="noWorkProject")
    img(:src="require(`@/assets/icons/no-search.svg`)")
    div
      h3 We don’t have places to show here yet
      p You hasn’t worked in any projects in the last 90 days.
  img(
    v-else,
    :src="require(`@/assets/icons/${noData || noUser || noPlace ? 'no-search' : 'no-data'}.svg`)",
    :class="{ 'no-search': noData || noUser || noPlace, 'no-data': !(noData || noUser || noPlace) }"
  )
  h2(v-if="noData") Wait!
  p(v-if="noData") You have no projects created, please create new one.
  p(v-if="noResults") No results found, try to reset filters
  p.tasks(v-if="noDataTask") You have no tasks created, please create new one.
  div(v-if="noUser")
    h3 There is no work to see here
    p Things {{ userName + " " }}
      | worked on in the last 90 days.
  div(v-if="noPlace")
    h3 We don’t have places to show here yet
    p {{ userName + " " }}
      | hasn’t worked in any projects in the last 90 days.
  common-button.btn-secondary(
    v-if="noData || noResults || noDataTask",
    @click="noData || noDataTask ? create() : reset()"
  ) {{ noData || noDataTask ? "Create" : "Reset" }}
</template>

<script lang="ts" setup>
import { openModal } from "@/composables/modalActions";
import CommonButton from "./common/CommonButton.vue";
import { defineEmits, defineProps } from "vue";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import { useRoute } from "vue-router";

const props = defineProps({
  noResults: {
    type: Boolean,
    default: false,
  },
  noWorkProject: {
    type: Boolean,
    default: false,
  },
  noData: {
    type: Boolean,
    default: false,
  },
  noDataTask: {
    type: Boolean,
    default: false,
  },
  noUser: {
    type: Boolean,
    default: false,
  },
  noPlace: {
    type: Boolean,
    default: false,
  },
  userName: {
    type: String,
  },
});

const emit = defineEmits(["reset"]);
const route = useRoute();

const reset = () => {
  emit("reset");
};
const create = () => {
  if (route.path.includes("issues")) {
    openModal(EnumModalKeys.ModalCreateIssues);
  } else {
    openModal(EnumModalKeys.ModalCreate);
  }
};
</script>
<style lang="scss" scoped>
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .no-work-project {
    display: flex;
    align-items: center;
    gap: 36px;
    padding: 35px 111px;
    margin: 7px 0 60px 0;
    border-radius: 4px;
    border: 1px solid var(--secondary);

    h3 {
      margin: 0;
      width: 232px;
      @include font(16px, 500, 20px, var(--text));
    }

    p {
      width: 194px;
      @include font(12px, 400, 16px, var(--text));
      text-align: left;
      margin-top: 6px;
    }

    img {
      margin: 0;
      width: 140px;
      height: 120px;
    }
  }

  button {
    z-index: 5;
  }

  &.user-results {
    flex-direction: row;
    padding: 16px 8px;
    @include media_tablet {
      padding: 26px 18px;
    }
    @include media_mobile {
      padding: 16px 26px;
      flex-direction: column;
    }

    img {
      height: 120px;
      width: 140px;
      margin: 0 36px 0 0;

      @include media_tablet {
        height: 106px;
        width: 122px;
      }
      @include media_mobile {
        height: 84px;
        width: 98px;
        margin: 0;
      }
    }

    h3 {
      @include font(16px, 500, 20px, var(--text));
      margin: 0 0 6px 0;
      @include media_mobile {
        font-size: 14px;
        line-height: 20px;
        margin: 10px 0 6px;
        text-align: center;
      }
    }

    p {
      @include font(12px, 400, 16px, var(--text));
      max-width: 229px;
      text-align: left;

      &.tasks {
        max-width: 250px;
      }

      @include media_mobile {
        font-size: 11px;
        line-height: 14px;
        text-align: center;
      }

      s {
        margin: 0 3px;
      }
    }
  }

  &.menu-no {
    border-bottom: 1px solid var(--primary);
    margin-bottom: 16px;

    img {
      width: 140px;
      height: 120px;
      margin-top: 27px;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 20px;
      line-height: 28px;
    }

    p {
      font-size: 14px;
      line-height: 20px;
      width: 200px;
    }

    button {
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      width: 77px;
      height: 44px;
      box-sizing: border-box;
      margin: 12px 0 35px 0;
    }
  }

  img {
    margin-top: 74px;
    margin-bottom: 24px;

    &.no-data {
      @include media_mobile {
        width: 150px;
        height: 149px;
        margin-top: 77px;
      }
    }

    @include media_mobile {
      width: 140px;
      height: 120px;
    }
  }

  h2 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0;
    @include media_mobile {
      font-size: 14px;
      line-height: 20px;
    }
  }

  p {
    @include font(18px, 500, 26px, var(--text));
    margin: 0;
    text-align: center;
    text-wrap: wrap;
    @include media_mobile {
      font-size: 14px;
      line-height: 20px;
      width: 200px;
    }
  }

  button {
    margin-top: 16px;
    width: 100px;
    height: 52px;
    @include media_mobile {
      height: 44px;
      width: 71px;
    }
  }
}
</style>

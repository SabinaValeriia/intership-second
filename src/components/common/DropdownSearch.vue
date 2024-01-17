<template lang="pug">
.drop-down(v-if="isOpen", ref="dropdownRef", :class="classType")
  .drop-down--section
    form
      .form-group
        input(v-model="searchText", placeholder="Placeholder")
        i.icon.search
    dropdown-list(
      :tags="tags",
      :type="type",
      :data="data",
      :class="{ tags, checkbox: type === 'checkbox' }",
      :title="title",
      :checked-item="checkedItem",
      :filtered-data="filteredData",
      :members-data="membersData",
      @selectedItem="onSelectedItem",
      @clear="clear",
      @allItem="allItem"
    )
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onUnmounted, ref, watch } from "vue";
import DropdownList from "@/components/common/DropdownList.vue";
import { selectedItemInterface } from "@/types/selectedItemInterface";

const props = defineProps({
  data: { type: Array },
  tags: { type: Boolean },
  type: { type: String },
  isOpen: { type: Boolean },
  title: { type: String },
  classType: { type: String, default: "big" },
  checkedItem: { type: Array },
  filteredData: { type: Array },
  membersData: { type: String, default: "false" },
});
const emit = defineEmits(["selectedItem", "close", "clear", "allItem"]);
const searchText = ref("");
const onSelectedItem = (selectedItem: selectedItemInterface) => {
  emit("selectedItem", selectedItem);
};

const dropdownRef = ref(null);

const clickOutsideHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    dropdownRef.value &&
    !(dropdownRef.value as HTMLElement).contains(target)
  ) {
    emit("close");
  }
};

const clear = () => {
  emit("clear");
};

const allItem = (item: [{ name: string; id: number }]) => {
  emit("allItem", item);
};

const filteredData = ref(props.data);

watch(searchText, () => {
  filterData();
});
watch(
  () => props.data,
  () => {
    filterData();
  }
);
const filterData = () => {
  const searchLowerCase = searchText.value.toLowerCase();
  filteredData.value = props.data.filter((item) =>
    item.name.toLowerCase().includes(searchLowerCase)
  );
};

onMounted(() => {
  document.addEventListener("click", clickOutsideHandler);
});

onUnmounted(() => {
  document.removeEventListener("click", clickOutsideHandler);
});
</script>

<style lang="scss" scoped>
.drop-down {
  border-radius: 8px;
  color: var(--black);
  border: 1px solid var(--grey-line);
  z-index: 100;
  position: absolute;
  top: 47px;

  &.big {
    width: 240px;
    @include media_mobile {
      width: calc(100% - 28px);
      &.lead {
        width: 100%;
        top: 78px;
      }
    }
  }

  &.small {
    width: 220px;
    @include media_mobile {
      width: 100%;
    }
  }

  &.tags-block {
    @include media_mobile {
      top: 155px;
      left: 14px;
      position: fixed;
    }
  }

  @include media_mobile {
    top: 38px;
  }

  &.lead {
    top: 88px;
    @include media_mobile {
      top: 70px;
    }
  }

  &.members-dd {
    top: 61px;
    @include media_mobile {
      top: 70px;
    }
  }

  &.error {
    border: 1px solid var(--red);
  }

  &--section {
    position: relative;
    width: 100%;
    height: 100%;

    i.search {
      top: 7px;
      left: 16px;
      @include media_mobile {
        top: 5px;
        left: 14px;
      }
    }

    input {
      padding: 14px 16px 14px 48px;
      height: 52px;
      position: absolute;
      top: -8px;
      border-radius: 4px 4px 0 0;
      @include media_mobile {
        padding: 12px 12px 12px 37px;
        height: 40px;
      }
    }
  }
}
</style>

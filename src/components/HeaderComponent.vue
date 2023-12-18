<template lang="pug">
.backdrop(@click="closeDropdown")
.header 
  .header-block__left 
    a
      i.icon.logo_header
    ul
      li 
        a(@click="toggleDropdown('work')") Your work
      li.projects
        a(
          :class="{ active: $route.path.includes('projects') }",
          @click="toggleDropdown('project')"
        ) Projects
        dropdown-menu(
          :isOpen="dropdownStates.project.isOpen",
          title="Starred",
          :project="true",
          :type="'projects'"
        )
      li.projects
        a(
          :class="{ active: $route.path.includes('teams') }",
          @click="toggleDropdown('teams')"
        ) Teams
        dropdown-menu(
          :isOpen="dropdownStates.teams.isOpen",
          title="Starred",
          :type="'teams'"
        )
    common-button.btn-secondary(
      v-if="$route.path.includes('projects')",
      @click="openModal(EnumModalKeys.ModalCreate)"
    ) Create
  .header-block__right
    form
      .form-group
        .form-icon
          input.header--input(placeholder="Placeholder")
          i.icon.search
    i.icon.search.tablet
    i.icon.info_second.header_icon
    i.icon.setting.header_icon
    img.avatar(
      v-if="userStore.user.image",
      :src="JSON.parse(userStore.user.image.name)",
      :alt="'avatar'"
    )
    .header__avatar.avatar(v-else) {{ logoName }}
  .header__mobile
    img.avatar(
      v-if="userStore.user.image",
      :src="JSON.parse(userStore.user.image.name)",
      :alt="'avatar'",
      @click="openModal(EnumModalKeys.ModalHeader)"
    )
    .header__avatar(v-else, @click="openModal(EnumModalKeys.ModalHeader)") {{ logoName }}
    h3(v-if="isRouteActive('projects')") Projects
    h3(v-if="$route.path.includes('teams')") People
    i.icon.plus(
      v-if="$route.path.includes('projects')",
      @click="openModal(EnumModalKeys.ModalCreate)"
    )
    i.icon.plus.people(v-if="$route.path.includes('teams')")
modal-header(v-if="isOpen(EnumModalKeys.ModalHeader)")
modal-create(
  v-if="isOpen(EnumModalKeys.ModalCreate)",
  @close="close",
  @newProject="newProject",
  :create="true",
  @closeModal="close"
)
</template>

<script lang="ts" setup>
import DropdownMenu from "./common/DropdownMenu.vue";
import CommonButton from "./common/CommonButton.vue";
import { isOpen, modalKeys, openModal } from "@/composables/modalActions";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import ModalHeader from "@/modals/ModalHeader.vue";
import ModalCreate from "@/modals/ModalCreate.vue";
import { computed, ref, onMounted, watch } from "vue";
const route = useRoute();
import { useUserStore } from "../store/user";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const fullName = computed(() => {
  const username = userStore.user.username || "";
  return username;
});
const emit = defineEmits(["newProject"]);
const dropdownStates = ref({
  work: { isOpen: false },
  project: { isOpen: false },
  teams: { isOpen: false },
});

const newProject = () => {
  emit("newProject");
};

const closeDropdown = () => {
  dropdownStates.value.work.isOpen = false;
  dropdownStates.value.project.isOpen = false;
};

const toggleDropdown = (dropdownName) => {
  dropdownStates.value[dropdownName].isOpen =
    !dropdownStates.value[dropdownName].isOpen;
};

const logoName = computed(() => {
  const fullNameValue = fullName.value;
  return fullNameValue ? fullNameValue.charAt(0).toUpperCase() : 0;
});

const close = () => {
  openModal(EnumModalKeys.ModalCreate);
};
const isRouteActive = (routeName: string) => {
  if (route.name === routeName) {
    return true;
  }
};
onMounted(() => {
  watch(
    () => route.path,
    (newPath) => {
      if (newPath.includes("projects")) {
        dropdownStates.value.project.isOpen = false;
      } else {
        dropdownStates.value.teams.isOpen = false;
      }
    }
  );
  modalKeys.value["modal-header"] = false;
});
</script>

<style scoped lang="scss">
.header {
  background: var(--primary);
  box-shadow: var(--box-shadow-main);
  padding: 4px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  box-sizing: border-box;
  @include media_mobile {
    position: fixed;
    width: 100%;
    z-index: 3;
    top: 0;

    height: 56px;
  }
  &__avatar {
    height: 44px;
    width: 44px;
    border: 2px solid var(--secondary);
    background: var(--background);
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include font(16px, 600, 20px, var(--text));
    box-sizing: border-box;
    &:hover {
      outline: 8px solid var(--secondary);
      border: none;
    }
  }
  @include media_tablet {
    padding: 4px 20px;
  }
  @include media_mobile {
    padding: 6px 16px;
    background: var(--accent);
  }
  &__mobile {
    display: none;
    @include media_mobile {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 25px;
        outline: 2px solid var(--secondary);
        cursor: pointer;
        &:hover {
          outline: 8px solid var(--secondary);
        }
      }
      i.plus {
        z-index: 3;
        position: relative;
        &::before {
          background: var(--white);
        }
        &.people {
          &::before {
            background: var(--accent);
          }
        }
      }
      h3 {
        @include font(16px, 500, 24px, var(--white));
        margin: 0;
      }
    }
  }
  &-block {
    &__left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include media_mobile {
        display: none;
      }
      button {
        z-index: 10;
      }
      a {
        margin-right: 46px;
        width: 55px;
        height: 72px;
        cursor: pointer;
        @include media_tablet {
          margin-right: 26px;
        }
      }
      ul {
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 0;
        li {
          text-wrap: nowrap;
          display: flex;
          align-items: center;
          margin-right: 12px;
          padding: 6px 8px;
          cursor: pointer;
          height: 34px;
          box-sizing: border-box;

          &.projects {
            position: relative;
            .menu {
              left: -2px;
            }
          }

          a {
            @include font(16px, 500, 22px, var(--text));
            width: 100%;
            height: auto;
            margin-right: 0;
            text-decoration: none;
            display: flex;
            align-items: center;
            &::after {
              content: "";
              display: inline-block;
              width: 12px;
              height: 6px;
              background: url("@/assets/icons/arrow.svg") no-repeat;
              background-size: contain;
              margin-left: 6px;
            }
            &.active {
              padding: 25px 0;
              border-bottom: 2px solid black;
            }
          }

          @include media_tablet {
            margin-right: 10px;
          }
          &:hover {
            border-radius: 4px;
            background: var(--primary-light);
          }
        }
      }
      button {
        padding: 12px 16px;
        font-size: 14px;
        line-height: 20px;
        margin-left: 10px;
        width: 77px;
        @include media_tablet {
          margin-left: 6px;
        }
      }
    }
    &__right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include media_mobile {
        display: none;
      }
      input.header--input {
        padding: 14px 16px 14px 48px;
        background: transparent;
        border: 1px solid var(--accent);
        margin-right: 30px;
        min-width: 280px;
        box-sizing: border-box;
        border-radius: 4px;
        &::placeholder {
          color: var(--text);
        }
      }
      .form-group {
        margin-bottom: 0;
        @include media_tablet {
          display: none;
        }
      }
      i {
        left: 16px;
      }
      .tablet {
        display: none;
        @include media_tablet {
          display: block;
          width: 26px;
          height: 26px;
          margin-right: 20px;
          left: 0;
          position: relative;
        }
      }
      .header_icon {
        width: 32px;
        height: 32px;
        margin-right: 16px;
        cursor: pointer;
        position: relative;
        left: 0;
        @include media_tablet {
          margin-right: 12px;
        }
      }
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 25px;
        border: 2px solid var(--secondary);
        margin-left: 14px;
        cursor: pointer;
        box-sizing: border-box;
        &:hover {
          outline: 8px solid var(--secondary);
          border: none;
        }

        @include media_tablet {
          margin-left: 4px;
        }
      }
    }
  }
}
.backdrop {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

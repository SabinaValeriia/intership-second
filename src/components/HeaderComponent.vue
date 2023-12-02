<template lang="pug">
.header 
  .header-block__left 
    a
      i.icon.logo_header
    ul
      li 
        a Your work
      li.projects
        router-link(
          to="projects",
          active-class="active",
          @click="toggleDropdown('project')"
        ) Projects
        dropdown-menu(
          :isOpen="dropdownStates.project.isOpen",
          title="Starred",
          :project="true",
          :type="'projects'"
        )
      li 
        router-link(
          to="teams",
          active-class="active",
          @click="toggleDropdown('teams')"
        ) Teams
        dropdown-menu(
          :isOpen="dropdownStates.teams.isOpen",
          title="Your Collaborators",
          :type="'teams'"
        )
        span
    common-button.btn-secondary(@click="openModal(EnumModalKeys.ModalCreate)") Create
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
      v-if="userStore.user.logo",
      :src="JSON.parse(userStore.user.logo.name)",
      :alt="'avatar'"
    )
    .header__avatar.avatar(v-else) {{ logoName }}
  .header__mobile
    img.avatar(
      v-if="userStore.user.logo",
      :src="JSON.parse(userStore.user.logo.name)",
      :alt="'avatar'",
      @click="openModal(EnumModalKeys.ModalHeader)"
    )
    .header__avatar(v-else, @click="openModal(EnumModalKeys.ModalHeader)") {{ logoName }}
    button(@click="openModal(EnumModalKeys.ModalCreate)") Create issue
modal-header(v-if="isOpen(EnumModalKeys.ModalHeader)")
modal-create(
  v-if="isOpen(EnumModalKeys.ModalCreate)",
  @close="close",
  :create="true"
)
</template>

<script lang="ts" setup>
import DropdownMenu from "./common/DropdownMenu.vue";
import CommonButton from "./common/CommonButton.vue";
import { isOpen, openModal } from "@/composables/modalActions";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import ModalHeader from "@/modals/ModalHeader.vue";
import ModalCreate from "@/modals/ModalCreate.vue";
import { computed, ref } from "vue";
import { useUserStore } from "../store/user";
const userStore = useUserStore();
const dropdownStates = ref({
  work: { isOpen: false },
  project: { isOpen: false },
  teams: { isOpen: false },
});

const fullName = computed(() => {
  const username = userStore.user.username || "";
  return username;
});

const logoName = computed(() => {
  const fullNameValue = fullName.value;
  return fullNameValue ? fullNameValue.charAt(0).toUpperCase() : 0;
});
const toggleDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName].isOpen =
    !dropdownStates.value[dropdownName].isOpen;
};
const close = () => {
  openModal(EnumModalKeys.ModalCreate);
};
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
      button {
        @include font(14px, 500, 20px, var(--white));
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;
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
</style>

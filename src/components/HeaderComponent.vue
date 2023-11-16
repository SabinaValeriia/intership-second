<template lang="pug">
.header 
  .header-block__left 
    img(:src="require(`@/assets/icons/logo_header.svg`)")
    ul
      li Your work
      li Projects
      li Teams
    common-button.btn-secondary Create
  .header-block__right
    .form-group
      .form-icon
        input(placeholder="placeholder")
        i.icon.search
    img.tablet(:src="require(`@/assets/icons/search.svg`)")
    img.header_icon(:src="require(`@/assets/icons/info_2.svg`)")
    img.header_icon(:src="require(`@/assets/icons/setting.svg`)")
    img.avatar(:src="require(`@/assets/icons/avatar.svg`)")
  .header__mobile
    img.avatar(
      :src="require(`@/assets/icons/avatar.svg`)",
      @click="openModal(EnumModalKeys.ModalHeader)"
    )
    button Create issue
modal-header(v-if="isOpen(EnumModalKeys.ModalHeader)")
</template>

<script lang="ts" setup>
import CommonButton from "./common/CommonButton.vue";
import { isOpen, openModal } from "@/composables/modalActions";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import ModalHeader from "@/modals/ModalHeader.vue";
</script>

<style scoped lang="scss">
.header {
  background: var(--primary);
  box-shadow: var(--box-shadow-main);
  padding: 4px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
      img {
        margin-right: 56px;
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
          @include font(16px, 500, 22px, var(--text));
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          @include media_tablet {
            margin-right: 16px;
          }
          &::after {
            content: "";
            display: inline-block;
            width: 12px;
            height: 6px;
            background: url("@/assets/icons/arrow.svg") no-repeat;
            background-size: contain;
            margin-left: 6px;
          }
          &:hover {
            border-radius: 4px;
            background: var(--primary-light);
            padding: 6px 8px;
          }
          &:active {
            text-decoration: underline;
            text-underline-offset: 25px;
          }
        }
      }
      button {
        padding: 12px 16px;
        font-size: 14px;
        line-height: 20px;
        margin-left: 10px;
      }
    }
    &__right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include media_mobile {
        display: none;
      }
      input {
        padding: 14px 16px 14px 48px;
        background: transparent;
        border: 1px solid var(--accent);
        margin-right: 30px;
        min-width: 280px;
      }
      @include media_tablet {
        .form-group {
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
        }
      }
      .header_icon {
        width: 32px;
        height: 32px;
        margin-right: 16px;
        cursor: pointer;
        @include media_tablet {
          margin-right: 12px;
        }
      }
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 25px;
        outline: 2px solid var(--secondary);
        margin-left: 14px;
        cursor: pointer;
        &:hover {
          outline: 8px solid var(--secondary);
        }

        @include media_tablet {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>

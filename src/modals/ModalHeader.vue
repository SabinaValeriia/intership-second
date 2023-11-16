<template lang="pug">
app-modal
  template(v-slot:content)
    .modal-header
      img(:src="require(`@/assets/icons/logo_modal.svg`)")
    .modal-body
      .modal-body__right 
        h2 Yurii Kovalenko
        p Developer
        h3 yurii.kovalenko@gmail.com
      img(:src="require(`@/assets/icons/avatar.svg`)")
    .modal-footer
      ul
        li 
          i.icon.info
          a Get info
        li 
          i.icon.setting
          a Settings
        li(@click="logOut")
          i.icon.logout
          a Log out
</template>
<script setup lang="ts">
import { openModal } from "@/composables/modalActions";
import AppModal from "./AppModal.vue";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import { useVuelidate } from "@vuelidate/core";
import { useUserStore } from "@/store/user";
import router from "@/router/routes";
const userStore = useUserStore();
const logOut = () => {
  userStore.clear();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.modal-header {
  img {
    display: block;
    margin: 12px 42% 14px;
  }
}
.modal-body {
  border-radius: 8px;
  background: var(--background);
  padding: 12px;
  margin: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h2 {
    @include font(16px, 700, 24px, var(--text));
    margin: 0;
  }
  p {
    @include font(10px, 400, 14px, var(--text));
    margin: 0;
  }
  h3 {
    @include font(12px, 500, 16px, var(--text));
    margin: 0;
  }
  img {
    width: 60px;
    height: 60px;
    border-radius: 32px;
    margin: 0;
  }
}
.modal-footer {
  margin-top: 30px;
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      border-top: 1px solid var(--primary_border);
      padding: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 56px;
      box-sizing: border-box;
      &:last-child {
        border-bottom: 1px solid var(--primary_border);
      }
      &::after {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        mask-image: url("@/assets/icons/arrow.svg");
        position: absolute;
        right: 6px;
        mask-size: contain;
        mask-repeat: no-repeat;
        background-color: var(--background);
        transform: rotate(270deg);
        display: none;
      }
      &:hover:after {
        display: inline-block;
      }

      i {
        width: 20px;
        height: 20px;
        &::before {
          background: var(--background);
        }
        &.header {
          visibility: hidden;
          &:hover {
            visibility: visible;
          }
        }
      }
      a {
        @include font(16px, 500, 24px, var(--background));
        margin-left: 32px;
      }
    }
  }
}
</style>
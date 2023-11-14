<template lang="pug">
.log-in 
  h1 Welcome
  h2 Log in to your account
  .log-in--block
    form(@submit.prevent="submit")
      .form-group(:class="getValidationClass($v, 'identifier')")
        label(for="email") Email
        input(
          v-model="form.identifier",
          placeholder="test@test.com",
          type="email",
          @blur="$v.identifier.$touch()"
        )
        span.error-message(v-if="$v.identifier.required.$invalid") This field is required.
        span.error-message(v-else-if="$v.identifier.email.$invalid") Please enter a valid email address.
      .form-group(:class="getValidationClass($v, 'password')")
        label(for="password") Password
        .form-icon
          input#InputPassword(
            v-model="form.password",
            :type="passwordVisible ? 'text' : 'password'",
            placeholder="*******",
            @blur="$v.password.$touch()"
          )
          button.password-toggle(
            @click.prevent="passwordVisible = !passwordVisible"
          ) 
            i(:class="[passwordVisible ? 'password-show' : 'password-hide']") 
        span.error-message(v-if="$v.password.required.$invalid") This field is required.
        span.error-message(v-else-if="$v.password.minLength.$invalid") Password must be at least 8 characters long.
      common-button.log-in.btn_primary Log In
      p New user?
        a Sign up
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import CommonButton from "@/components/common/CommonButton.vue";

const passwordVisible = ref(false);

interface LoginData {
  identifier: string;
  password: string;
}

const defaultState: LoginData = {
  identifier: "",
  password: "",
};

const form = ref<LoginData>({
  ...defaultState,
});

const rules = computed(() => {
  const rules: any = {
    identifier: { required, email },
    password: { required, minLength: minLength(8) },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const submit = () => {
  if (checkValidation($v.value)) {
    return;
  }
};
</script>

<style scoped lang="scss">
.log-in {
  h1 {
    text-align: center;
    margin: 0 0 8px;
    @include font(60px, 800, 66px, var(--text));
    @include media_tablet {
    }
    @include media_mobile {
      font-size: 50px;
      line-height: 54px;
    }
  }
  h2 {
    text-align: center;
    margin: 0 auto 44px;
    @include font(20px, 500, 26px, var(--text));
    @include media_mobile {
      font-size: 16px;
      line-height: 20px;
    }
  }
  &--block {
    border-radius: 6px;
    background: var(--background);
    box-shadow: var(--box-shadow-auth);
    padding: 32px 26px;
    max-width: 402px;
    box-sizing: border-box;
    height: fit-content;
    display: block;
    margin: 0 auto;
    @include media_mobile {
      max-width: calc(100% - 20px);
      padding: 24px 10px;
      margin: 0 10px;
    }
    form {
      .log-in {
        margin-top: 56px;
      }
      p {
        @include font(12px, 400, 20px, var(--text));
        text-align: center;
        cursor: pointer;
        margin: 10px 0 0;
        a {
          @include font(12px, 500, 20px, var(--text));
          text-decoration: underline;
          margin-left: 5px;
        }
      }
      .form-group {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 20px;
        &:last-of-type {
          margin-bottom: 0;
        }
        @include media_mobile {
          margin-bottom: 16px;
        }
        label {
          @include font(12px, 400, 18px, var(--text));
          margin-bottom: 8px;
          @include media_mobile {
            line-height: 16px;
            margin-bottom: 6px;
          }
        }
        input {
          border-radius: 4px;
          border: 1px solid var(--primary);
          background: var(--white);
          padding: 14px 16px;
          outline: none;
          height: 48px;
          width: 100%;
          box-sizing: border-box;
          @include font(14px, 400, 20px, var(--text));
          @include media_mobile {
            padding: 12px;
            height: 40px;
          }
          &::placeholder {
            @include font(14px, 400, 20px, var(--placeholder));
          }
          &:hover {
            border-color: var(--primary_hover);
          }
          &:focus {
            border-color: var(--primary_hover);
          }

          &.disabled {
            background: var(--background_hover);
            pointer-events: none;
          }
        }
        .form-icon {
          position: relative;
        }
        .error-message {
          display: none;
        }

        .password-toggle {
          border: none;
          background: none;
          position: absolute;
          top: 14px;
          right: 16px;
          padding: 0;
          i {
            display: block;
            width: 20px;
            height: 20px;
            background-size: cover;

            &.password-hide {
              background-image: url("../assets/img/visible-not.svg");
            }
            &.password-show {
              background-image: url("../assets/img/visible.svg");
            }
          }
          @include media_mobile {
            top: 12px;
            right: 12px;
            i {
              width: 16px;
              height: 16px;
            }
          }
        }
        &.error {
          input {
            margin-bottom: 0;
            border: 1px solid var(--error);
          }
          span {
            display: block;
            margin: 8px 0 0;
            @include font(12px, 400, 18px, var(--error));
            @include media_mobile {
              margin: 6px 0 0;
            }
          }
        }
      }
    }
  }
}
</style>

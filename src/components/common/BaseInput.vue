<template lang="pug">
.form-group(:class="type")
  label {{ capitalizeFirstLetter(`${type}`) }}
  .form-icon(@click="toggleInput(type)", v-if="withIcon")
    .grey-circle(v-if="type === 'lead'")
    input(
      :type="type",
      :placeholder="capitalizeFirstLetter(`${type}`)",
      v-model="inputVal",
      @focus="isFocused = true"
    )
    i.icon.arrow
  slot(name="errors")
</template>

<script setup lang="ts">
import { getValidationClass, checkValidation } from "@/types/authValidation";
import { defineProps, defineEmits, computed, ref } from "vue";
const props = defineProps({
  type: { type: String },
  withIcon: { type: Boolean, default: false },
  valueInput: {
    type: String,
  },
});

const emit = defineEmits(["open", "setData"]);

const open = ref(false);

const inputVal = computed({
  get() {
    return props.valueInput;
  },
  set(val) {
    emit("setData", val);
  },
});
const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
const toggleInput = (type) => {
  emit("open", type);
};
</script>

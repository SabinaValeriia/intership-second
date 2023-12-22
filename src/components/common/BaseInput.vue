<template lang="pug">
.form-group(:class="type")
  .label-group
    label {{ capitalizeFirstLetter(`${type}`) }}
    i.icon.arrow.mobile(:class="{ open }", @click="toggleInput")
  .form-icon(v-if="open")
    slot(name="prefix")
    input(
      v-model="inputVal",
      :type="type",
      :placeholder="capitalizeFirstLetter(`${type}`)",
      :class="{ withIcon }",
      @focus="isFocused = true"
    )
    slot(name="suffix")
  slot(name="errors")
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, watch } from "vue";
const props = defineProps({
  type: { type: String },
  valueInput: {
    type: String,
  },
  isError: { type: Boolean },
  withIcon: { type: Boolean, default: false },
});

const emit = defineEmits(["setData"]);

const open = ref(true);

const inputVal = computed({
  get() {
    return props.valueInput;
  },
  set(val) {
    emit("setData", val);
  },
});

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
const toggleInput = () => {
  event.stopPropagation();
  open.value = !open.value;
};
watch(
  () => props.isError.error,
  (newError) => {
    if (newError) {
      open.value = true;
    }
  }
);
</script>

<template lang="pug">
.form-group(:class="type")
  .label-group(@click="toggleInput")
    label {{ capitalizeFirstLetter(`${type}`) }}
    i.icon.arrow.mobile(:class="{ active: open }")
  .form-icon(v-if="open")
    slot(name="icon")
    input(
      :type="type",
      :placeholder="capitalizeFirstLetter(`${type}`)",
      v-model="inputVal",
      @focus="isFocused = true",
      :class="{ withIcon }"
    )
    slot(name="arrow")
  slot(name="errors")
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from "vue";
const props = defineProps({
  type: { type: String },
  valueInput: {
    type: String,
    required: true,
  },
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
  open.value = !open.value;
};
</script>

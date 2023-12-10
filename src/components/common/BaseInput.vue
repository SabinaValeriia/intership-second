<template lang="pug">
.form-group(:class="type")
  .label-group
    label {{ capitalizeFirstLetter(`${type}`) }}
    i.icon.arrow.mobile(@click="toggleInput", :class="{ open }")
  .form-icon(v-if="open")
    slot(name="prefix")
    input(
      :type="type",
      :placeholder="capitalizeFirstLetter(`${type}`)",
      v-model="inputVal",
      @focus="isFocused = true",
      :class="{ withIcon }"
    )
    slot(name="suffix")
  slot(name="errors")
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from "vue";
const props = defineProps({
  type: { type: String },
  valueInput: {
    type: String,
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
  event.stopPropagation();
  open.value = !open.value;
};
</script>

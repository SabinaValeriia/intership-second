<template lang="pug">
.form-group.image(:class="type")
  .label-group(@click="toggleInput")
    label(for="logo") Image logo
    i.icon.arrow.mobile.image(:class="{ active: open }")
  .form-item(v-if="!userImage.length && open")
    input.img(
      type="file",
      name="expense",
      accept="image/*",
      @change="onFileChange($event)"
    )
    label.label
      .foto
      | Upload a check image (click or drag)
      br
      | JPG, PNG, WEBP (up to 1 mb)
    label.details
      .foto
      | Upload new image
  .image--blocks(v-if="userImage.length && open")
    .image--block(v-for="(image, index) in userImage", :key="index")
      img.image(
        v-if="image",
        :src="JSON.parse(image.base64)",
        :alt="`image_${index}`"
      )
      button.close(@click="deleteImage(image)")
        i.icon.icon-close
  slot(name="errors")
</template>
<script lang="ts" setup>
import { ImageInterface } from "@/types/ImageInterface";
import { defineEmits, defineProps, ref } from "vue";

const props = defineProps({
  type: { type: String },
});
const emit = defineEmits(["file"]);
const open = ref(true);
const userImage = ref<ImageInterface[]>([]);
const onFileChange = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  if (target && target.files && target.files.length) {
    const toBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    toBase64(target.files[0]).then((res) => {
      userImage.value = [];
      if (target && target.files && target.files.length) {
        userImage.value.push({
          base64: JSON.stringify(res),
          blob: target.files[0],
        });
        emit("file", userImage);
      }
    });
  }
};

const deleteImage = (image: ImageInterface) => {
  const indexToDelete = userImage.value.findIndex((index) => index === image);
  if (indexToDelete !== -1) {
    userImage.value.splice(indexToDelete, 1);
  }
};

const toggleInput = () => {
  open.value = !open.value;
};
</script>

<style lang="scss" scoped>
.form-group.image.details-image {
  width: 145px;
  height: 64px;
  @include media_tablet {
    width: 213px;
  }
  @include media_mobile {
    width: 135px;
    height: 54px;
  }

  .label-group {
    display: none;
  }

  input {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    width: inherit;
  }

  label.details {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    @include font(10px, 400, 12px, var(--text));
  }

  label.label {
    display: none;
  }

  .form-item {
    border-radius: 4px;
    border: 1px dashed var(--primary);
    background: var(--white);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 145px;
    height: 64px;
    box-sizing: border-box;
    @include media_tablet {
      width: 213px;
    }
    @include media_mobile {
      width: 135px;
      height: 54px;
    }
  }

  .foto {
    background: var(--primary);
    width: 25px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;

    &::before {
      content: "";
      display: inline-block;
      background: url("@/assets/icons/foto.svg");
      background-size: contain;
      width: 11px;
      height: 9px;

      @include media_mobile {
        width: 11px;
        height: 9px;
      }
    }
  }
}

.image--blocks {
  display: flex;
  gap: 8px;
  @include media_mobile {
    &.show {
      display: none;
    }
  }

  label.details {
    display: none;
  }

  .image--block {
    position: relative;
    height: 120px;
    width: 120px;
  }

  img.image {
    width: 120px;
    height: 120px;
    border-radius: 6px;
    object-fit: cover;
    position: relative;
    top: 0;
    left: 0;
  }

  button.close {
    border-radius: 16px;
    border: none;
    background: var(--white);
    box-shadow: 0px 4px 8px 0px rgba(61, 55, 52, 0.08),
      0px 2px 4px 0px rgba(61, 55, 52, 0.08),
      0px 0px 2px 0px rgba(61, 55, 52, 0.16);

    width: 22px;
    height: 22px;
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      width: 9px;
      height: 9px;

      &.icon-close::before {
        background: var(--primary);
      }
    }
  }
}
</style>

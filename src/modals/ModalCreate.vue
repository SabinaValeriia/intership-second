<template lang="pug">
app-modal
  template(v-slot:content)
    .modal-header
      h1 Create project
    .modal-body
      .modal-body__block 
        form(@submit.prevent="submit")
          .form-group.title(:class="getValidationClass($v, 'title')")
            label(for="title") Title
            i.icon.arrow.mobile(@click="showTitle = !showTitle")
            input(
              :class="{ show: showTitle }",
              placeholder="Test project",
              type="text",
              @blur="$v.title.$touch()",
              v-model="form.title"
            )
            span.error-message(v-if="$v.title.required.$invalid") This field is required.
          .form-group.key(:class="getValidationClass($v, 'key')")
            label(for="key") Key
            i.icon.arrow.mobile(@click="showKey = !showKey")
            input(
              :class="{ show: showKey }",
              placeholder="TestP",
              type="text",
              @blur="$v.key.$touch()",
              v-model="form.key"
            )
            span.error-message(v-if="$v.key.required.$invalid") This field is required.
          .form-group(:class="getValidationClass($v, 'image')")
            label(for="logo") Image logo
            i.icon.arrow.mobile(@click="showLogo = !showLogo")
            .form-item(
              v-if="!userImage.length",
              :class="(getValidationClass($v, 'image'), { show: showLogo })"
            )
              input(
                type="file",
                name="expense",
                accept="image/*",
                @change="onFileChange($event)"
              )
              label.label
                | Upload a check image (click or drag)
                br
                | JPG, PNG, WEBP (up to 5 mb)
            span.error-message(
              v-if="$v.image.required.$invalid && !userImage.length"
            ) This field is required.
            .image--blocks(v-if="userImage.length")
              .image--block(v-for="(image, index) in userImage", :key="index")
                img.image(
                  :src="JSON.parse(image.base64)",
                  :alt="`image_${index}`"
                )
                button.close(@click="deleteImage(image)")
                  i.icon.icon-close
          .form-group.desc(:class="getValidationClass($v, 'description')")
            label(for="description") Description
            i.icon.arrow.mobile(@click="showDesc = !showDesc")
            textarea(
              rows="4",
              cols="50",
              placeholder="Enter description",
              v-model="form.description",
              :class="(getValidationClass($v, 'description'), { show: showDesc })"
            )
            span.error-message(v-if="$v.description.required.$invalid") This field is required.
          .form-group
            .position
              label.tag Tags:
              .tags(v-for="(tag, index) in form.tags", :key="index") {{ tag.tag }}
                i.icon.close(@click="deleteTag(tag)")
              common-button.btn_icon.btn_primary(@click="add", v-if="showAdd") Add
            dropdown-component.tag(
              v-if="tagsShow",
              :data="tagNames",
              @selectedItem="selectedItem",
              @closed="closed"
            )
          .position.mobile
            .form-group.lead(:class="getValidationClass($v, 'lead')")
              label Lead
              i.icon.arrow.mobile(@click="showLead = !showLead")
              .form-icon
                img(
                  v-if="form.lead.logo",
                  :src="JSON.parse(form.lead.logo.name)",
                  alt="logo",
                  :class="{ show: showLead }"
                )
                .grey-circle(v-else, :class="{ show: showLead }")
                input(
                  :class="{ show: showLead }",
                  placeholder="Yurii Kovalenko",
                  v-model="form.lead.leadName",
                  @click="leadShow = !leadShow"
                )
                i.icon.arrow(
                  :class="({ active: leadShow }, { show: showLead })"
                )
              dropdown-component.lead(
                v-if="leadShow",
                :data="leadNames",
                @selectedItem="selectedItem",
                @closed="closed",
                :iconHere="true"
              )
              span.error-message(v-if="$v.lead.required.$invalid") This field is required.
            .form-group.members(:class="getValidationClass($v, 'members')")
              label Members
              i.icon.arrow.mobile(@click="showMembers = !showMembers")
              .form-icon
                input(
                  :class="{ show: showMembers }",
                  placeholder="Yurii Kovalenko",
                  @click="membersShow = !membersShow",
                  v-model="form.members"
                )
                i.icon.arrow(
                  :class="({ active: membersShow }, { show: showMembers })"
                )
              dropdown-component.lead(
                v-if="membersShow",
                :data="membersNames",
                @selectedItem="selectedItem",
                @closed="closed",
                :iconHere="true"
              )
              span.error-message(v-if="$v.members.required.$invalid") This field is required.
    .modal-footer
      common-button.cancel.btn-secondary-line(@click="close") Cancel
      common-button.save.btn-secondary(@click="save") Create
</template>
<script setup lang="ts">
import DropdownComponent from "@/components/common/DropdownComponent.vue";
import AppModal from "./AppModal.vue";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import { useVuelidate } from "@vuelidate/core";
import CommonButton from "@/components/common/CommonButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { ImageInterface } from "@/types/ImageInterface";
import { showTags } from "@/services/api/tagsApi";
import { showUsers } from "@/services/api/userApi";
import { required } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import { projectPost } from "@/services/api/projectApi";

const userImage = ref<ImageInterface[]>([]);
const tagsShow = ref(false);
const showAdd = ref(true);
const leadShow = ref(false);
const membersShow = ref(false);
const tagNames = ref([]);
const members = ref([]);
const tags = ref([]);
const leadNames = ref([]);
const membersNames = ref([]);
const showTitle = ref(false);
const showKey = ref(false);
const showLogo = ref(false);
const showDesc = ref(false);
const showLead = ref(false);
const showMembers = ref(false);

const selectedItem = (tag: string) => {
  if (leadShow.value) {
    form.value.lead = tag;
    leadShow.value = false;
  } else if (tagsShow.value) {
    form.value.tags.push(tag);
    if (form.value.tags.length === tagNames.value.length) {
      showAdd.value = false;
      tagsShow.value = false;
    }
    tags.value.push(tag.id.toString());
  } else {
    const leadName = tag.leadName;
    form.value.members = form.value.members.includes(leadName)
      ? form.value.members.filter((member) => member !== leadName)
      : [...form.value.members, leadName];
    if (form.value.members.length === membersNames.value.length) {
      membersShow.value = false;
    }
    members.value.push(tag.id.toString());
  }
};

const deleteTag = (tag) => {
  form.value.tags.splice(tag, 1);
  if (form.value.tags.length !== tagNames.value.length) {
    showAdd.value = true;
  }
};
const closed = () => {
  tagsShow.value = false;
  showAdd.value = false;
  leadShow.value = false;
};
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
        form.value.image = userImage.value[0].base64;
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

const add = () => {
  tagsShow.value = true;
};

interface ProjectData {
  title: string;
  key: string;
  description: string;
  lead: string;
  members: string;
  image: string;
  tags: any;
}

const defaultState: ProjectData = {
  title: "",
  key: "",
  description: "",
  lead: "",
  image: "",
  members: "",
  tags: [],
};

const form = ref<ProjectData>({
  ...defaultState,
});

const rules = computed(() => {
  const rules: any = {
    title: { required },
    key: { required },
    description: { required },
    lead: { required },
    image: {
      required,
    },
    members: { required },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const updateFormKey = () => {
  if (form.value.title) {
    const words = form.value.title.split(" ");
    form.value.key = words
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
};

watch(() => form.value.title, updateFormKey);

const save = () => {
  if (checkValidation($v.value)) {
    return;
  }
  const dataProject = {
    data: {
      title: form.value.title,
      key: form.value.key,
      description: form.value.description,
      logo: {
        name: form.value.image,
      },
      lead: form.value.lead.id.toString(),
      members: Array.from(members.value),
      tags: Array.from(tags.value),
    },
  };
  projectPost(dataProject).then(({ data }) => {
    close();
  });
};
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

onMounted(() => {
  showTags().then(({ data }) => {
    tagNames.value = data.data.map((item) => ({
      tag: item.attributes.name,
      id: item.id,
    }));
    console.log(data);
  });
  showUsers().then(({ data }) => {
    leadNames.value = data.map((item) => ({
      leadName: item.username,
      logo: item.logo,
      id: item.id,
    }));
    membersNames.value = leadNames.value;
  });
});
</script>

<style lang="scss" scoped>
.modal-header {
  h1 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0 0 16px;
    @include media_mobile {
      font-size: 14px;
      line-height: 20px;
      margin: 0 0 14px;
      text-align: center;
    }
  }
}
.modal-body {
  &__block {
    display: flex;
  }
  form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    i.arrow {
      right: 16px;
      top: 20px;
      width: 14px;
      height: 14px;
      @include media_mobile {
        top: 17px;
      }
      &.show {
        display: none;
      }
      &.active {
        transform: rotate(180deg);
        top: 14px;
        @include media_mobile {
          top: 11px;
        }
      }
    }
    .position {
      display: flex;
      align-items: center;
      &.mobile {
        @include media_mobile {
          flex-direction: column;
          width: 100%;
        }
      }
    }
    .form-item {
      margin-bottom: 0;
      &.show {
        display: none;
      }
    }
    .form-group {
      width: 100%;
      margin-bottom: 16px;
      @include media_mobile {
        margin-bottom: 10px;
      }
      .grey-circle {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-right: 8px;
        background: var(--placeholder);
        position: absolute;
        top: 14px;
        left: 16px;
        @include media_mobile {
          top: 12px;
          left: 12px;
        }
        &.show {
          display: none;
        }
      }
      img {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-right: 8px;
        top: 14px;
        left: 16px;
        @include media_mobile {
          top: 10px;
          left: 12px;
        }
        &.show {
          display: none;
        }
      }
      label {
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;
        @include media_mobile {
          font-size: 12px;
          line-height: 16px;
        }
      }
      i.arrow.mobile {
        width: 12px;
        height: 12px;
        right: 0;
        top: 5px;
        display: none;
        @include media_mobile {
          display: block;
        }
      }
      label.tag {
        &::before {
          display: none;
        }
      }
      input {
        &.show {
          display: none;
        }
      }
      &.lead {
        margin-right: 16px;
        input {
          padding: 14px 16px 14px 44px;
          width: 224px;
          @include media_mobile {
            padding: 12px 12px 12px 40px;
          }
        }
        @include media_mobile {
          margin-right: 0;
          input {
            width: 100%;
          }
        }
      }
      &.members {
        input {
          width: 372px;
          @include media_mobile {
            width: 100%;
          }
        }
      }
      label.tag {
        margin-bottom: 0;
      }

      button.close {
        width: 22px;
        height: 22px;
      }

      button {
        padding: 10px 8px;
        width: 62px;
        height: 32px;
        box-sizing: border-box;
        font-size: 14px;
        line-height: 20px;
        margin-left: 8px;
        &:before {
          mask-image: url("@/assets/icons/plus.svg");
          background: var(--white);
        }
        @include media_mobile {
          padding: 4px 8px;
          width: 54px;
          height: 24px;
          font-size: 12px;
          line-height: 16px;
        }
      }
      .tags {
        position: relative;
        display: flex;
        align-items: center;
        padding: 6px 8px 6px 22px;
        border-radius: 8px;
        border: none;
        background: var(--accent);
        @include font(14px, 400, 20px, var(--white));
        margin-left: 8px;
        i.close {
          top: 11px;
          left: 8px;
          width: 10px;
          height: 10px;
          &::before {
            background: var(--white);
          }
        }
      }
      &.desc {
        input {
          height: 78px;
          &::placeholder {
            position: absolute;
            top: 12px;
          }
        }
      }
    }
    .title {
      width: 396px;
      margin-right: 16px;
      @include media_mobile {
        width: 100%;
        margin-right: 0;
      }
    }
    .key {
      width: 200px;
      @include media_mobile {
        width: 100%;
      }
    }
  }
  .form-item {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 120px;
    padding: 40px 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px dashed var(--primary);
    background: var(--white);
    box-sizing: border-box;
    &:hover {
      background: var(--white_shadow);
    }
    &.error {
      border-color: var(--error);
    }
    @include media_mobile {
      height: 64px;
      padding: 12px;
      box-sizing: border-box;
    }
    input {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
      filter: alpha(opacity=0);
    }
    label.label {
      display: flex;
      gap: 12px;

      @include font(14px, 400, 20px, var(--text));
      text-align: left;

      @include media_mobile {
        flex-direction: column;
        align-items: center;
        margin: 0;

        font-size: 10px;
        line-height: 14px;
        color: var(--placeholder);
        text-align: left;
        margin-left: 44px;
        margin-bottom: 0;
      }
      &::before {
        content: "";
        display: inline-block;
        background: url("@/assets/icons/foto.svg");
        background-size: cover;
        width: 40px;
        height: 40px;
        @include media_mobile {
          position: absolute;
          top: 15px;
          left: 65px;
          width: 32px;
          height: 32px;
        }
      }
    }
  }
  .image--blocks {
    display: flex;
    gap: 8px;
    .image--block {
      position: relative;
      height: 120px;
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
    button {
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
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  button {
    width: 100px;
    @include media_mobile {
      width: fit-content;
    }
    &.cancel {
      margin-right: 12px;
      @include media_mobile {
        position: absolute;
        top: 12px;
        left: 22px;
        color: var(--notify_info);
        padding: 0;
        border: none;
      }
    }
    &.save {
      @include media_mobile {
        position: absolute;
        top: 12px;
        right: 22px;
        color: var(--text);
        padding: 0;
        background: none;
      }
    }
  }
}
</style>

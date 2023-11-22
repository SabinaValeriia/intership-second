<template lang="pug">
app-modal
  template(v-slot:content)
    .modal-header
      h1 Create project
    .modal-body
      form.create
        .modal-body__block 
          .form-group.title(:class="getValidationClass($v, 'title')")
            label(for="title") Title
            i.icon.arrow.mobile(@click="toggleBlock('title')")
            input(
              placeholder="Test project",
              type="text",
              @blur="$v.title.$touch()",
              v-model="form.title",
              :class="{ show: showInput === 'title' }"
            )
            span.error-message(v-if="$v.title.required.$invalid") This field is required.
          .form-group.key(:class="getValidationClass($v, 'key')")
            label(for="key") Key
            i.icon.arrow.mobile(@click="toggleBlock('key')")
            input(
              placeholder="TestP",
              type="text",
              @blur="$v.key.$touch()",
              v-model="form.key",
              :class="{ show: showInput === 'key' }"
            )
            span.error-message(v-if="$v.key.required.$invalid") This field is required.
        .form-group(:class="getValidationClass($v, 'image')")
          label(for="logo") Image logo
          i.icon.arrow.mobile(@click="toggleBlock('image')")
          .form-item(
            v-if="!userImage.length",
            :class="(getValidationClass($v, 'image'), { show: showLogo }, { show: showInput === 'image' })"
          )
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
          span.error-message(
            v-if="$v.image.required.$invalid && !userImage.length"
          ) This field is required.
          .image--blocks(
            v-if="userImage.length",
            :class="{ show: showInput === 'image' }"
          )
            .image--block(v-for="(image, index) in userImage", :key="index")
              img.image(
                :src="JSON.parse(image.base64)",
                :alt="`image_${index}`"
              )
              button.close(@click="deleteImage(image)")
                i.icon.icon-close
        .form-group.desc(:class="getValidationClass($v, 'description')")
          label(for="description") Description
          i.icon.arrow.mobile(@click="toggleBlock('description')")
          textarea(
            rows="4",
            cols="50",
            placeholder="Enter description",
            v-model="form.description",
            :class="(getValidationClass($v, 'description'), { show: showInput === 'description' })"
          )
          span.error-message(v-if="$v.description.required.$invalid") This field is required.
        .form-group
          .position
            label.tag Tags:
            .tags(v-for="(tag, index) in form.tags", :key="index") {{ tag.tag }}
              i.icon.close(@click="deleteTag(tag)")
            common-button.btn_icon.btn_primary(
              @click.prevent="add",
              v-if="showAdd"
            ) Add
          dropdown-component.tag(
            v-if="tagsShow",
            :data="tagNames",
            @selectedItem="selectedItem",
            @closed="closed",
            :tags="true"
          )
        .position.mobile
          .position-dropdown
            base-input(
              :class="getValidationClass($v, 'lead')",
              :type="`lead`",
              :withIcon="true",
              :value-input="form.lead.leadName",
              @open="toggleInput('lead')"
            )
              template(v-slot:errors, v-if="$v.lead.required.$invalid")
                span This field is required.
            dropdown-component.lead(
              v-if="showDropdown === 'lead'",
              :data="leadNames",
              @selectedItem="selectedItem",
              @closed="closed",
              :iconHere="true"
            )
          .position-dropdown
            base-input(
              :class="getValidationClass($v, 'members')",
              :type="`members`",
              :withIcon="true",
              :value-input="form.members",
              @open="toggleInput('members')"
            )
              template(v-slot:errors, v-if="$v.members.required.$invalid")
                span This field is required.
            dropdown-component.lead(
              v-if="showDropdown === 'members'",
              :data="membersNames",
              @selectedItem="selectedItem",
              @closed="closed",
              :iconHere="true"
            )
    .modal-footer.create
      common-button.cancel.btn-secondary-line(@click="close") Cancel
      common-button.save.btn-secondary(@click="save") Create
</template>
<script setup lang="ts">
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import AppModal from "./AppModal.vue";
import { useVuelidate } from "@vuelidate/core";
import CommonButton from "@/components/common/CommonButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { ImageInterface } from "@/types/ImageInterface";
import { showUsers } from "@/services/api/userApi";
import { required } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import { projectPost } from "@/services/api/projectApi";
import BaseInput from "@/components/common/BaseInput.vue";
import {
  NotificationType,
  notifications,
  pushNotification,
} from "@/composables/notification";
import { ProjectInterface } from "@/types/projectApiInterface";
import { showTag, tagNames } from "@/composables/tagActions";

interface ProjectData {
  title: string;
  key: string;
  description: string;
  lead: string;
  members: string;
  image: string;
  tags: any;
}

const emit = defineEmits(["close"]);

const userImage = ref<ImageInterface[]>([]);
const tagsShow = ref(false);
const showAdd = ref(true);
const members = ref([]);
const tags = ref([]);
const leadNames = ref([]);
const membersNames = ref([]);
const showDropdown = ref("");
const showInput = ref("");

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

watch(
  () => form.value.title,
  (newTitle, oldTitle) => {
    if (newTitle) {
      const words = newTitle.split(" ");
      form.value.key = words
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }
  }
);

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

const toggleInput = (inputType: string) => {
  showDropdown.value = showDropdown.value === inputType ? "" : inputType;
};

const toggleBlock = (inputType: string) => {
  showInput.value = showInput.value === inputType ? "" : inputType;
};

const selectedItem = (tag: string) => {
  if (showDropdown.value === "lead") {
    form.value.lead = tag;
    toggleInput("lead");
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
      toggleInput("members");
    }
    members.value.push(tag.id.toString());
  }
};

const deleteTag = (tag: { tag: ""; id: "" }) => {
  form.value.tags.splice(tag, 1);
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
  tagsShow.value = !tagsShow.value;
};

const save = () => {
  if (checkValidation($v.value)) {
    return;
  }
  const dataProject: ProjectInterface = {
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
  projectPost(dataProject)
    .then(({ data }) => {
      close();
      pushNotification({
        text: "The project has been added successfully",
        type: NotificationType.Success,
        key: `key${notifications.value.length}`,
      });
    })
    .catch((error) => {
      pushNotification({
        text: "The project has not been added successfully",
        type: NotificationType.Failed,
        key: `key${notifications.value.length}`,
      });
    });
};

const close = () => {
  emit("close");
};

onMounted(() => {
  showTag();

  showUsers().then(({ data }) => {
    leadNames.value = data.map(
      (item: {
        leadName: string;
        logo: {
          name: string;
        };
        id: number;
      }) => ({
        leadName: item.username,
        logo: item.logo,
        id: item.id,
      })
    );
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
    flex-wrap: wrap;
  }
  .image--blocks {
    display: flex;
    gap: 8px;
    @include media_mobile {
      &.show {
        display: none;
      }
    }
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
</style>

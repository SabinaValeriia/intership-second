<template lang="pug">
app-modal
  template(#content)
    .backdrop(@click="closeDropdown")
    .modal-header
      h1 Create project
    .modal-body
      form.create
        .modal-body__block 
          base-input(
            :class="getValidationClass($v, 'title')",
            :type="`title`",
            :value-input="form.title",
            :is-error="getValidationClass($v, 'title')",
            @set-data="form.title = $event"
          )
            template(v-if="$v.title.required.$invalid", #errors)
              span This field is required.
          base-input(
            :class="getValidationClass($v, 'key')",
            :type="`key`",
            :value-input="form.key",
            :is-error="$v.key.required.$invalid",
            @set-data="form.key = $event"
          )
            template(v-if="$v.key.required.$invalid", #errors)
              span This field is required.
        image-input(:class="getValidationClass($v, 'image')", @file="addFile")
          template(v-if="$v.image.required.$invalid", #errors)
            span This field is required.
        .form-group.desc(:class="getValidationClass($v, 'description')")
          .label-group
            label(for="description") Description
            i.icon.arrow.mobile.desc(
              :class="{ active: showInput === 'description' }",
              @click="toggleBlock('description')"
            )
          textarea(
            v-model="form.description",
            rows="4",
            cols="50",
            placeholder="Enter description",
            :class="(getValidationClass($v, 'description'), { show: showInput === 'description' })"
          )
          span.error-message(v-if="$v.description.required.$invalid") This field is required.
        .form-group
          .position
            label.tag Tags:
            .tags(v-for="(tag, index) in form.tags", :key="index") {{ tag.name }}
              i.icon.close(@click="deleteTag(tag)")
            common-button.btn_icon.btn_primary(
              v-if="showAdd",
              @click.prevent="toggleDropdown('tags')"
            ) Add
          dropdown-component.tag(
            :is-open="dropdownStates.tags.isOpen",
            :data="tagData",
            :type="'tags'",
            :class-type="'small'",
            @selectedItem="selectedItem"
          )
        .position.mobile
          .position-dropdown
            base-input(
              :class="getValidationClass($v, 'lead')",
              :type="'lead'",
              :value-input="form.lead.name",
              :with-icon="true",
              @click="toggleDropdown('lead')"
            )
              template(#prefix)
                img.logo(
                  v-if="form.lead.logo",
                  :src="JSON.parse(form.lead.logo.name)",
                  alt="name"
                )
                img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
              template(v-if="$v.lead.required.$invalid", #errors)
                span This field is required.
              template(#suffix)
                i.icon.arrow(:class="{ active: dropdownStates.lead.isOpen }")
            dropdown-component.lead(
              :is-open="dropdownStates.lead.isOpen",
              :data="leadNames",
              :type="'lead'",
              @selectedItem="selectedItem"
            )
          .position-dropdown
            base-input(
              :class="getValidationClass($v, 'members')",
              :type="`members`",
              :value-input="form.members.length > 2 ? `${form.members[0]}, ${form.members[1]}, ${form.members.length - 2} more` : form.members",
              @click="toggleDropdown('members')"
            )
              template(#suffix)
                i.icon.arrow(
                  :class="{ active: dropdownStates.members.isOpen }"
                )
              template(v-if="$v.members.required.$invalid", #errors)
                span This field is required.
            dropdown-component.lead(
              :is-open="dropdownStates.members.isOpen",
              :data="membersNames",
              :icon-here="true",
              :title="'Members'",
              :type="'checkbox'",
              :checked-item="memberItem",
              @selectedItem="selectedItem",
              @clear="clear",
              @allItem="allItem"
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
import { showMe, showUsers } from "@/services/api/userApi";
import { required } from "@vuelidate/validators";
import { getValidationClass, checkValidation } from "@/types/authValidation";
import { projectPost } from "@/services/api/projectApi";
import BaseInput from "@/components/common/BaseInput.vue";
import ImageInput from "@/components/common/ImageInput.vue";
import {
  NotificationType,
  notifications,
  pushNotification,
} from "@/composables/notification";
import { ProjectInterface } from "@/types/projectApiInterface";
import { showTag, tagData } from "@/composables/tagActions";
import { ImageInterface } from "../types/ImageInterface";
import { filterFunction, projects } from "@/composables/projectsAction";
import { useUserStore } from "../store/user";
import {
  showDataUser,
  leadNames,
  membersNames,
} from "@/composables/userActions";

const userStore = useUserStore();

interface ProjectData {
  title: string;
  key: string;
  description: string;
  lead: string;
  members: string[];
  image: string;
  tags: string[];
}

const emit = defineEmits(["close", "newProject"]);
const members = ref([]);
const tags = ref([]);
const showInput = ref("");
const leadName = ref("");
const showAdd = ref(true);
const memberItem = ref([]);

const defaultState: ProjectData = {
  title: "",
  key: "",
  description: "",
  lead: "",
  image: "",
  members: [],
  tags: [],
};

const form = ref<ProjectData>({
  ...defaultState,
});

const dropdownStates = ref({
  tags: { isOpen: false },
  lead: { isOpen: false },
  members: { isOpen: false },
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
    } else {
      form.value.key = "";
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

const toggleBlock = (inputType: string) => {
  showInput.value = showInput.value === inputType ? "" : inputType;
};

const allItem = (item) => {
  if (!form.value.members.some((tag) => tag.id === item.id)) {
    form.value.members.push(item.name);
    members.value.push(item.id.toString());
  }
  dropdownStates.value.members.isOpen = false;
};

const clear = () => {
  memberItem.value = [];
  form.value.members = [];
  showDataUser();
};

const toggleDropdown = (dropdownName: string) => {
  Object.keys(dropdownStates.value).forEach((name) => {
    if (name !== dropdownName) {
      dropdownStates.value[name].isOpen = false;
    }
  });
  dropdownStates.value[dropdownName].isOpen =
    !dropdownStates.value[dropdownName].isOpen;
};

const closeDropdown = () => {
  dropdownStates.value.tags.isOpen = false;
  dropdownStates.value.lead.isOpen = false;
  dropdownStates.value.members.isOpen = false;
};
const { selected, filtered } = filterFunction([]);

const selectedItem = (tag: string) => {
  if (dropdownStates.value.lead.isOpen) {
    form.value.lead = tag;

    dropdownStates.value.lead.isOpen = !dropdownStates.value.lead.isOpen;
  } else if (dropdownStates.value.tags.isOpen) {
    if (!form.value.tags.includes(tag)) {
      form.value.tags.push(tag);
    }

    const updatedTagNames = [...tagData.value];
    const tagIndexToRemove = updatedTagNames.findIndex((t) => t.id === tag.id);

    if (tagIndexToRemove !== -1) {
      updatedTagNames.splice(tagIndexToRemove, 1);
      tagData.value = updatedTagNames;
    }

    if (!tagData.value.length) {
      dropdownStates.value.tags.isOpen = !dropdownStates.value.tags.isOpen;
      showAdd.value = false;
    }

    tags.value.push(tag.id.toString());
  } else {
    if (!memberItem.value.includes(tag)) {
      form.value.members.push(tag.name);
      memberItem.value.push(tag);
    } else {
      const indexToRemove = memberItem.value.findIndex(
        (item) => item.id === tag.id
      );
      const tagIndexToRemove = membersNames.value.findIndex(
        (m) => m.id === tag.id
      );
      if (tagIndexToRemove !== -1 && indexToRemove !== -1) {
        membersNames.value.splice(tagIndexToRemove, 1);
        memberItem.value.splice(tagIndexToRemove, 1);
        form.value.members.splice(tagIndexToRemove, 1);
        showDataUser();
      }

      if (memberItem.value.length === membersNames.value.length) {
        dropdownStates.value.members.isOpen =
          !dropdownStates.value.members.isOpen;
      }
    }
    members.value.push(tag.id.toString());
  }
};

const deleteTag = (tag: { name: string; id: number }) => {
  const tagIndex = form.value.tags.findIndex((t) => t.id === tag.id);

  if (tagIndex !== -1) {
    form.value.tags.splice(tagIndex, 1);
    tagData.value = [...tagData.value, tag];
  }

  showAdd.value = true;
};

const addFile = (userImage: ImageInterface) => {
  form.value.image = userImage.value[0].base64;
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
      manager: leadName.value.toString(),
    },
  };
  projectPost(dataProject)
    .then(({ data }) => {
      userStore.showProjectsData(data);
      close();
      emit("newProject");
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
  showDataUser();
  showMe().then(({ data }) => {
    leadName.value = data.id;
  });
});
</script>

<style lang="scss" scoped>
.modal-header {
  h1 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0 0 16px;
    @include media_mobile {
      font-size: 16px;
      line-height: 26px;
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
  i.arrow {
    right: 16px;
    height: 11px;
    @include media_mobile {
      right: 12px;
      width: 12px;
      height: 8px;
    }
    &.active {
      transform: rotate(180deg);
    }
    &.mobile {
      display: none;
    }
  }
  form {
    width: 100%;
    &.create {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      @include media_mobile {
        display: block;
      }
      .position {
        display: flex;
        align-items: center;
        width: fit-content;
        &.mobile {
          @include media_mobile {
            flex-direction: column;
            width: 100%;
          }
        }
        &-dropdown {
          width: 100%;
          position: relative;
        }
      }
      .form-group {
        width: 100%;
        margin-bottom: 16px;
        @include media_mobile {
          margin-bottom: 10px;
        }
        &.title {
          width: 396px;
          margin-right: 16px;
          @include media_mobile {
            width: 100%;
            margin-right: 0;
          }
        }
        &.key {
          width: 200px;
          @include media_mobile {
            width: 100%;
            margin-bottom: 10px;
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
            top: 12px;
            left: 12px;
            width: 16px;
            height: 16px;
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
        label.tag {
          &::before {
            display: none;
          }
        }
        @include media_mobile {
          input {
            &.show {
              display: none;
            }
          }
        }
        &.lead {
          margin: 0 16px 0 0;
          width: 224px;
          @include media_mobile {
            width: 100%;
            margin: 0 0 16px 0;
            input {
              width: 100%;
            }
          }
        }
        &.members {
          margin: 0;
          width: 372px;
          @include media_mobile {
            width: 100%;
          }
          input {
            width: 372px;
            @include media_mobile {
              width: 100%;
            }
          }
        }
        &.tag {
          input {
            width: 224px;
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
          border-radius: 8px;
          &:before {
            mask-image: url("@/assets/icons/plus.svg");
            background: var(--white);
            width: 12px;
            height: 12px;
            margin-right: 4px;
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
          cursor: pointer;
          &:hover {
            background: var(--accent_hover);
          }
          i.close {
            top: 11px;
            left: 8px;
            width: 10px;
            height: 10px;
            &::before {
              background: var(--white);
            }
          }
          @include media_mobile {
            padding: 4px 6px 4px 18px;
            font-size: 12px;
            line-height: 16px;
            i.close {
              top: 9px;
              left: 6px;
              width: 8px;
              height: 8px;
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
    }
  }
}
</style>

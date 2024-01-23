<template lang="pug">
app-modal
  template(#content)
    .backdrop(@click="closeDropdown")
    .modal-header
      h1 Create issues
    .modal-body
      form.create
        .modal-body__block
          base-input(
            :class="getValidationClass($v, 'summary')",
            :type="`summary`",
            :value-input="form.summary",
            :is-error="getValidationClass($v, 'summary')",
            @set-data="form.summary = $event"
          )
            template(v-if="$v.summary.required.$invalid", #errors)
              span This field is required.
        .flex
          .position-dropdown
            base-input(
              :class="getValidationClass($v, 'type')",
              :type="`Type`",
              :value-input="form.type ? form.type : 'form.type'",
              @click="toggleDropdown('typeTasks')"
            )
              template(#suffix)
                i.icon.arrow(
                  :class="{ active: dropdownStates.typeTasks.isOpen }"
                )
              template(v-if="$v.type.required.$invalid", #errors)
                span This field is required.
            dropdown-component.lead(
              :is-open="dropdownStates.typeTasks.isOpen",
              :data="types",
              :type="'lead'",
              @selectedItem="selectedItem"
            )
          .position-dropdown
            base-input(
              :class="getValidationClass($v, 'date')",
              :type="`Due date`",
              :value-input="form.date.length ? form.date : 'Due date'",
              @click="showCalendar = !showCalendar"
            )
              template(#suffix)
                i.icon.calendar
              template(v-if="$v.date.required.$invalid", #errors)
                span This field is required.
            common-calendar.primary.issues(
              v-if="showCalendar",
              @date="selectDate"
            )
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
          .position-dropdown.assignee
            base-input(
              :class="getValidationClass($v, 'assignee')",
              :type="'assignee'",
              :value-input="form.assignee.name",
              :with-icon="true",
              @click="toggleDropdown('assignee')"
            )
              template(#prefix)
                img(:src="require(`@/assets/icons/default_user.svg`)")
              template(v-if="$v.assignee.required.$invalid", #errors)
                span This field is required.
              template(#suffix)
                i.icon.arrow(
                  :class="{ active: dropdownStates.assignee.isOpen }"
                )
            dropdown-component.lead(
              :is-open="dropdownStates.assignee.isOpen",
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
<script lang="ts" setup>
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import AppModal from "./AppModal.vue";
import { useVuelidate } from "@vuelidate/core";
import CommonButton from "@/components/common/CommonButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { showMe } from "@/services/api/userApi";
import { required } from "@vuelidate/validators";
import { checkValidation, getValidationClass } from "@/types/authValidation";
import BaseInput from "@/components/common/BaseInput.vue";
import {
  notifications,
  NotificationType,
  pushNotification,
} from "@/composables/notification";
import { showTag, tagData } from "@/composables/tagActions";
import { useUserStore } from "../store/user";
import {
  leadNames,
  membersNames,
  showDataUser,
} from "@/composables/userActions";
import { showTypes } from "@/services/api/typeApi";
import CommonCalendar from "@/components/common/CommonCalendar.vue";
import { taskPost } from "@/services/api/tasksApi";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { showStatus } from "@/services/api/statusApi";
import { TaskInterface } from "@/types/tasksApiInterface";

const userStore = useUserStore();

interface IssuesData {
  summary: string;
  key: string;
  description: string;
  date: string;
  assignee: string;
  members: string[];
  image: string;
  tags: string[];
}

const route = useRoute();
const emit = defineEmits(["close", "newTask"]);
const members = ref([]);
const tags = ref([]);
const showInput = ref("");
const assignee = ref("");
const showAdd = ref(true);
const memberItem = ref([]);
const types = ref([]);
const showCalendar = ref(false);
const typesItem = ref([]);
const toDoStatus = ref();

const defaultState: IssuesData = {
  summary: "",
  key: "",
  description: "",
  date: "",
  assignee: "",
  type: "",
  members: [],
  tags: [],
};

const form = ref<IssuesData>({
  ...defaultState,
});

const dropdownStates = ref({
  tags: { isOpen: false },
  assignee: { isOpen: false },
  members: { isOpen: false },
  typeTasks: { isOpen: false },
});

watch(
  () => form.value.summary,
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
    summary: { required },
    description: { required },
    assignee: { required },
    members: { required },
    type: { required },
    date: { required },
  };
  return rules;
});

const $v = useVuelidate(rules, form);

const selectDate = (date: string) => {
  form.value.date = date;
  showCalendar.value = !showCalendar.value;
};

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
  dropdownStates.value.assignee.isOpen = false;
  dropdownStates.value.members.isOpen = false;
};

const selectedItem = (tag: string) => {
  if (dropdownStates.value.assignee.isOpen) {
    form.value.assignee = tag;

    dropdownStates.value.assignee.isOpen =
      !dropdownStates.value.assignee.isOpen;
  }
  if (dropdownStates.value.typeTasks.isOpen) {
    form.value.type = tag.name;
    typesItem.value.push(tag.id.toString());
    dropdownStates.value.typeTasks.isOpen =
      !dropdownStates.value.typeTasks.isOpen;
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
  } else if (dropdownStates.value.members.isOpen) {
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

const save = () => {
  if (checkValidation($v.value)) {
    return;
  }
  const dueDate = dayjs(form.value.date, {
    parseFormat: "dddd, MMMM, YYYY",
  });

  if (dueDate.isValid()) {
    const formattedDate = dueDate.format("YYYY-MM-DD");
    const dataTask: TaskInterface = {
      data: {
        title: form.value.summary,
        description: form.value.description,
        asignee: form.value.assignee.id.toString(),
        members: Array.from(members.value),
        tags: Array.from(tags.value),
        reporter: assignee.value.id.toString(),
        dueDate: formattedDate,
        type: Array.from(typesItem.value),
        project: route.params.projectId,
        status: toDoStatus.value.id.toString(),
        key: form.value.key,
      },
    };
    taskPost(dataTask)
      .then(({ data }) => {
        userStore.showTasksData(data);
        close();
        emit("newTask");
        pushNotification({
          text: "The task has been added successfully",
          type: NotificationType.Success,
          key: `key${notifications.value.length}`,
        });
      })
      .catch((error) => {
        pushNotification({
          text: "The task has not been added successfully",
          type: NotificationType.Failed,
          key: `key${notifications.value.length}`,
        });
      });
  }
};

const close = () => {
  emit("close");
};

onMounted(() => {
  showTag();
  showDataUser();
  showMe().then(({ data }) => {
    assignee.value = data;
  });
  showTypes().then(({ data }) => {
    types.value = data.data.map(
      (item: { [x: string]: any; name: string; id: number }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
  });
  showStatus().then(({ data }) => {
    let statuses = data.data.map(
      (item: { [x: string]: any; name: string; id: number }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
    toDoStatus.value = statuses.find((status) => status.name === "To Do");
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
    width: 100%;
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

      .flex {
        display: flex;
        width: 100%;

        .position-dropdown {
          width: 50%;
          position: relative;

          &:first-of-type {
            margin-right: 16px;
          }
        }
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

          &.assignee {
            margin-right: 16px;
            @include media_mobile {
              margin: 0 0 16px 0;
            }
          }
        }
      }

      .calendar {
        right: 16px;
        @include media_mobile {
          right: 12px;
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

        &.assignee {
          margin: 0 16px 0 0;
          @include media_mobile {
            margin: 0;
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

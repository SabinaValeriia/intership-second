<template lang="pug">
.issues
  h3 Issues
  .issues-panel
    form
      .form-group
        .form-icon 
          input(v-model="searchText", placeholder="")
          i.icon.search
    .flex
      .mobile-flex(
        :class="{ selected: assigneeItem || searchText || typeItem.length || statusItem.length || reporterItem }"
      )
        .dropdown-block
          common-button.btn-secondary-line.btn_arrow(
            @click.prevent="toggleDropdown('typeTasks')"
          ) {{ typeItem.length > 0 ? `Type: ${typeItem[0].name}` : "Type" }}
            span.selected(v-if="typeItem.length > 1") + {{ typeItem.length - 1 }}
            i.icon.arrow
          dropdown-component(
            v-if="dropdownStates.typeTasks.isOpen",
            :isOpen="dropdownStates.typeTasks.isOpen",
            :data="types",
            :checkedItem="typeItem",
            @selectedItem="selectedItem",
            :type="'checkbox'",
            :title="'Project types'",
            @clear="clear",
            @allItem="selectAllType"
          )
        .dropdown-block
          common-button.btn-secondary-line.btn_arrow(
            @click.prevent="toggleDropdown('status')"
          ) {{ statusItem.length > 0 ? `Status: ${statusItem[0].name}` : "Status" }}
            span.selected(v-if="statusItem.length > 1") + {{ statusItem.length - 1 }}
            i.icon.arrow
          dropdown-component(
            v-if="dropdownStates.status.isOpen",
            :isOpen="dropdownStates.status.isOpen",
            :data="statuses",
            :checkedItem="statusItem",
            @selectedItem="selectedItem",
            :type="'checkbox'",
            :title="'Status types'",
            @clear="clear",
            @allItem="selectAllStatus"
          )
        .dropdown-block
          common-button.btn_primary.btn_icon(
            @click.prevent="toggleDropdown('assignee')"
          ) {{ assigneeItem ? `Assignee: ${assigneeItem.name}` : "Assignee" }}
            i.icon.user(v-if="!assigneeItem")
            div(v-else)
              img.logo(
                v-if="assigneeItem.logo",
                :src="JSON.parse(assigneeItem.logo.name)",
                alt="name"
              )
              img(
                v-else-if="!assigneeItem.logo",
                :src="require(`@/assets/icons/default_user.svg`)"
              )
            i.icon.close(v-if="assigneeItem", @click.stop="deleteAssignee")
          dropdown-component.tags__block(
            v-if="dropdownStates.assignee.isOpen",
            :isOpen="dropdownStates.assignee.isOpen",
            :data="leadNames",
            @selectedItem="selectedItem",
            :type="'assignee'"
          )
        .dropdown-block
          common-button.btn_primary.btn_icon(
            @click.prevent="toggleDropdown('reporter')"
          ) {{ reporterItem ? `Reporter: ${reporterItem.name}` : "Reporter" }}
            i.icon.member(v-if="!reporterItem")
            div(v-else)
              img.logo(
                v-if="reporterItem.logo",
                :src="JSON.parse(reporterItem.logo.name)",
                alt="name"
              )
              img(
                v-else-if="!reporterItem.logo",
                :src="require(`@/assets/icons/default_user.svg`)"
              )
            i.icon.close(v-if="reporterItem", @click.stop="deleteReporter")
          dropdown-component.tags__block(
            v-if="dropdownStates.reporter.isOpen",
            :isOpen="dropdownStates.reporter.isOpen",
            :data="leadNames",
            @selectedItem="selectedItem",
            :type="'reporter'"
          )
      common-button.reset.btn-secondary.laptop(
        v-if="assigneeItem || searchText || typeItem.length || statusItem.length || reporterItem",
        @click.prevent="reset"
      ) Reset
      common-button.reset.btn-secondary.mobile(
        v-if="assigneeItem || searchText || typeItem.length || statusItem.length || reporterItem",
        @click.prevent="reset"
      ) 
        i.icon.reset
  .issues-table 
    .column.type Type
    .column.key Key
      button.sort(
        @click="sort('key', sortAction.status)",
        :class="{ active: sortAction.name === 'key' }"
      )
        i.icon(
          :class="{ sort: sortAction.status === 'ASC', sort_down: sortAction.status === 'DESC' }"
        )
    .column.summary Summary
    .column.assignee Assignee
    .column.reporter Reporter
    .column.status Status
    .column.created Created
  .tablet(v-if="!isLoader")
    .issues-block(v-for="item in tasks", :key="item")
      .type(v-for="t in item.attributes.type", :key="t")
        i.icon(:class="getTaskTypeName(t.attributes.name)")
      .key 
        p {{ item.attributes.key }}
      router-link.summary(
        :to="{ name: 'issuesItem', params: { id: item.id } }"
      )
        a {{ item.attributes.title }}
      router-link.assignee(
        v-for="t in item.attributes.asignee",
        :key="t",
        :to="{ name: 'teamsUser', params: { id: item.attributes.asignee.data.id } }"
      )
        img(
          v-if="t.attributes.logo",
          :src="JSON.parse(t.attributes.logo.name)",
          alt="name"
        )
        img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        p {{ t.attributes.username }}
      router-link.reporter(
        v-for="t in item.attributes.reporter",
        :key="t",
        :to="{ name: 'teamsUser', params: { id: item.attributes.asignee.data.id } }"
      )
        img(
          v-if="t.attributes.logo",
          :src="JSON.parse(t.attributes.logo.name)",
          alt="name"
        )
        img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        p {{ t.attributes.username }}
      .status(
        v-for="t in item.attributes.status",
        :key="t",
        :class="getSecondWord(t.attributes.name)"
      )
        p {{ t.attributes.name }}
      .created 
        p {{ formatDate(item.attributes.dueDate) }}
  .mobile-block(v-if="!isLoader")
    .issues-block(v-for="item in tasks", :key="item")
      .type(v-for="t in item.attributes.type", :key="t")
        i.icon(:class="getTaskTypeName(t.attributes.name)")
      .task-name
        router-link.summary(
          :to="{ name: 'issuesItem', params: { id: item.id } }"
        ) {{ item.attributes.title }}
        div
          .key 
            p {{ item.attributes.key }}
          .status(
            v-for="t in item.attributes.status",
            :key="t",
            :class="getSecondWord(t.attributes.name)"
          )
            p {{ t.attributes.name }}
      router-link.reporter(
        v-for="t in item.attributes.reporter",
        :key="t",
        :to="{ name: 'teamsUser', params: { id: item.attributes.asignee.data.id } }"
      )
        img(
          v-if="t.attributes.logo",
          :src="JSON.parse(t.attributes.logo.name)",
          alt="name"
        )
        img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
      .created 
        p {{ formatDate(item.attributes.dueDate) }}
  common-loader(v-if="isLoader")
  pagination-component(
    v-show="totalTasks > itemsPerPage && !isLoader",
    :totalItems="totalTasks",
    :itemsPerPage="itemsPerPage",
    @onPageChange="handlePageChange"
  )
  no-results(
    v-if="noDataShow || (noResultsShow && filterUse)",
    :noData="noDataShow",
    :noResults="noResultsShow",
    @reset="reset"
  )
</template>

<script setup lang="ts">
import NoResults from "./NoResults.vue";
import { showDataUser, leadNames } from "@/composables/userActions";
import PaginationComponent from "./common/PaginationComponent.vue";
import CommonLoader from "./common/CommonLoader.vue";
import { onMounted, ref, watch } from "vue";
import CommonButton from "./common/CommonButton.vue";
import { getTaskTypeName } from "@/composables/projectsAction";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import { showProjects } from "@/services/api/projectApi";
import {
  endIndex,
  itemsPerPage,
  page,
  startIndex,
} from "@/composables/pagination";
import { useRoute } from "vue-router";
import { showTasks } from "@/services/api/tasksApi";
import { showTypes } from "@/services/api/typeApi";
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import { showStatus } from "@/services/api/statusApi";
const foundProject = ref();
const tasks = ref([]);
const isLoader = ref(false);
const typeItem = ref([]);
const filterUse = ref(false);
const statusItem = ref([]);
const statuses = ref([]);
const assigneeItem = ref("");
const noDataShow = ref(false);
const assignees = ref([]);
const reporterItem = ref("");
const reporters = ref([]);
const route = useRoute();
const totalTasks = ref(null);
const noResultsShow = ref(false);
const types = ref([]);
const searchText = ref("");
const filter = ref("");
const dropdownStates = ref({
  typeTasks: { isOpen: false },
  status: { isOpen: false },
  assignee: { isOpen: false },
  reporter: { isOpen: false },
});
const sortAction = ref({
  name: "key",
  status: "ASC",
  class: "active",
});
const clear = () => {
  if (typeItem.value.length) {
    typeItem.value = [];
  } else if (statusItem.value.length) {
    statusItem.value = [];
  }
  fetchTasks("");
};

const deleteAssignee = () => {
  showDataUser();
  assigneeItem.value = "";
  noResultsShow.value = false;
  fetchTasks("");
};

const deleteReporter = () => {
  showDataUser();
  reporterItem.value = "";
  noResultsShow.value = false;
  fetchTasks("");
};

const selectAllType = (item: [{ name: string; id: number }]) => {
  if (!typeItem.value.some((tag) => tag.id === item.id)) {
    typeItem.value.push(item);
  }
  dropdownStates.value.typeTasks.isOpen = false;
};
const selectAllStatus = (item: [{ name: string; id: number }]) => {
  if (!statusItem.value.some((tag) => tag.id === item.id)) {
    statusItem.value.push(item);
  }
  dropdownStates.value.status.isOpen = false;
};
const selectedItem = (tag: { id: any; name: string }) => {
  if (dropdownStates.value.typeTasks.isOpen) {
    if (!typeItem.value.includes(tag)) {
      typeItem.value.push(tag);
    } else {
      const indexToRemove = typeItem.value.findIndex(
        (item) => item.id === tag.id
      );

      if (indexToRemove !== -1) {
        typeItem.value.splice(indexToRemove, 1);
      }
    }
    if (types.value.length === typeItem.value.length) {
      dropdownStates.value.typeTasks.isOpen =
        !dropdownStates.value.typeTasks.isOpen;
    }
  } else if (dropdownStates.value.status.isOpen) {
    if (!statusItem.value.includes(tag)) {
      statusItem.value.push(tag);
    } else {
      const indexToRemove = statusItem.value.findIndex(
        (item) => item.id === tag.id
      );

      if (indexToRemove !== -1) {
        statusItem.value.splice(indexToRemove, 1);
      }
    }
    if (statuses.value.length === statusItem.value.length) {
      dropdownStates.value.status.isOpen = !dropdownStates.value.status.isOpen;
    }
  } else if (dropdownStates.value.reporter.isOpen) {
    reporterItem.value = tag;
    reporters.value = [...leadNames.value];
    const tagIndexToRemove = reporters.value.findIndex((m) => m.id === tag.id);
    if (tagIndexToRemove !== -1) {
      reporters.value.splice(tagIndexToRemove, 1);
    }
    dropdownStates.value.reporter.isOpen =
      !dropdownStates.value.reporter.isOpen;
  } else {
    assigneeItem.value = tag;
    assignees.value = [...leadNames.value];
    const tagIndexToRemove = assignees.value.findIndex((m) => m.id === tag.id);
    if (tagIndexToRemove !== -1) {
      assignees.value.splice(tagIndexToRemove, 1);
    }
    dropdownStates.value.assignee.isOpen =
      !dropdownStates.value.assignee.isOpen;
  }
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
const fetchTasks = (filters: string) => {
  isLoader.value = true;
  noResultsShow.value = false;
  return new Promise(() => {
    showTasks(
      `pagination[start]=${startIndex.value}&pagination[limit]=${endIndex.value}${filters}`
    ).then((response) => {
      tasks.value = response.data.data.filter(
        (task: any) =>
          task.attributes.project.data.attributes.key === route.params.key
      );
      totalTasks.value = tasks.value.length;
      isLoader.value = false;
      if (!totalTasks.value && filterUse.value) {
        noResultsShow.value = true;
      } else if (!totalTasks.value) {
        noDataShow.value = true;
      }
    });
  });
};
const reset = () => {
  page.value = 1;
  searchText.value = "";
  if (typeItem.value.length) {
    typeItem.value = [];
  }
  if (statusItem.value.length) {
    statusItem.value = [];
  }
  assigneeItem.value = "";
  reporterItem.value = "";
  noResultsShow.value = false;
  close();
};
const formatDate = (data: string) => {
  if (data) {
    const dateObject = new Date(data);
    return dateObject.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return "";
};

const sort = (field: string) => {
  if (sortAction.value.status === "ASC") {
    fetchTasks(`&sort=${field}:DESC`);
    sortAction.value.status = "DESC";
  } else {
    fetchTasks(`&sort=${field}:ASC`);
    sortAction.value.status = "ASC";
  }
};
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  startIndex.value = (page.value - 1) * itemsPerPage.value;
  fetchTasks("");
};
watch(
  [
    () => searchText.value,
    () => typeItem.value,
    () => statusItem.value,
    () => assigneeItem.value,
    () => reporterItem.value,
  ],
  ([
    searchTextValue,
    typeItemValue,
    statusItemValue,
    assigneeItemValue,
    reporterItemValue,
  ]) => {
    const filters = [];

    if (searchTextValue) {
      noResultsShow.value = false;
      filterUse.value = true;
      filters.push(`filters[title][$contains]=${searchTextValue}`);
    }

    if (typeItemValue && typeItemValue.length) {
      const tagFilters = typeItemValue
        .map(
          (tag, index) => `filters[$and][${index}][type][name][$eq]=${tag.name}`
        )
        .join("&");
      filters.push(tagFilters);
      filterUse.value = true;
      noResultsShow.value = false;
    }
    if (statusItemValue && statusItemValue.length) {
      const tagFilters = statusItemValue
        .map(
          (tag, index) =>
            `filters[$and][${index}][status][name][$eq]=${tag.name}`
        )
        .join("&");
      filters.push(tagFilters);
      filterUse.value = true;
      noResultsShow.value = false;
    }

    if (assigneeItemValue) {
      filters.push(
        `filters[$and][${assigneeItemValue.id}][asignee][username][$eq]=${assigneeItemValue.name}`
      );
      filterUse.value = true;
      noResultsShow.value = false;
    }
    if (reporterItemValue) {
      filters.push(
        `filters[$and][${reporterItemValue.id}][reporter][username][$eq]=${reporterItemValue.name}`
      );
      filterUse.value = true;
      noResultsShow.value = false;
    }

    filter.value = filters.length ? `&${filters.join("&")}` : "";
    fetchTasks(filter.value);
  },
  { deep: true }
);
const getSecondWord = (text: string) => {
  const words = text.split(" ");
  if (words.length >= 2) {
    return words[1];
  } else {
    return words[0].toLowerCase();
  }
};
onMounted(() => {
  fetchTasks("");
  showTypes().then(({ data }) => {
    types.value = data.data.map(
      (item: { [x: string]: any; name: string; id: number }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
  });
  showStatus().then(({ data }) => {
    statuses.value = data.data.map(
      (item: { [x: string]: any; name: string; id: number }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
  });
  showDataUser();
});
</script>

<style lang="scss" scoped>
.issues {
  padding: 28px 24px 0;
  width: 100%;
  overflow: auto;
  @include media_tablet {
    padding: 28px 16px 0;
    overflow: auto;
  }
  @include media_mobile {
    padding: 0 16px;
    overflow: hidden;
  }
  &.toggle {
    .type {
      width: 3%;
      i {
        left: 5px;
      }
    }
    .key {
      width: 7%;
      margin-left: 4px;
      p {
        margin-left: 9px;
      }
    }
    .column {
      &.summary {
        margin-left: 0;
      }
    }
    .summary {
      width: 35%;
      margin-left: 12px;
    }
    .column {
      &.assignee {
        margin-left: 7px;
      }
    }
    .assignee {
      width: 15%;
      margin-left: 15px;
    }
    .reporter {
      width: 15%;
    }
    .status {
      width: 8%;
    }
    .created {
      width: 9%;
    }
  }
  h3 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0;
    @include media_mobile {
      display: none;
    }
  }
  &-panel {
    margin: 28px 0 36px;
    display: flex;
    align-items: center;
    @include media_tablet {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin: 28px 0 26px;
    }
    @include media_mobile {
      margin: 0 0 16px;
    }
    .flex {
      display: flex;
      @include media_mobile {
        .selected {
          overflow-x: auto;
          width: 297px;
        }
      }
    }
    .mobile-flex {
      display: flex;
    }
    .dropdown-block {
      position: relative;
      margin-left: 10px;
      @include media_tablet {
        margin-left: 8px;
        &:first-of-type {
          margin-left: 0;
        }
      }
      @include media_mobile {
        margin-left: 6px;
      }
      .drop-down {
        top: 61px;
        @include media_mobile {
          top: 196px;
          left: 16px;
          position: fixed;
        }
      }
    }
    button {
      padding: 14px 16px;
      height: 48px;
      box-sizing: border-box;
      position: relative;
      width: fit-content;
      @include media_mobile {
        padding: 9px 10px;
        height: 34px;
        font-size: 12px;
        line-height: 16px;
        font-weight: 500;
      }
      &.btn_icon {
        img {
          width: 20px;
          height: 20px;
          left: 16px;
          top: 14px;
          position: absolute;
          border-radius: 11px;
          @include media_mobile {
            width: 13px;
            height: 13px;
            top: 11px;
            left: 10px;
          }
        }
        i.close {
          position: relative;
          width: 12px;
          height: 12px;
          margin-left: 6px;
          &::before {
            background: var(--white);
          }
          @include media_mobile {
            width: 8px;
            height: 8px;
          }
        }
      }
      &.reset {
        margin-left: 10px;
        padding: 12px 26px;
        font-size: 14px;
        line-height: 20px;
        @include media_mobile {
          padding: 10px;
          margin-left: 6px;
          width: 36px;
          height: 34px;
          box-sizing: border-box;
          i.reset {
            position: relative;
            &::before {
              background: var(--white);
            }
          }
        }
        &.mobile {
          display: none;
          @include media_mobile {
            display: block;
          }
        }
        &.laptop {
          @include media_mobile {
            display: none;
          }
        }
      }
      &.btn_arrow {
        background: var(--white);
        border-color: var(--primary);
        color: var(--text);
      }
      i.arrow {
        position: relative;
        width: 16px;
        height: 9px;
        margin: 2px 0 0 12px;
        @include media_mobile {
          width: 10px;
          height: 7px;
          margin: 2px 0 0 6px;
        }
      }
      i.user {
        left: 16px;
        &::before {
          background: var(--white);
        }
        @include media_mobile {
          left: 10px;
        }
      }
      i.member {
        left: 16px;
        &::before {
          background: var(--white);
        }
        @include media_mobile {
          left: 10px;
        }
      }
    }
  }
  .type {
    width: 4%;

    i {
      position: relative;
      left: -4px;
      @include media_mobile {
        left: -2px;
        top: 0;
      }
    }
    @include media_mobile {
      width: 5%;
    }
  }
  .task-name {
    width: 59%;
    @include media_mobile {
      margin: -6px 0 0 4px;
    }
    a {
      @include font(12px, 500, 16px, var(--accent));
    }
    div {
      display: flex;
      align-items: center;
      p {
        margin: 0;
        white-space: nowrap;
      }
      .key {
        width: auto;
        margin-top: 3px;
        p {
          font-size: 10px;
          line-height: 14px;
          margin-right: 6px;
        }
      }
    }
  }
  .key {
    width: 8%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      margin-left: -11px;
      @include font(14px, 500, 20px, var(--text));
    }
    button {
      background: transparent;
      border: none;
      padding: 0;
      i.sort {
        position: relative;
      }
      i.sort_down {
        position: relative;
      }
    }
  }
  .summary {
    width: 24%;
    text-decoration: none;
    @include media_small_laptop {
    }
    a {
      margin-left: -8px;
      @include font(14px, 500, 20px, var(--accent));
    }
  }
  .assignee {
    width: 17%;
    display: flex;
    align-items: center;
    text-decoration: none;
    img {
      width: 32px;
      height: 32px;
      margin: 0 10px 0 -8px;
    }
    a {
      @include font(14px, 500, 20px, var(--accent));
    }
  }
  .reporter {
    width: 17%;
    display: flex;
    align-items: center;
    text-decoration: none;
    img {
      width: 32px;
      height: 32px;
      margin: 0 10px 0 -4px;
      @include media_mobile {
        width: 26px;
        height: 26px;
        margin: 0 7px 0 0px;
      }
    }
    a {
      @include font(14px, 500, 20px, var(--accent));
    }
    @include media_mobile {
      width: 8%;
      margin: 0 0 0 14px;
    }
  }
  .status {
    width: 10%;
    p {
      padding: 4px 6px;
      border-radius: 6px;
      @include font(12px, 400, 16px, var(--white));
      width: fit-content;
      @include media_mobile {
        width: auto;
        padding: 2px 4px;
        font-size: 8px;
        line-height: 12px;
      }
    }
    &.progress {
      p {
        background: var(--notify_warning);
      }
    }
    &.do {
      p {
        background: var(--primary);
      }
    }
    &.review {
      p {
        background: var(--primary_hover);
      }
    }
    &.failed {
      p {
        background: var(--error);
      }
    }
    &.done {
      p {
        background: var(--notify_success);
      }
    }
    &.archive {
      p {
        background: var(--placeholder);
      }
    }
  }
  .created {
    width: 9%;
    white-space: nowrap;
    p {
      @include font(14px, 500, 20px, var(--text));
      @include media_mobile {
        font-size: 10px;
        line-height: 14px;
        white-space: nowrap;
        margin: 0 0 0 3px;
      }
    }
    @include media_mobile {
      width: 19%;
    }
  }
  .tablet {
    @include media_mobile {
      display: none;
    }
  }
  .mobile-block {
    display: none;
    @include media_mobile {
      display: block;
    }
  }
  &-table {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--primary);
    height: 30px;
    margin-bottom: 20px;
    @include media_tablet {
      height: 24px;
      width: 992px;
    }
    @include media_mobile {
      width: 100%;
      display: none;
    }
    .column {
      margin-right: 16px;
      @include font(16px, 500, 24px, var(--text));
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .issues-block {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 44px;
    margin-bottom: 4px;
    @include media_tablet {
      width: 992px;
    }
    @include media_mobile {
      width: calc(100% - 32px);
      height: 40px;
    }
  }
  form {
    @include media_tablet {
      width: calc(100% - 32px);
    }
    .form-group {
      margin-bottom: 0;
      @include media_tablet {
        margin-bottom: 8px;
      }
      @include media_mobile {
        margin-bottom: 6px;
      }
    }
    i.search {
      right: 16px;
    }
    input {
      width: 220px;
      @include media_tablet {
        width: 100%;
      }
    }
  }
}
</style>

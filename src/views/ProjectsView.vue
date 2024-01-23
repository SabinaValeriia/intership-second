<template lang="pug">
.backdrop(@click="close")
.project--background
.project(@click="closeDropdowns")
  h1 Projects
  form.position
    .form-group.search
      .form-icon
        input(v-model="searchText", placeholder="Search")
        i.icon.search
    .mobile
      .dropdown__block
        common-button.btn-secondary-line.tags-block(
          :class="{ select: tagItem.length }",
          @click.prevent="toggleDropdown('tags')"
        ) {{ tagItem.length > 0 ? `Tags: ${tagItem[0].name}` : "Tags" }}
          span.selected(v-if="tagItem.length > 1") + {{ tagItem.length - 1 }}
          i.icon.arrow(:class="{ active: dropdownStates.tags.isOpen }")
        dropdown-component.tags__block(
          v-if="dropdownStates.tags.isOpen",
          :is-open="dropdownStates.tags.isOpen",
          :data="tagNames",
          :checked-item="tagItem",
          :type="'checkbox'",
          :title="'Project tags'",
          @selectedItem="selectedItem",
          @clear="clear",
          @allItem="selectAll"
        )
      .dropdown__block.lead
        common-button.btn_icon.lead(
          :class="[leadItem ? ['btn-secondary', 'select'] : 'btn_primary']",
          @click.prevent="toggleDropdown('lead')"
        ) {{ leadItem ? leadItem.name : "Lead" }}
          i.icon.member.icon-img(v-if="!leadItem")
          div(v-else)
            img.logo(
              v-if="leadItem.logo",
              :src="JSON.parse(leadItem.logo.name)",
              alt="name"
            )
            img(
              v-else-if="!leadItem.logo",
              :src="require(`@/assets/icons/default_user.svg`)"
            )
          i.icon.close(v-if="leadItem", @click.stop="deleteLead")
        dropdown-component.tags__block(
          v-if="dropdownStates.lead.isOpen",
          :is-open="dropdownStates.lead.isOpen",
          :data="leadNames",
          :type="'lead'",
          @selectedItem="selectedItem"
        )
      common-button.reset.btn-secondary.laptop(
        v-if="leadItem || searchText || tagItem.length",
        @click.prevent="reset"
      ) Reset
      common-button.reset.btn-secondary.mobile(
        v-if="leadItem || searchText || tagItem.length",
        @click.prevent="reset"
      )
        i.icon.reset
  .ptojects-table
    .ptojects-table__block.distance
      .star-block
        i.icon.star
      .sort.name Name
        button.sort(
          :class="{ active: sortAction.name === 'title' }",
          @click="sort('title', sortDirection === 'asc' ? 'desc' : 'asc')"
        )
          i.icon(
            :class="{ sort: sortDirection === 'asc' && 'title', sort_down: sortDirection === 'desc' && 'title' }"
          )
      .sort.key Key
        button.sort(
          :class="{ active: sortAction.name === 'key' }",
          @click="sort('key', sortDirection === 'asc' ? 'desc' : 'asc')"
        )
          i.icon(
            :class="{ sort: sortDirection === 'asc' && 'key', sort_down: sortDirection === 'desc' && 'key' }"
          )
        .key
      .tags Tags
      .sort.lead Lead
        button.sort(
          :class="{ active: sortAction.name === 'lead' }",
          @click="sort('lead', sortDirection === 'asc' ? 'desc' : 'asc')"
        )
          i.icon(
            :class="{ sort: sortDirection === 'asc' && 'lead', sort_down: sortDirection === 'desc' && 'lead' }"
          )
      .members Members
    common-loader(v-if="isLoader")
    .projects(v-if="totalProjects && !isLoader")
      .ptojects-table__block.ptojects-table__content.position(
        v-for="(item, index) in processProjectData",
        :key="index"
      )
        .star-block.laptop
          i.icon.unchecked
          i.icon.star.checked
        .name(v-if="item.attributes.logo")
          img(
            v-if="item.attributes.logo",
            :src="JSON.parse(item.attributes.logo.name)"
          )
          router-link(
            :to="{ name: 'projectsIssues', params: { key: item.attributes.key, projectId: item.id } }"
          ) {{ item.attributes.title }}
        .key {{ item.attributes.key }}
        .tags.tags-block
          .tags-block(
            v-for="(i, index) in item.attributes.tags.data.slice(0, 3)",
            :key="index"
          ) {{ i.attributes.name }}
        .lead.flex(v-if="item.attributes.lead.data")
          img(
            v-if="item.attributes.lead.data.attributes.image",
            :src="JSON.parse(item.attributes.lead.data.attributes.image.name)"
          )
          img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
          router-link(
            :to="{ name: 'teamsUser', params: { id: item.attributes.lead.data.id } }"
          ) {{ item.attributes.lead.data.attributes.username }}
        .members.flex(v-if="item.attributes.members.data.length")
          .img(
            v-for="(i, index) in item.attributes.members.data.slice(0, 3)",
            :key="index"
          )
            router-link(:to="{ name: 'teamsUser', params: { id: i.id } }")
              img(
                v-if="i.attributes.image",
                :src="JSON.parse(i.attributes.image.name)"
              )
              img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        .star-block.mobile
          i.icon.unchecked
          i.icon.star
    no-results(
      v-if="noDataShow || (noResultsShow && filterUse)",
      :no-data="noDataShow",
      @reset="reset"
    )
    pagination-component(
      v-show="totalProjects > itemsPerPage && !noResultsShow && !isLoader",
      :total-items="totalProjects",
      :items-per-page="itemsPerPage",
      @onPageChange="handlePageChange"
    )
</template>

<script lang="ts" setup>
import NoResults from "@/components/NoResults.vue";
import CommonLoader from "@/components/common/CommonLoader.vue";
import PaginationComponent from "@/components/common/PaginationComponent.vue";
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import { showProjects } from "@/services/api/projectApi";
import CommonButton from "@/components/common/CommonButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { showTag, tagNames } from "@/composables/tagActions";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import {
  endIndex,
  itemsPerPage,
  page,
  startIndex,
} from "@/composables/pagination";
import { leadNames, showDataUser } from "@/composables/userActions";

const props = defineProps({
  newProjectShow: {
    type: Boolean,
  },
});
const projectsArray = ref([]);
const noResultsShow = ref(false);
const filterUse = ref(false);
const noDataShow = ref(false);
const totalProjects = ref(null);
const tagItem = ref([]);
const leadItem = ref("");
const isLoader = ref(false);
const isFetching = ref(false);
const sortDirection = ref("asc");
const filter = ref("");
const leadData = ref([]);
const dropdownStates = ref({
  tags: { isOpen: false },
  lead: { isOpen: false },
});

const sortAction = ref({
  name: "title",
  status: "ASC",
  class: "active",
});

const searchText = ref("");
const reset = () => {
  showTag();
  page.value = 1;
  searchText.value = "";
  if (tagItem.value.length) {
    tagItem.value = [];
  }
  showDataUser();
  leadItem.value = "";
  noResultsShow.value = false;
  close();
};

const clear = () => {
  tagItem.value = [];
  fetchProjects("");
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

const close = (dropdownName: string) => {
  dropdownStates.value.tags.isOpen = false;
  dropdownStates.value.lead.isOpen = false;
};

const selectedItem = (tag: { id: any; name: string }) => {
  if (dropdownStates.value.tags.isOpen) {
    if (!tagItem.value.includes(tag)) {
      tagItem.value.push(tag);
    } else {
      const indexToRemove = tagItem.value.findIndex(
        (item) => item.id === tag.id
      );

      if (indexToRemove !== -1) {
        tagItem.value.splice(indexToRemove, 1);
        fetchProjects(
          `&sort=${sortAction.value.name}:${sortAction.value.status}`
        );
      }
    }
    if (tagNames.tags.length === tagItem.value.length) {
      dropdownStates.value.tags.isOpen = !dropdownStates.value.tags.isOpen;
    }
  } else {
    leadItem.value = tag;
    leadData.value = [...leadNames.value];
    const tagIndexToRemove = leadData.value.findIndex((m) => m.id === tag.id);
    if (tagIndexToRemove !== -1) {
      leadData.value.splice(tagIndexToRemove, 1);
    }
    dropdownStates.value.lead.isOpen = !dropdownStates.value.lead.isOpen;
  }
};
const fetchAndSetProjects = computed(() => {
  return fetchProjects(filter.value);
});

watch(
  [() => searchText.value, () => tagItem.value, () => leadItem.value],
  ([searchTextValue, tagItemValue, leadItemValue]) => {
    const filters = [];

    if (searchTextValue) {
      noResultsShow.value = false;
      filterUse.value = true;
      filters.push(`filters[title][$contains]=${searchTextValue}`);
    }

    if (tagItemValue && tagItemValue.length) {
      const tagFilters = tagItemValue
        .map(
          (tag, index) => `filters[$and][${index}][tags][name][$eq]=${tag.name}`
        )
        .join("&");
      filters.push(tagFilters);
      filterUse.value = true;
      noResultsShow.value = false;
    }

    if (leadItemValue) {
      filters.push(
        `filters[$and][${leadItemValue.id}][lead][username][$eq]=${leadItemValue.name}`
      );
      filterUse.value = true;
      noResultsShow.value = false;
    }

    filter.value = filters.length ? `&${filters.join("&")}` : "";
    fetchProjects(filter.value);
  },
  { deep: true }
);

const processProjectData = computed(() => {
  updateData();
  return projectsArray.value;
});

const updateData = () => {
  let show = props.newProjectShow;
  if (show && !isFetching.value) {
    isFetching.value = true;
    fetchProjects("").then(() => {
      isFetching.value = false;
    });
  }
};
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  startIndex.value = (page.value - 1) * itemsPerPage.value;
  fetchProjects("");
};
const fetchProjects = (filters: string) => {
  isLoader.value = true;
  return new Promise(() => {
    showProjects(
      `pagination[start]=${startIndex.value}&pagination[limit]=${endIndex.value}${filters}`
    ).then((response) => {
      projectsArray.value = response.data.data.map(
        (project: ProjectInterfaceItem) => project
      );
      totalProjects.value = response.data.meta.pagination.total;
      isLoader.value = false;
      if (!totalProjects.value && filterUse.value) {
        noResultsShow.value = true;
      } else if (!totalProjects.value) {
        noDataShow.value = true;
      }
    });
  });
};
const deleteLead = () => {
  showDataUser();
  leadItem.value = "";
  noResultsShow.value = false;
  fetchProjects("");
};
const sort = (field: string) => {
  if (sortAction.value.name === field) {
    sortAction.value.status =
      sortAction.value.status === "ASC" ? "DESC" : "ASC";
  } else {
    sortAction.value = {
      name: field,
      status: "ASC",
      class: "active",
    };
  }
  if (field === "lead") {
    fetchProjects(`&_sort=lead.attributes.username:${sortAction.value.status}`);
  } else {
    fetchProjects(`&sort=${field}:${sortAction.value.status}`);
  }
};

const selectAll = (item: [{ name: string; id: number }]) => {
  if (!tagItem.value.some((tag) => tag.id === item.id)) {
    tagItem.value.push(item);
  }
  dropdownStates.value.tags.isOpen = false;
};

onMounted(() => {
  fetchProjects(`&sort=${sortAction.value.name}:${sortAction.value.status}`);
  showTag();
  showDataUser();
});
</script>

<style lang="scss" scoped>
.project--background {
  @include media_mobile {
    background: var(--background);
    position: relative;
    width: 100%;
    height: 500px;
  }
}

.project {
  background: var(--background);
  height: -webkit-fill-available;
  width: calc(100% - 80px);
  padding: 28px 40px 89px;
  @include media_mobile {
    top: 56px;
    position: absolute;
    height: 100vh;
  }

  .projects {
    @include media_mobile {
      min-height: 380px;
    }
  }

  .position {
    display: flex;

    label {
      display: none;
    }

    @include media_tablet {
      .form-group {
        margin-bottom: 26px;
      }
    }
    @include media_mobile {
      flex-direction: column;
      .form-group {
        margin-bottom: 0;

        &.tags {
          .form-icon {
            input {
              padding: 9px 10px;
              height: 34px;
            }
          }
        }
      }
    }

    .search {
      input {
        width: 220px;
        @include media_mobile {
          width: 100%;
          padding: 8px 8px 8px 27px;
          height: 34px;
        }
      }
    }

    i.icon {
      right: 16px;

      &.arrow {
        height: 12px;
        width: 16px;
        top: 19px;

        &.active {
          transform: rotate(180deg);
          top: 17px;
        }

        @include media_mobile {
          right: 10px;
          width: 10px;
          height: 5px;
          top: 14px;
          &.active {
            top: 14px;
          }
        }

        &.mobile {
          display: none;
        }
      }

      &.search {
        @include media_mobile {
          left: 8px;
          height: 13px;
          width: 13px;
        }
      }
    }

    .mobile {
      display: flex;
      position: relative;
      margin-left: 10px;
      @include media_mobile {
        margin-left: 0px;
        margin-top: 6px;
      }

      .tags__block {
        z-index: 3;
        top: 63px;
        @include media_mobile {
          top: 155px;
          position: fixed;
          left: 14px;
        }
      }

      .selected {
        display: flex;
        align-items: center;
        background: var(--accent);
        @include font(12px, 500, 16px, var(--white));
        padding: 4px 8px;
        border-radius: 12px;
        width: fit-content;
        z-index: 2;
        margin-left: 6px;
        @include media_mobile {
          font-size: 8px;
          line-height: 12px;
          margin-left: 4px;
          border-radius: 14px;
          height: 14px;
          box-sizing: border-box;
        }
      }

      button {
        &.reset {
          padding: 14px 26px;
          margin-left: 10px;
          font-size: 14px;
          line-height: 20px;
          height: fit-content;
          @include media_mobile {
            margin: 0 0 0 6px;
            &.laptop {
              display: none;
            }
          }

          &.mobile {
            display: none;
            @include media_mobile {
              display: block;
              width: auto;
              padding: 9px 10px;
              .reset {
                position: relative;
                right: auto;

                &::before {
                  background: var(--white);
                }
              }
            }
          }
        }

        &.lead {
          height: 48px;

          div {
            display: flex;
            align-items: center;
          }

          img {
            height: 20px;
            width: 20px;
            left: 16px;
            position: absolute;
            border-radius: 10px;
            @include media_mobile {
              left: 10px;
              width: 13px;
              height: 13px;
            }
          }

          .member {
            left: 16px;

            &::before {
              background: var(--white);
            }

            @include media_mobile {
              left: 10px;
              width: 13px;
              height: 13px;
            }
          }
        }
      }

      .dropdown__block {
        position: relative;

        &:first-of-type {
          margin-right: 10px;
          @include media_mobile {
            margin-right: 6px;
          }
        }

        .lead {
          height: 48px;
          width: 102px;
          @include media_mobile {
            width: 67px;
            height: 34px;
          }

          i.close {
            width: 12px;
            height: 12px;
            right: 16px;
            top: 19px;

            &::before {
              background: var(--white);
            }

            @include media_mobile {
              top: 13px;
              width: 8px;
              height: 8px;
              right: 10px;
            }
          }
        }

        .btn-secondary {
          padding: 12px 36px 12px 16px;
          @include media_mobile {
            padding: 9px 24px 9px 10px;
          }

          &.select {
            width: 100%;
          }
        }

        .tags-block {
          padding: 12px 44px 12px 16px;
          background: var(--white);
          border-color: var(--primary);
          color: var(--text);
          height: 48px;
          width: auto;

          &:hover {
            border-color: var(--accent);
            background: var(--white_shadow, #f4f4f4);
          }

          &.select {
            color: var(--accent);

            i.arrow {
              &::before {
                background: var(--accent);
              }
            }
          }

          @include media_mobile {
            padding: 9px 26px 9px 10px;
            font-size: 12px;
            line-height: 16px;
            height: 34px;
          }

          .form-icon {
            input {
              padding: 9px 10px;
            }
          }
        }
      }
    }
  }

  @include media_tablet {
    width: calc(100% - 40px);
    padding: 28px 20px 89px;
  }
  @include media_mobile {
    padding: 12px 16px 0;
    width: calc(100% - 32px);
  }

  .btn_icon {
    padding: 12px 16px;
    box-sizing: border-box;
    @include media_mobile {
      padding: 9px 10px;
    }
  }

  h1 {
    padding: 0;
    margin: 0 0 28px;
    @include font(24px, 500, 28px, var(--text));
    @include media_mobile {
      display: none;
    }
  }

  .ptojects-table {
    width: 100%;
    margin-top: 16px;
    @include media_tablet {
      margin-top: 0;
    }
    @include media_mobile {
      margin-top: 16px;
    }

    &__block {
      display: flex;
      align-items: center;
      position: relative;
      @include font(16px, 500, 24px, var(--text));
      @include media_tablet {
        font-size: 14px;
        line-height: 20px;
      }

      &.position {
        margin: 0 0 4px;
        height: 44px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        @include media_mobile {
          justify-content: flex-start;
        }
      }

      &.distance {
        margin-bottom: 20px;
        padding: 0;
        border-bottom: 1px solid var(--primary);
        padding: 3px 0;
        @include media_tablet {
          padding: 5px 0;
        }
        @include media_mobile {
          display: none;
        }
      }

      img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 16px;
        @include media_tablet {
          width: 28px;
          height: 28px;
          margin-right: 10px;
        }
      }

      .star-block {
        width: 5.67%;
        @include media_small_laptop {
          width: 4.67%;
        }
        @include media_tablet {
          width: 6.67%;
        }
        @include media_mobile {
          margin-left: 0;
        }

        &:hover {
          .unchecked {
            display: none;
          }

          .checked {
            display: block;
          }
        }

        &.laptop {
          @include media_mobile {
            display: none;
          }
        }

        &.mobile {
          display: none;
          @include media_mobile {
            display: block;
          }
        }

        .star {
          left: 10px;
          height: 16px;
          width: 16px;
          position: relative;
          @include media_mobile {
            display: none;
          }
        }

        .unchecked {
          position: relative;
          right: 0;
          left: 7px;

          &::before {
            background: var(--text);
          }

          @include media_tablet {
            width: 16px;
            height: 16px;
            left: 12px;
          }
          @include media_mobile {
            margin: -11px -10px;
          }
        }

        .checked {
          right: 0;
          left: 7px;
          width: 20px;
          height: 20px;
          display: none;
          @include media_tablet {
            width: 16px;
            height: 16px;
            left: 12px;
          }
          @include media_mobile {
            margin: -11px -10px;
          }

          &::before {
            background: var(--notify_warning);
          }
        }
      }

      .name {
        width: 24.83%;
        margin-left: -2px;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          button.sort {
            display: block;
          }
        }

        @include media_tablet {
          margin-left: 1px;
        }
        @include media_mobile {
          margin-left: 0;
          width: 45%;
        }

        img {
          border-radius: 6px;
        }

        a {
          color: var(--accent);
          margin: 0;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }

          @include media_tablet {
            font-size: 12px;
            line-height: 16px;
            text-wrap: wrap;
          }
        }

        button.sort {
          display: none;

          &.active {
            display: block;

            &:hover {
              i.sort {
                &::before {
                  background: var(--primary);
                }
              }

              i.sort_down {
                &::before {
                  background: var(--primary);
                }
              }
            }

            i.sort {
              &::before {
                background: var(--text);
              }
            }

            i.sort_down {
              &::before {
                background: var(--text);
              }
            }
          }
        }
      }

      .key {
        width: 9.83%;
        margin-left: 8px;
        @include media_tablet {
          margin-left: -11px;
        }
        @include media_mobile {
          display: none;
        }

        &:hover {
          .sort {
            display: block;
          }
        }

        button.sort {
          display: none;

          &.active {
            display: block;

            &:hover {
              i.sort {
                &::before {
                  background: var(--primary);
                }
              }

              i.sort_down {
                &::before {
                  background: var(--primary);
                }
              }
            }

            i.sort {
              &::before {
                background: var(--text);
              }
            }

            i.sort_down {
              &::before {
                background: var(--text);
              }
            }
          }
        }
      }

      .sort {
        display: flex;
        align-items: center;
        justify-content: space-between;

        i.icon.sort {
          width: 16px;
          height: 16px;
        }

        &.name {
          position: relative;

          button.sort {
            i.icon.sort {
              @include media_tablet {
                position: absolute;
                right: 24px;
                top: 2px;
              }

              &.active {
                &::before {
                  background: var(--text);
                }
              }
            }
          }
        }

        button {
          background: transparent;
          border: none;

          .sort {
            position: relative;

            &.active {
              display: block;
            }

            &::before {
              background: var(--primary);
            }

            &:hover {
              display: block;

              &::before {
                background: var(--primary);
              }
            }
          }

          .sort_down {
            position: relative;
            width: 16px;
            height: 16px;

            &::before {
              background: var(--primary);
            }

            &.active {
              &::before {
                background: var(--text);
              }
            }

            &:hover {
              &::before {
                background: var(--primary);
              }
            }
          }
        }
      }

      .tags {
        width: 29.33%;
        margin-left: 8px;
        display: flex;
        align-items: center;
        @include media_tablet {
          margin-left: -8px;
        }
        @include media_mobile {
          display: none;
        }

        .tags-block {
          background: var(--accent);
          padding: 6px 8px;
          border-radius: 8px;
          width: fit-content;
          @include font(14px, 400, 20px, var(--white));
          margin-right: 10px;
          @include media_tablet {
            margin-right: 4px;
            font-size: 12px;
            line-height: 16px;
            padding: 4px 6px;
            border-radius: 4px;
          }
        }
      }

      .lead {
        width: 15.67%;
        margin-left: 7px;
        display: flex;
        align-items: center;

        a {
          color: var(--accent);
          margin: 0;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        &:hover {
          .sort {
            display: block;
          }
        }

        .sort {
          display: none;
        }

        @include media_tablet {
          margin-left: -12px;
        }
        @include media_mobile {
          display: none;
        }

        button.sort {
          display: none;

          &.active {
            display: block;

            &:hover {
              i.sort {
                &::before {
                  background: var(--primary);
                }
              }

              i.sort_down {
                &::before {
                  background: var(--primary);
                }
              }
            }

            i.sort {
              &::before {
                background: var(--text);
              }
            }

            i.sort_down {
              &::before {
                background: var(--text);
              }
            }
          }
        }
      }

      .members {
        width: 13%;
        margin-left: 9px;
        display: flex;
        align-items: center;
        @include media_tablet {
          margin-left: 35px;
        }
        @include media_mobile {
          width: 45%;
          margin-left: 76px;
        }

        .img {
          outline: 2px solid var(--background);
          border-radius: 16px;
          z-index: 1;
          position: relative;
          margin-left: -8px;
          cursor: pointer;
          @include media_mobile {
            height: 28px;
            width: 28px;
          }

          &:hover {
            z-index: 3;
            border: 2px solid var(--secondary);
            width: 34px;
            height: 34px;
            border-radius: 19px;
            @include media_mobile {
              width: 28px;
              height: 28px;
            }
          }

          img {
            margin-right: 0;

            &:hover {
              width: 34px;
              height: 34px;
              @include media_mobile {
                width: 28px;
                height: 28px;
              }
            }
          }

          &:first-child {
            margin-left: 3px;
          }
        }
      }
    }

    &__content {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 20px;

      &.position {
        @include media_mobile {
          flex-direction: row;
        }
      }

      @include media_tablet {
        font-size: 12px;
        line-height: 16px;
      }
    }
  }
}

.backdrop {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 81px;
  left: 0;
}
</style>

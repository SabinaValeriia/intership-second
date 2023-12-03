<template lang="pug">
.project
  h1 Projects
  form.position
    .form-group.search
      .form-icon 
        input(v-model="searchText", placeholder="Search")
        i.icon.search
    .mobile
      .dropdown__block
        .selected(v-if="tagItem.length > 1") + {{ tagItem.length - 1 }}
        base-input.tags-block(
          :type="`tags`",
          :value-input="tagItem.length > 0 ? `Tags: ${tagItem[0].name}` : 'Tags'",
          @click="toggleDropdown('tags')",
          :class="{ select: tagItem.length }"
        ) 
          template(v-slot:suffix)
            i.icon.arrow
        dropdown-component.tags__block(
          :isOpen="dropdownStates.tags.isOpen",
          :data="tagNames",
          @selectedItem="selectedItem",
          :type="'checkbox'",
          :title="'Project tags'"
        )
      .dropdown__block.lead
        common-button.btn_icon.lead(
          @click.prevent="toggleDropdown('lead')",
          :class="[leadItem ? ['btn-secondary', 'select'] : 'btn_primary']"
        ) {{ leadItem ? leadItem.name : "Lead" }}
          i.icon.close(v-if="leadItem", @click="deleteLead")
        dropdown-component.tags__block(
          :isOpen="dropdownStates.lead.isOpen",
          :data="leadNames",
          @selectedItem="selectedItem",
          :type="'lead-block'"
        )
      common-button.reset.btn-secondary(
        v-if="leadItem || searchText || tagItem.length",
        @click.prevent="reset"
      ) Reset
  .ptojects-table
    .ptojects-table__block.distance
      .star-block 
        i.icon.star
      .sort.name Name
        button.sort(
          @click="sort('name', sortDirection === 'asc' ? 'desc' : 'asc')"
        )
          i.icon(
            :class="{ sort: sortDirection === 'asc' && 'name', sort_down: sortDirection === 'desc' && 'name' }"
          )
      .sort.key Key
        button.sort(
          @click="sort('key', sortDirection === 'asc' ? 'desc' : 'asc')"
        )
          i.icon(
            :class="{ sort: sortDirection === 'asc' && 'key', sort_down: sortDirection === 'desc' && 'key' }"
          )
        .key 
      .tags Tags
      .sort.lead Lead
        button.sort(
          @click="sort('lead', sortDirection === 'asc' ? 'desc' : 'asc')"
        )
          i.icon(
            :class="{ sort: sortDirection === 'asc' && 'lead', sort_down: sortDirection === 'desc' && 'lead' }"
          )
      .members Members
    .projects(v-if="totalProjects")
      .ptojects-table__block.ptojects-table__content.position(
        v-for="(item, index) in projectsArray",
        :key="index"
      )
        .star-block.laptop
          i.icon.unchecked
          i.icon.star.checked
        .name(v-if="isObject(item.logo)")
          img(:src="JSON.parse(item.logo.name)")
          router-link(to="/dashboard/projects") {{ item.title }}
        .key {{ item.key }}
        .tags.tags-block
          .tags-block(
            v-for="(i, index) in item.tags.data.slice(0, 3)",
            :key="index"
          ) {{ i.attributes.name }}
        .lead.flex(v-if="item.lead")
          img(:src="JSON.parse(item.lead.data.attributes.logo.name)")
          router-link(to="/dashboard/teams") {{ item.lead.data.attributes.username }}
        .members.flex(v-if="item.members")
          .img(
            v-for="(i, index) in item.members.data.slice(0, 3)",
            :key="index"
          )
            img(
              v-if="isObject(i.attributes.logo)",
              :src="JSON.parse(i.attributes.logo.name)"
            )
        .star-block.mobile
          i.icon.unchecked
          i.icon.star
      common-loader(v-if="isLoader")
      pagination-component(
        v-if="totalProjects > 8",
        :totalItems="totalProjects",
        :itemsPerPage="8",
        @onPageChange="handlePageChange"
      )
    no-results(
      v-if="noDataShow || noResultsShow",
      :noData="totalProjects === 0 ? true : false",
      :noResults="searchLead",
      @reset="reset"
    )
</template>

<script setup lang="ts">
import PaginationComponent from "@/components/common/PaginationComponent.vue";
import NoResults from "@/components/NoResults.vue";
import CommonLoader from "@/components/common/CommonLoader.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import DropdownSearch from "@/components/common/DropdownSearch.vue";
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import { showProjects } from "@/services/api/projectApi";
import CommonButton from "@/components/common/CommonButton.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { showTag, tagNames } from "@/composables/tagActions";
import { filterFunction } from "@/composables/projectsAction";
import { showUsers } from "@/services/api/userApi";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import { useUserStore } from "../store/user";
const projectsArray = ref([]);
const leadNames = ref([]);
const currentPage = ref(1);
const noResultsShow = ref(false);
const noDataShow = ref(false);
const totalProjects = ref(null);
const tagItem = ref([]);
const leadItem = ref("");
const isLoader = ref(false);
const sortDirection = ref("asc");
const page = ref(1);
const limit = ref(8);
const startIndex = (page.value - 1) * limit.value;
const endIndex = startIndex + limit.value;
const userStore = useUserStore();

const searchText = ref("");
const isObject = computed(() => (value: { name: string }) => {
  return value !== null && typeof value === "object";
});

const reset = () => {
  searchText.value = "";
  leadItem.value = "";
  tagItem.value = [];
  noResultsShow.value = false;
  showProjects("_page=1&_limit=8").then((response) => {
    const startIndex = (page.value - 1) * limit.value;
    const endIndex = startIndex + limit.value;
    projectsArray.value = response.data.data
      .slice(startIndex, endIndex)
      .map((project: ProjectInterfaceItem) => project.attributes);
  });
};

const dropdownStates = ref({
  tags: { isOpen: false },
  lead: { isOpen: false },
});

const toggleDropdown = (dropdownName: string) => {
  dropdownStates.value[dropdownName].isOpen =
    !dropdownStates.value[dropdownName].isOpen;
};

const { selected } = filterFunction([]);

const selectedItem = (tag: { name: string }) => {
  if (dropdownStates.value.tags.isOpen) {
    if (!tagItem.value.some((selectedTag) => selectedTag.id === tag.id)) {
      tagItem.value.push(tag);
      if (tagItem.value.length === tagNames.value.length) {
        tagNames.value.splice(0, tagNames.value.length);
        dropdownStates.value.tags.isOpen = !dropdownStates.value.tags.isOpen;
      }
    }
  } else {
    leadItem.value = tag;
    dropdownStates.value.lead.isOpen = !dropdownStates.value.lead.isOpen;
  }
};

const fetchAndSetProjects = () => {
  const searchTerm = searchText.value.toLowerCase();

  if (searchTerm) {
    isLoader.value = true;
    projectsArray.value = projectsArray.value.filter(
      (item: { title: string }) => {
        const title = item.title.toLowerCase();
        return title.includes(searchTerm);
      }
    );
    if (projectsArray.value.length) {
      setTimeout(() => {
        isLoader.value = false;
      }, 1000);
      isLoader.value = false;
    } else {
      setTimeout(() => {
        isLoader.value = false;
      }, 1000);
      noResultsShow.value = true;
    }
  } else if (tagItem.value.length) {
    isLoader.value = true;

    setTimeout(() => {
      showProjects(`filters[tags]=${tagItem.value[0].id}`).then((response) => {
        const startIndex = (page.value - 1) * limit.value;
        const endIndex = startIndex + limit.value;
        projectsArray.value = response.data.data
          .slice(startIndex, endIndex)
          .map((project) => project.attributes);
        isLoader.value = false;
        if (projectsArray.value.length) {
          noResultsShow.value = false;
        } else {
          noResultsShow.value = true;
        }
      });
    }, 1000);
  } else if (leadItem.value) {
    isLoader.value = true;

    setTimeout(() => {
      showProjects(`filters[lead]=${leadItem.value.id}`).then((response) => {
        const startIndex = (page.value - 1) * limit.value;
        const endIndex = startIndex + limit.value;
        projectsArray.value = response.data.data
          .slice(startIndex, endIndex)
          .map((project) => project.attributes);
        isLoader.value = false;
        if (projectsArray.value.length) {
          noResultsShow.value = false;
        } else {
          noResultsShow.value = true;
        }
      });
    }, 1000);
  } else {
    return projectsArray.value;
  }
};

watchEffect(() => {
  fetchAndSetProjects();
});

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  page.value = currentPage.value;
  isLoader.value = true;
  setTimeout(() => {
    isLoader.value = false;
    showProjects("_page=1&_limit=8").then((response) => {
      const startIndex = (page.value - 1) * limit.value;
      const endIndex = startIndex + limit.value;
      projectsArray.value = response.data.data
        .slice(startIndex, endIndex)
        .map((project: ProjectInterfaceItem) => project.attributes);
    });
  }, 1000);
};

const deleteLead = () => {
  leadItem.value = "";
  dropdownStates.value.lead.isOpen = !dropdownStates.value.lead.isOpen;
};

const sort = (field: string, order: "asc" | "desc") => {
  sortDirection.value = order;
  if (order === "asc") {
    showProjects("_page=1&_limit=8&sort=title:ASC").then((response) => {
      projectsArray.value = response.data.data
        .slice(startIndex, endIndex)
        .map((project: ProjectInterfaceItem) => project.attributes);
    });
  } else {
    showProjects("_page=1&_limit=8&sort=title:DESC").then((response) => {
      projectsArray.value = response.data.data
        .slice(startIndex, endIndex)
        .map((project: ProjectInterfaceItem) => project.attributes);
    });
  }
};

onMounted(() => {
  watch(
    () => userStore.projectData,
    (newProjectData) => {
      isLoader.value = true;
      setTimeout(() => {
        projectsArray.value.push(newProjectData.data.attributes);
        isLoader.value = false;
      }, 1000);
    }
  );
  showProjects("_page=1&_limit=8&sort=title:ASC").then((response) => {
    projectsArray.value = response.data.data
      .slice(startIndex, endIndex)
      .map((project: ProjectInterfaceItem) => project.attributes);
    totalProjects.value = response.data.data.length;
  });
  showTag();
  showUsers().then(({ data }) => {
    leadNames.value = data.map(
      (item: {
        name: string;
        logo: {
          name: string;
        };
        id: number;
      }) => ({
        name: item.username,
        logo: item.logo,
        id: item.id,
      })
    );
  });
});
</script>

<style lang="scss">
.project {
  background: var(--background);
  height: 100vh;
  width: calc(100% - 80px);
  padding: 28px 40px 89px;
  .position {
    display: flex;
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
              width: 64px;
              height: 34px;
            }
          }
        }
      }
    }
    label {
      display: none;
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
        @include media_mobile {
          right: 8px;
          width: 10px;
          height: 5px;
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
        top: 64px;
        z-index: 3;
        width: 240px;
        @include media_mobile {
          top: 47px;
          width: 341px;
        }
      }
      .selected {
        background: var(--accent);
        @include font(12px, 500, 16px, var(--white));
        padding: 4px 8px;
        border-radius: 12px;
        width: fit-content;
        position: absolute;
        right: 49px;
        top: 12px;
        z-index: 2;
        @include media_mobile {
          font-size: 8px;
          line-height: 12px;
          right: 23px;
          top: 8px;
        }
      }
      button {
        &.reset {
          width: 102px;
          height: 48px;
          margin-left: 20px;
          @include media_mobile {
            width: 67px;
            height: 34px;
            margin-left: 12px;
          }
        }
        &.lead {
          height: 48px;
        }
      }
      .dropdown__block {
        position: relative;
        .lead {
          height: 48px;
          margin-left: 10px;
          width: 102px;
          @include media_mobile {
            width: 67px;
            height: 34px;
            margin-left: 6px;
          }
          i.close {
            width: 12px;
            height: 12px;
            right: 10px;
            top: 19px;
            &::before {
              background: var(--white);
            }
            @include media_mobile {
              top: 12px;
            }
          }
        }
        .btn-secondary {
          padding: 16px 34px 16px 16px;
          @include media_mobile {
            padding: 9px 34px 9px 10px;
          }
          &.select {
            width: 100%;
          }
        }
        .tags-block {
          width: 97px;
          @include media_mobile {
            width: 64px;
          }
          &.select {
            width: 100%;
            position: relative;
            input {
              color: var(--accent);
              width: 100%;
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
    &::before {
      background: url("@/assets/icons/member.svg");
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
        @include media_tablet {
          width: 28px;
          height: 28px;
          margin-right: 6px;
        }
      }
      .star-block {
        width: 3.67%;
        margin-left: 10px;
        @include media_tablet {
          width: 4.67%;
        }
        @include media_mobile {
          width: 5%;
          margin-left: 0;
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
          height: 16px;
          width: 16px;
          position: relative;
          @include media_mobile {
            display: none;
          }
        }
        .unchecked {
          position: relative;
          margin: -11px 12px;
          &::before {
            background: var(--text);
          }
          &:hover {
            display: none;
          }
          @include media_tablet {
            width: 16px;
            height: 16px;
          }
          @include media_mobile {
            margin: -11px 17px;
          }
        }
        .checked {
          margin: -20px 12px;
          width: 20px;
          height: 20px;
          display: none;
          &::before {
            background: var(--notify_warning);
          }
          &:hover {
            display: block;
          }
        }
      }
      .name {
        width: 24.83%;
        margin-left: -2px;
        display: flex;
        align-items: center;
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
                right: 17px;
              }
            }
          }
        }
        button {
          background: transparent;
          border: none;
          .sort {
            position: relative;
            &::before {
              background: var(--text);
            }
            &:hover {
              &::before {
                background: var(--primary);
              }
            }
          }
          .sort_down {
            position: relative;
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
        @include media_tablet {
          margin-left: -12px;
        }
        @include media_mobile {
          display: none;
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
          &:hover {
            z-index: 3;
            border: 2px solid var(--secondary);
            width: 34px;
            height: 34px;
            border-radius: 19px;
          }
          img {
            margin-right: 0;
            &:hover {
              width: 34px;
              height: 34px;
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
</style>

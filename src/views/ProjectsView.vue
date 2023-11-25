<template lang="pug">
.project
  h1 Projects
  form.position
    .form-group.search
      .form-icon
        input(v-model="searchText", placeholder="Search projects")
        i.icon.search
    .mobile
      .dropdown-block
        base-input.tags-project(
          :class="{ select: selectItemTag.length }",
          :type="`tags`",
          :withIcon="true",
          :value-input="selectItemTag[0] !== undefined ? `Tags: ${selectItemTag[0]}` : 'Tags'",
          @click="toggleDropdown('tags')"
        )
        .selected(v-if="selectItemTag.length > 1") + {{ selectItemTag.length - 1 }}
        dropdown-search(
          :isOpen="dropdownStates.tags.isOpen",
          :data="tagNames",
          :tags="true",
          :clear="true",
          @selectedItem="selectedItem",
          :className="true"
        )
      .dropdown-block
        common-button.btn_primary.btn_icon.lead(
          @click.prevent="toggleDropdown('lead')"
        ) {{ selectItemLead ? selectItemLead : "Lead" }}
        dropdown-search(
          :iconHere="true",
          :data="leadNames",
          @selectedItem="selectedItem",
          :isOpen="dropdownStates.lead.isOpen",
          :className="true"
        )
      common-button.reset.btn-secondary(
        v-if="selectItemLead || searchText",
        @click.prevent="reset"
      ) Reset
  .ptojects-table
    .ptojects-table__block.distance
      .star-block 
        i.icon.star
      .name Name
      .sort.key Key
      .tags Tags
      .lead Lead
      .members Members
    .projects(v-if="projects.length")
      .ptojects-table__block.ptojects-table__content.position(
        v-for="(project, index) in displayedItems",
        :key="index"
      )
        .star-block.laptop
          i.icon.unchecked_star
        .name(v-if="isObject(project.logo)")
          img(:src="JSON.parse(project.logo.name)")
          p {{ project.title }}
        .key {{ project.key }}
        .tags.tags-block
          .tags-block(
            v-for="(tag, index) in tagNames.slice(0, 3)",
            :key="index"
          ) {{ tag.tag }}
        .lead.flex(v-if="isObject(project.lead.data.attributes.logo)")
          img(:src="JSON.parse(project.lead.data.attributes.logo.name)")
          p {{ project.lead.data.attributes.username }}
        .members.flex
          .img(
            v-for="(item, index) in project.members.data.slice(0, 3)",
            :key="index"
          )
            img(
              v-if="isObject(item.attributes.logo)",
              :src="JSON.parse(item.attributes.logo.name)"
            )
        .star-block.mobile
          i.icon.unchecked_star
      pagination-component(
        v-if="projects.length === 0",
        :totalItems="projects.length",
        :itemsPerPage="itemsPerPage",
        :onPageChange="handlePageChange"
      )
    common-loader(v-else)
    no-results(
      :noData="projects.length === 0 ? true : false",
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
import { showProjects } from "@/services/api/projectApi";
import CommonButton from "@/components/common/CommonButton.vue";
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "../store/user";
import { showTag, tagNames } from "@/composables/tagActions";
import { showProject, projects } from "@/composables/projectsAction";
import { showUsers } from "@/services/api/userApi";
const userStore = useUserStore();
const projectsArray = ref();
const tags = ref();
const members = ref();
const lengthProjects = ref(null);
const selectItem = ref([]);
const selectItemTag = ref([]);
const selectItemLead = ref();
const leadNames = ref([]);
const searchLead = ref(false);
const totalItems = ref(null);
const itemsPerPage = ref(10);
const currentPage = ref(1);
const isMobileState = ref(false);

const searchText = ref("");
const isObject = computed(() => {
  return function (value) {
    return value !== null && typeof value === "object";
  };
});

const filterAndPaginateProjects = (
  allProjects,
  searchText,
  currentPage,
  itemsPerPage
) => {
  let filteredProjects = allProjects;
  isMobile();
  if (searchText.trim()) {
    const searchTerm = searchText.trim().toLowerCase();
    filteredProjects = filteredProjects.filter((project) => {
      const name = project.title.toLowerCase();
      return name.includes(searchTerm);
    });
  }

  if (selectItemLead.value) {
    filteredProjects = filteredProjects.filter((project) => {
      return project.lead.data.attributes.username === selectItemLead.value;
    });
    searchLead.value = true;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  if (isMobileState.value) {
    const paginatedProjects = filteredProjects.slice(startIndex, 8);
    return paginatedProjects;
  } else {
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    return paginatedProjects;
  }
};

const reset = () => {
  selectItemLead.value = "";
  searchText.value = "";
  searchLead.value = false;
};

const displayedItems = computed(() => {
  console.log(displayedItems);
  return filterAndPaginateProjects(
    projects.value,
    searchText.value,
    currentPage.value,
    itemsPerPage.value
  );
});

const dropdownStates = ref({
  tags: { isOpen: false },
  lead: { isOpen: false },
});

const isMobile = () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobileState.value = true;
  } else {
    isMobileState.value = false;
  }
};

const toggleDropdown = (dropdownName) => {
  dropdownStates.value[dropdownName].isOpen =
    !dropdownStates.value[dropdownName].isOpen;
};
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const selectedItem = (select) => {
  if (dropdownStates.value.tags.isOpen) {
    const tagToAdd = select.tag;

    if (!selectItemTag.value.includes(tagToAdd)) {
      selectItemTag.value.push(tagToAdd);
      dropdownStates.value.tags.isOpen = !dropdownStates.value.tags.isOpen;
    }
  } else {
    selectItemLead.value = select.leadName;
    dropdownStates.value.lead.isOpen = !dropdownStates.value.lead.isOpen;
  }
};
onMounted(() => {
  showProject();
  projectsArray.value = projects.value;
  lengthProjects.value = projectsArray.value.length;
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
  });
});
</script>

<style lang="scss">
.project {
  background: var(--background);
  height: 100vh;
  width: calc(100% - 80px);
  padding: 28px 40px 89px;
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
  button.reset {
    width: 91px;
    height: 48px;
    margin-left: 10px;
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
    &__block {
      display: flex;
      align-items: center;
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
        }
        .unchecked_star {
          position: relative;
          margin: 5px -2px;
          @include media_tablet {
            width: 16px;
            height: 16px;
          }
        }
      }
      .name {
        width: 24.83%;
        margin-left: -2px;
        display: flex;
        align-items: center;
        @include media_tablet {
          margin-left: 10px;
        }
        @include media_mobile {
          margin-left: 0;
          width: 45%;
        }
        img {
          border-radius: 6px;
        }
        p {
          color: var(--accent);
          margin: 0;
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
        p {
          color: var(--accent);
          margin: 0;
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
          img {
            margin-right: 0;
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
      @include media_tablet {
        font-size: 12px;
        line-height: 16px;
      }
    }
  }
}
</style>

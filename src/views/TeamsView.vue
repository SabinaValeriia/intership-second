<template lang="pug">
.teams
  .teams-block
    h1 People
    form.position
      .form-group.search
        .form-icon
          input(v-model="searchText", placeholder="Search teams")
          i.icon.search
    .teams-block__button(:class="{ selected: projectValue.length }")
      .teams-block__button(:class="{ selected: projectValue.length }")
        .teams-block__button-dropdown
          common-button.btn_primary.btn_icon(
            :class="{ selected: projectValue.length }",
            @click="toggleDropdown('project')"
          ) {{ projectValue.length ? projectValue[0].name : "Project" }}
            i.icon.projects(v-if="!projectValue.length")
            img(
              v-else,
              :src="JSON.parse(projectValue[0].logo.name)",
              alt="avatar"
            )
            i.icon.close(
              v-if="projectValue.length",
              @click.stop="deleteProject('project')"
            )
          dropdown-component.teams-dropdown(
            :is-open="dropdownStates.project.isOpen",
            :data="projectNames",
            :icon-here="true",
            :type="'lead'",
            @selectedItem="selectedItem"
          )
        .teams-block__button-dropdown
          common-button.btn_primary.btn_icon(
            :class="{ selected: managerValue.length }",
            @click="toggleDropdown('manager')"
          ) {{ managerValue.length ? managerValue[0].name : "Manager" }}
            i.icon.member(v-if="!managerValue.length")
            div(v-else)
              img.logo(
                v-if="managerValue[0].logo",
                :src="JSON.parse(managerValue[0].logo.name)",
                alt="name"
              )
              img(
                v-else-if="!managerValue[0].logo",
                :src="require(`@/assets/icons/default_user.svg`)"
              )
            i.icon.close(
              v-if="managerValue.length",
              @click.stop="deleteProject('manager')"
            )
          dropdown-component.teams-dropdown(
            :is-open="dropdownStates.manager.isOpen",
            :data="leadNames",
            :type="'lead'",
            @selectedItem="selectedItem"
          )
        .teams-block__button-dropdown
          common-button.btn_primary.btn_icon(
            :class="{ selected: departmentValue.length }",
            @click="toggleDropdown('department')"
          ) {{ departmentValue.length ? departmentValue[0].name : "Department" }}
            i.icon.department
            i.icon.close(
              v-if="departmentValue.length",
              @click.stop="deleteProject('department')"
            )
          dropdown-component.teams-dropdown(
            :is-open="dropdownStates.department.isOpen",
            :data="departmentNames",
            @selectedItem="selectedItem"
          )
      common-button.btn-secondary.reset.desktop(
        v-if="searchText || managerValue.length || departmentValue.length || projectValue.length",
        @click="reset"
      ) Reset
      common-button.btn-secondary.mobile(
        v-if="searchText || managerValue.length || departmentValue.length || projectValue.length",
        @click="reset"
      )
        i.icon.reset
    .box-container(v-if="!isLoader")
      .box-item(
        v-for="(lead, index) in processUsersData.slice(0, 20)",
        :key="index"
      )
        router-link.flip-box(
          :to="{ name: 'teamsUser', params: { id: lead.id } }"
        )
          .flip-box-front
            img.avatar(
              v-if="lead.logo",
              :src="JSON.parse(lead.logo.name)",
              alt="avatar"
            )
            img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
            h3 {{ lead.username }}
            p {{ lead.department.name }} developer
          .flip-box-back
            .flip-box-user
              div
                h4 {{ lead.username }}
                h6 Developer
                p {{ lead.email }}
              img.avatar(
                v-if="lead.logo",
                :src="JSON.parse(lead.logo.name)",
                alt="avatar"
              )
            .flip-box-desc
              h5 Department:
                span {{ lead.department.name }}
              h5(
                v-for="manager in lead.user_managers.slice(0, 1)",
                :key="manager"
              ) Manager:
                img(
                  v-if="manager.logo",
                  :src="JSON.parse(manager.logo.name)",
                  alt="avatar"
                )
                span {{ manager.username }}
              h5 Projects:
                span {{ lead.project_manager.length }} +
              h5 Assign tasks:
                span {{ lead.task_reporter.length }} +
              h5 Hour spent:
                span 40h
    no-results(
      v-if="noDataShow || (noResultsShow && filterUse)",
      @reset="reset"
    )
    common-loader(v-if="isLoader")
</template>

<script lang="ts" setup>
import CommonLoader from "@/components/common/CommonLoader.vue";
import NoResults from "@/components/NoResults.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import { showUsers } from "@/services/api/userApi";
import { UserInterface } from "@/types/UserInterface";
import { computed, onMounted, ref, watch } from "vue";
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import { showDepartments } from "@/services/api/departmentApi";
import { showProjects } from "@/services/api/projectApi";
import { leadNames, showDataUser } from "@/composables/userActions";
import { useRoute } from "vue-router";

const teams = ref([]);
const searchText = ref("");
const noResultsShow = ref(false);
const noDataShow = ref(false);
const departmentNames = ref();
const projectNames = ref();
const projectValue = ref([]);
const managerValue = ref([]);
const departmentValue = ref([]);
const filterUse = ref(false);
const isLoader = ref(false);
const filter = ref("");
const route = useRoute();
const dropdownStates = ref({
  project: { isOpen: false },
  manager: { isOpen: false },
  department: { isOpen: false },
});

const processUsersData = computed(() => {
  return teams.value;
});
const toggleDropdown = (dropdownName: string) => {
  Object.keys(dropdownStates.value).forEach((name) => {
    if (name !== dropdownName) {
      dropdownStates.value[name].isOpen = false;
    }
  });
  dropdownStates.value[dropdownName].isOpen =
    !dropdownStates.value[dropdownName].isOpen;
};
watch(
  [
    () => searchText.value,
    () => departmentValue.value,
    () => managerValue.value,
    () => projectValue.value,
  ],
  ([searchTextValue, departmentItem, managerItem, projectItem]) => {
    const filters = [];

    if (searchTextValue) {
      filters.push(`filters[username][$contains]=${searchTextValue}`);
    }

    if (projectItem && projectValue.value.length) {
      filters.push(
        `filters[$and][${projectValue.value[0].id}][project_members][title][$eq]=${projectValue.value[0].name}`
      );
    }

    if (departmentItem && departmentValue.value.length) {
      filters.push(
        `filters[$and][${departmentValue.value[0].id}][department][name][$eq]=${departmentValue.value[0].name}`
      );
    }

    if (managerItem && managerValue.value.length) {
      filters.push(
        `filters[$and][${managerValue.value[0].id}][user_managers][username][$eq]=${managerValue.value[0].name}`
      );
    }

    if (filters.length > 0) {
      noResultsShow.value = false;
      filterUse.value = true;
    } else {
      noResultsShow.value = true;
      filterUse.value = false;
    }

    filter.value = filters.length ? `${filters.join("&")}` : "";
    fetchUsers(filter.value);
  },
  { deep: true }
);

const fetchUsers = (filters: string) => {
  isLoader.value = true;
  return new Promise(() => {
    showUsers(`${filter.value}`).then(({ data }) => {
      teams.value = data.map((item: UserInterface) => item);
      isLoader.value = false;
      if (!teams.value.length && filterUse.value) {
        noResultsShow.value = true;
      } else if (!teams.value.length) {
        noDataShow.value = true;
      }
    });
  });
};

const reset = () => {
  searchText.value = "";
  projectValue.value = [];
  managerValue.value = [];
  departmentValue.value = [];
  noResultsShow.value = false;
};

const selectedItem = (item: { name: string; logo: string; id: number }) => {
  if (dropdownStates.value.project.isOpen) {
    projectValue.value.push(item);
    dropdownStates.value.project.isOpen = !dropdownStates.value.project.isOpen;
  }
  if (dropdownStates.value.manager.isOpen) {
    managerValue.value.push(item);
    dropdownStates.value.manager.isOpen = false;
  }
  if (dropdownStates.value.department.isOpen) {
    departmentValue.value.push(item);
    dropdownStates.value.department.isOpen =
      !dropdownStates.value.department.isOpen;
  }
};

const deleteProject = (type: string) => {
  if (type === "project") {
    projectValue.value = [];
    showUsers("").then(({ data }) => {
      teams.value = data.map((item: UserInterface) => item);
    });
  } else if (type === "manager") {
    managerValue.value = [];
    showUsers("").then(({ data }) => {
      teams.value = data.map((item: UserInterface) => item);
    });
  } else {
    departmentValue.value = [];
    showUsers("").then(({ data }) => {
      teams.value = data.map((item: UserInterface) => item);
    });
  }
};
onMounted(() => {
  fetchUsers("");
  showDataUser();
  showDepartments().then(({ data }) => {
    departmentNames.value = data.data.map(
      (item: {
        name: {
          attributes: {
            name: string;
          };
          id: number;
        };
      }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
  });

  showProjects("").then(({ data }) => {
    projectNames.value = data.data.map(
      (item: {
        name: {
          attributes: {
            name: string;
            logo: {
              name: string;
            };
          };
          id: number;
        };
      }) => ({
        name: item.attributes.title,
        id: item.id,
        logo: item.attributes.logo,
      })
    );
  });
});
</script>

<style lang="scss">
.teams {
  background: var(--background);
  height: 100vh;
  padding: 28px 144px 125px;
  @include media_tablet {
    padding: 28px 20px;
    width: calc(100% - 40px);
  }
  @include media_mobile {
    padding: 12px 16px;
    width: calc(100% - 32px);
    top: 56px;
    position: absolute;
    height: calc(100vh - -139px);
  }

  &-block {
    max-width: 993px;
    margin: 0 auto;
  }

  .drop-down {
    &.teams-dropdown {
      top: 64px;
      @include media_mobile {
        top: 158px;
        left: 16px;
        position: fixed;
      }

      input {
        width: 240px;
        @include media_mobile {
          width: 343px;
        }
      }

      ul {
        width: 238px;
        @include media_mobile {
          width: 341px;
        }
      }

      i {
        &::before {
          background: var(--text);
        }
      }
    }
  }

  h1 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0 0 28px;
    @include media_mobile {
      display: none;
    }
  }

  form.position {
    .form-group {
      margin-bottom: 8px;
      @include media_mobile {
        margin-bottom: 6px;
      }
    }

    .form-icon {
      input {
        padding: 14px 16px 14px 44px;
        @include media_mobile {
          padding: 8px 8px 8px 26px;
          height: 34px;
          line-height: 18px;
        }
      }

      i.search {
        top: 14px;
        left: 16px;

        &::before {
          background: var(--text);
        }

        @include media_mobile {
          width: 13px;
          height: 13px;
          left: 8px;
          top: 11px;
        }
      }
    }
  }

  i.icon {
    &::before {
      background: var(--white);
    }
  }

  button.btn_icon {
    &::before {
      margin-right: 12px;
      @include media_mobile {
        margin-right: 6px;
      }
    }
  }

  &-block {
    &__button {
      display: flex;

      &.selected {
        @include media_mobile {
          overflow: auto;
        }
      }

      button {
        &.reset {
          padding: 12px 26px;
          margin-left: 8px;
          width: 91px;
          z-index: 3;
        }

        &.desktop {
          @include media_mobile {
            display: none;
          }
        }

        &.mobile {
          display: none;
          position: relative;
          @include media_mobile {
            display: block;
            padding: 9px 18px;
            width: 36px;
            margin-left: 6px;
          }

          i.icon.reset {
            top: 9px;
            left: 11px;
          }
        }
      }

      &-dropdown {
        position: relative;

        button {
          width: fit-content;
          position: relative;
          padding: 12px 16px;
          font-weight: 400;

          i.icon {
            top: 14px;
            left: 16px;
            @include media_mobile {
              width: 13px;
              height: 13px;
              top: 10px;
              left: 10px;
            }

            &.department {
              top: 15px;
              @include media_mobile {
                top: 11px;
              }
            }
          }

          &.selected {
            background: var(--accent);
            padding: 12px 34px 12px 16px;

            img {
              position: absolute;
              width: 20px;
              height: 20px;
              left: 16px;
              top: 14px;
              border-radius: 11px;
            }

            @include media_mobile {
              padding: 9px 26px 9px 10px;
              img {
                width: 13px;
                height: 13px;
                left: 10px;
                top: 11px;
              }
            }
          }

          i.close {
            right: 16px;
            left: inherit;
            width: 12px;
            height: 12px;
            top: 19px;
            @include media_mobile {
              width: 8px;
              height: 8px;
              right: 12px;
              top: 13px;
            }
          }
        }

        &:nth-child(2) {
          margin: 0 8px;
          @include media_mobile {
            margin: 0 6px;
          }
        }
      }
    }
  }

  .box-container {
    align-items: center;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 36px auto 0;
    @include media_tablet {
      margin: 26px auto 0;
    }
    @include media_mobile {
      margin-top: 16px;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  .box-item {
    position: relative;
    -webkit-backface-visibility: hidden;
    max-width: 100%;
    @include media_mobile {
      width: 49%;
      &:last-of-type {
        margin-bottom: 69px;
      }
    }
  }

  .flip-box {
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    perspective: 1000px;
    -webkit-perspective: 1000px;
    width: 157px;
    text-decoration: none;
    @include media_tablet {
      width: 174px;
    }
    @include media_mobile {
      width: 100%;
    }
  }

  .flip-box-front,
  .flip-box-back {
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    min-height: 157px;
    background: var(--white);
    -ms-transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    -webkit-transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    padding: 12px 6px;
    @include media_tablet {
      width: 174px;
    }
    @include media_mobile {
      width: 100%;
      padding: 6px;
      min-height: 142px;
    }
  }

  .flip-box-front {
    -ms-transform: rotateY(0deg);
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
    -webkit-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    width: 157px;
    max-height: 184px;
    box-sizing: border-box;
    @include media_tablet {
      width: 174px;
    }
    @include media_mobile {
      width: 100%;
    }

    img {
      width: 90px;
      height: 90px;
      border-radius: 45px;
      margin-bottom: 10px;
      @include media_mobile {
        width: 64px;
        height: 64px;
        margin-bottom: 8px;
      }
    }
  }

  .flip-box:hover .flip-box-front {
    -ms-transform: rotateY(-180deg);
    -webkit-transform: rotateY(-180deg);
    transform: rotateY(-180deg);
    -webkit-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .flip-box-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 157px;
    min-height: 184px;
    background: var(--secondary);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -ms-transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    transform: rotateY(180deg);
    -webkit-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
    @include media_tablet {
      width: 174px;
    }
    @include media_mobile {
      width: 100%;
      min-height: 142px;
    }

    .flip-box-user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include media_mobile {
        margin-bottom: 19px;
      }

      h4 {
        margin: 0;
        @include font(10px, 500, 14px, var(--text));
      }

      h6 {
        margin: 2px 0;
        @include font(6px, 400, 8px, var(--text));
      }

      p {
        @include font(8px, 400, 10px, var(--text));
      }

      img {
        width: 28px;
        height: 28px;
        border-radius: 32px;
      }
    }

    .flip-box-desc {
      h5 {
        @include font(8px, 500, 12px, var(--text));
        margin: 0 0 6px 0;
        display: flex;
        align-items: center;

        &:last-of-type {
          margin: 0;
        }

        &:nth-child(2) {
          height: 15px;
        }

        @include media_mobile {
          margin: 0 0 3px 0;
        }

        img {
          width: 15px;
          height: 15px;
          margin: 0 0 0 8px;
        }

        span {
          font-weight: 400;
          margin-left: 8px;
        }
      }
    }
  }

  .flip-box:hover .flip-box-back {
    -ms-transform: rotateY(0deg);
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
    -webkit-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .flip-box .inner {
    position: absolute;
    left: 0;
    width: 100%;
    padding: 60px;
    outline: 1px solid transparent;
    -webkit-perspective: inherit;
    perspective: inherit;
    z-index: 2;

    transform: translateY(-50%) translateZ(60px) scale(0.94);
    -webkit-transform: translateY(-50%) translateZ(60px) scale(0.94);
    -ms-transform: translateY(-50%) translateZ(60px) scale(0.94);
    top: 50%;
  }

  h3 {
    margin: 0 0 2px;
    @include font(16px, 500, 28px, var(--text));
    @include media_mobile {
      font-size: 12px;
      line-height: 18px;
      margin: 0;
    }
  }

  .flip-box p {
    margin: 0;
    @include font(10px, 400, 14px, var(--text));
    @include media_mobile {
      font-size: 8px;
      line-height: 12px;
      margin: 0;
    }
  }

  .flip-box-img {
    margin-top: 25px;
  }

  .flip-box-button {
    background-color: transparent;
    border: 2px solid #fff;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    margin-top: 25px;
    padding: 15px 20px;
    text-transform: uppercase;
  }
}
</style>

<template lang="pug">
.teams 
  h1 People
  form.position
    .form-group.search
      .form-icon 
        input(v-model="searchText", placeholder="Search teams")
        i.icon.search
  .teams-block__button(:class="{ selected: projectValue.length }")
    .teams-block__button-dropdown
      common-button.btn_primary.btn_icon(
        @click="toggleDropdown('project')",
        :class="{ selected: projectValue.length }"
      ) {{ projectValue.length ? projectValue[0].name : "Project" }}
        i.icon.projects(v-if="!projectValue.length")
        img(v-else, :src="JSON.parse(projectValue[0].logo.name)", alt="avatar")
        i.icon.close(
          v-if="projectValue.length",
          @click="deleteProject('project')"
        )
      dropdown-component.teams-dropdown(
        :isOpen="dropdownStates.project.isOpen",
        :data="projectNames",
        @selectedItem="selectedItem",
        :iconHere="true",
        :type="'lead'"
      )
    .teams-block__button-dropdown
      common-button.btn_primary.btn_icon(
        @click="toggleDropdown('manager')",
        :class="{ selected: managerValue.length }"
      ) {{ managerValue.length ? managerValue[0].name : "Manager" }}
        i.icon.member(v-if="!managerValue.logo")
        img(v-else, :src="JSON.parse(managerValue[0].logo.name)", alt="avatar")
        i.icon.close(
          v-if="managerValue.length",
          @click="deleteProject('manager')"
        )
      dropdown-component.teams-dropdown(
        :isOpen="dropdownStates.manager.isOpen",
        :data="leadNames",
        @selectedItem="selectedItem",
        :iconHere="true",
        :type="'lead'"
      )
    .teams-block__button-dropdown
      common-button.btn_primary.btn_icon(
        @click="toggleDropdown('department')",
        :class="{ selected: departmentValue.length }"
      ) {{ departmentValue.length ? departmentValue[0].name : "Department" }}
        i.icon.department
        i.icon.close(
          v-if="departmentValue.length",
          @click="deleteProject('department')"
        )
      dropdown-component.teams-dropdown(
        :isOpen="dropdownStates.department.isOpen",
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
      i.icon.reset-icon
  .box-container
    .box-item(v-for="(lead, index) in computedFilteredTeams", :key="index")
      .flip-box
        .flip-box-front
          img.avatar(
            v-if="lead.logo",
            :src="JSON.parse(lead.logo.name)",
            alt="avatar"
          )
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
            h5 Manager:
              img(
                v-if="lead.manager.logo",
                :src="JSON.parse(lead.manager.logo.name)",
                alt="avatar"
              )
              span {{ lead.manager.username }}
            h5 Projects:
              span {{ lead.project.length }} +
            h5 Assign tasks:
              span {{ lead.tasks.length }} +
            h5 Hour spent:
              span 40h
    no-results(v-if="noResultsShow", @reset="reset")
  common-loader(v-if="isLoader")
</template>

<script setup lang="ts">
import CommonLoader from "@/components/common/CommonLoader.vue";
import NoResults from "@/components/NoResults.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import { showUsers } from "@/services/api/userApi";
import { UserInterface } from "@/types/UserInterface";
import { computed, ref, watchEffect, onMounted } from "vue";
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import { showDepartments } from "@/services/api/departmentApi";
import { showProjects } from "@/services/api/projectApi";
const leadNames = ref();
const teams = ref([]);
const searchText = ref("");
const noResultsShow = ref(false);
const departmentNames = ref();
const projectNames = ref();
const projectValue = ref([]);
const managerValue = ref([]);
const departmentValue = ref([]);
const isLoader = ref(false);
const dropdownStates = ref({
  project: { isOpen: false },
  manager: { isOpen: false },
  department: { isOpen: false },
});

const computedFilteredTeams = computed(() => {
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

const fetchAndSetProjects = () => {
  const searchTerm = searchText.value.toLowerCase();

  if (searchTerm) {
    teams.value = teams.value.filter((item: { username: string }) => {
      const title = item.username.toLowerCase();
      return title.includes(searchTerm);
    });
    if (!teams.value.length) {
      noResultsShow.value = true;
    } else {
      noResultsShow.value = false;
    }
  } else if (departmentValue.value.length) {
    isLoader.value = true;
    showUsers(`filters[department]=${departmentValue.value[0].id}`).then(
      (response) => {
        teams.value = teams.value = response.data.map(
          (team: UserInterface) => team
        );
        isLoader.value = false;
      }
    );
  } else if (projectValue.value.length) {
    isLoader.value = true;
    showUsers(`filters[project]=${projectValue.value[0].id}`).then(
      (response) => {
        teams.value = teams.value = response.data.map(
          (team: UserInterface) => team
        );
        isLoader.value = false;
      }
    );
  } else if (managerValue.value.length) {
    isLoader.value = true;
    showUsers(`filters[manager]=${managerValue.value[0].id}`).then(
      (response) => {
        teams.value = teams.value = response.data.map(
          (team: UserInterface) => team
        );
        isLoader.value = false;
      }
    );
  } else if (searchTerm === "") {
    showUsers("").then(({ data }) => {
      teams.value = data.map((item: UserInterface) => item);
    });
    noResultsShow.value = false;
  } else {
    return teams.value;
  }
};

watchEffect(() => {
  fetchAndSetProjects();
});

const reset = () => {
  searchText.value = "";
  projectValue.value = [];
  managerValue.value = [];
  departmentValue.value = [];
  noResultsShow.value = false;
  showUsers("").then(({ data }) => {
    teams.value = data.map((item: UserInterface) => item);
  });
};

const selectedItem = (item: { name: string; logo: string; id: number }) => {
  if (dropdownStates.value.project.isOpen) {
    projectValue.value.push(item);
    const index = projectNames.value.findIndex(
      (project: string) => project.id === item.id
    );
    if (index !== -1) {
      projectNames.value.splice(index, 1);
    }
    dropdownStates.value.project.isOpen = !dropdownStates.value.project.isOpen;
  } else if (dropdownStates.value.manager.isOpen) {
    managerValue.value.push(item);
    dropdownStates.value.manager.isOpen = !dropdownStates.value.manager.isOpen;
  } else {
    departmentValue.value.push(item);
    const index = departmentNames.value.findIndex(
      (project: string) => project.id === item.id
    );
    if (index !== -1) {
      departmentNames.value.splice(index, 1);
    }
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
  isLoader.value = true;
  showUsers("").then(({ data }) => {
    teams.value = data.map((item: UserInterface) => item);
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
    isLoader.value = false;
  });

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
  width: calc(100% - 288px);
  padding: 28px 144px 125px;
  @include media_tablet {
    padding: 28px 20px;
    width: calc(100% - 40px);
  }
  @include media_tablet {
    padding: 12px 16px;
    width: calc(100% - 32px);
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
        overflow: auto;
      }
      button {
        &.reset {
          padding: 12px 26px;
          margin-left: 8px;
          width: 91px;
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
          i.icon.reset-icon {
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
          }
          &.selected {
            background: var(--accent);
            padding: 12px 32px 12px 16px;
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
    gap: 10px;
    width: 100%;
    margin-top: 40px;
    @include media_tablet {
      margin-top: 26px;
    }
    @include media_mobile {
      margin-top: 16px;
    }
  }

  .box-item {
    position: relative;
    -webkit-backface-visibility: hidden;
    max-width: 100%;
  }

  .flip-box {
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    perspective: 1000px;
    -webkit-perspective: 1000px;
    width: 157px;
    @include media_tablet {
      width: 174px;
    }
    @include media_mobile {
      width: 168px;
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
      width: 168px;
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
    box-sizing: border-box;
    @include media_tablet {
      width: 174px;
    }
    @include media_mobile {
      width: 168px;
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
    background: var(--secondary);
    box-sizing: border-box;

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
      width: 168px;
    }
    .flip-box-user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 37px;
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

<template lang="pug">
.work
  h2 Your work
  .recent
    .recent--text
      h3 Recent projects
      router-link(:to="`/dashboard/projects`") View all projects
    common-loader.work-block(v-if="isLoaderProjects")
    no-results(
      v-if="!projectsArray.length && !isLoaderProjects",
      :no-work-project="true"
    )
    .recent-box(v-else)
      .recent-blocks(
        v-for="(project, index) in projectsArray.slice(0, 4)",
        :key="index"
      )
        router-link.recent-block(
          :to="{ name: 'boardItem', params: { projectId: project.id, key: project.attributes.key } }"
        )
          .block--left
            img(:src="JSON.parse(project.attributes.logo.name)", alt="avatar")
          .block--right
            h4 {{ project.attributes.title }}
            h5 Quick links
            router-link.text(
              :to="{ name: 'projectsIssues', params: { key: project.attributes.key, projectId: project.id }, query: { 'filters[$and][0][status][name][$eq]': 'To%20Do' } }"
            )
              h5 My open issues
              p(v-if="tasksToDo.length > 0") {{ tasksToDo.length }}
            router-link.text(
              :to="{ name: 'projectsIssues', params: { key: project.attributes.key, projectId: project.id }, query: { 'filters[$and][0][status][name][$eq]': 'Done' } }"
            )
              h5 Done issues
              p(v-if="tasksDone.length > 0") {{ tasksDone.length }}
            router-link.text(
              :to="{ name: 'teams', query: { 'filters[$and][0][project_members][key][$eq]': project.attributes.key } }"
            )
              h5 Members
              p(v-if="project.attributes.members.data.length > 0") {{ project.attributes.members.data.length }}
  .tabs
    button(
      v-for="(tab, index) in tabs",
      :key="index",
      :class="{ active: activeTab === index }",
      @click="selectTab(index)"
    ) {{ tab.label }}
  .issues(v-if="activeTab === 0 && !isLoaderTasks")
    .issues-block(v-for="item in tasksWorked", :key="item")
      .block--left
        .type(v-for="t in item.attributes.type", :key="t")
          i.icon(:class="getTaskTypeName(t.attributes.name)")
        .text-block
          p {{ item.attributes.title }}
          .text
            p {{ item.attributes.key }}
            i.icon.dot
            p {{ item.attributes.type.data.attributes.name }}
            i.icon.dot
            p {{ item.attributes.dueDate }}
            i.icon.dot
            p {{ item.attributes.description }}
      .img-block.tablet
        .img(
          v-for="(i, index) in item.attributes.members.data.slice(0, 5)",
          :key="index"
        )
          router-link(:to="{ name: 'teamsUser', params: { id: i.id } }")
            img.user(
              v-if="i.attributes.image",
              :src="JSON.parse(i.attributes.image.name)"
            )
            img.user(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        p.count(v-if="item.attributes.members.data.length >= 5") +{{ item.attributes.members.data.length - 5 }}
      .img-block.mobile
        .img(
          v-for="(i, index) in item.attributes.members.data.slice(0, 2)",
          :key="index"
        )
          router-link(:to="{ name: 'teamsUser', params: { id: i.id } }")
            img.user(
              v-if="i.attributes.image",
              :src="JSON.parse(i.attributes.image.name)"
            )
            img.user(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        p.count(v-if="item.attributes.members.data.length >= 2") +{{ item.attributes.members.data.length - 2 }}
  .issues(v-if="activeTab === 1 && !isLoaderTasks")
    .issues-block(v-for="item in tasksAssigned", :key="item")
      .block--left
        .type(v-for="t in item.attributes.type", :key="t")
          i.icon(:class="getTaskTypeName(t.attributes.name)")
        .text-block
          p {{ item.attributes.title }}
          .text
            p {{ item.attributes.key }}
            i.icon.dot
            p {{ item.attributes.project.data.attributes.title }}
            i.icon.dot
            p {{ item.attributes.dueDate }}
            i.icon.dot
            p {{ item.attributes.description }}
      .img-block
        .type(v-for="t in item.attributes.type", :key="t")
          p {{ t.attributes.name }}
  common-loader(v-if="isLoaderTasks")
  no-results(
    v-if="(!tasksAssigned.length && !isLoaderTasks) || (!tasksWorked.length && !isLoaderTasks)",
    :no-work-project="true"
  )
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { showProjects } from "@/services/api/projectApi";
import { useUserStore } from "@/store/user";
import { showTasks } from "@/services/api/tasksApi";
import { ResTasks } from "@/types/tasksApiInterface";
import CommonLoader from "@/components/common/CommonLoader.vue";
import NoResults from "@/components/NoResults.vue";
import { getTaskTypeName } from "@/composables/projectsAction";

const userStore = useUserStore();
const projectsArray = ref([]);
const taskDone = ref([]);
const tasksToDo = ref([]);
const activeTab = ref(0);
const tabs = ref([
  { label: "Worked on" },
  { label: "Assigned to me" },
  { label: "Starred" },
]);
const tasksWorked = ref([]);
const tasksAssigned = ref([]);
const tasksDone = ref([]);
const isLoaderProjects = ref(false);
const isLoaderTasks = ref(false);
const fullName = computed(() => {
  const username = userStore.user.username;
  return username;
});
const selectTab = (index: number) => {
  activeTab.value = index;
  if (index === 1) {
    isLoaderTasks.value = true;
    showTasks(
      `&filters[$and][0][status][name][$ne]=Archive$&sort=updatedAt`
    ).then((response) => {
      isLoaderTasks.value = false;
      tasksAssigned.value = response.data.data.filter((task: ResTasks) => {
        isLoaderTasks.value = false;
        return (
          task.attributes.asignee.data.attributes.username === fullName.value
        );
      });
    });
  } else if (index === 0) {
    isLoaderTasks.value = true;
    showTasks(
      `&filters[$and][0][status][name][$ne]=Archive$&sort=updatedAt`
    ).then((response) => {
      isLoaderTasks.value = false;
      tasksWorked.value = response.data.data.filter((task: ResTasks) => {
        return task.attributes.members.data.some(
          (item: any) => item.attributes.username === fullName.value
        );
      });
    });
  }
};

onMounted(() => {
  isLoaderProjects.value = true;
  showProjects("").then(({ data }) => {
    projectsArray.value = data.data.filter((project: any) =>
      project.attributes.members.data.some(
        (item: any) => item.attributes.username === fullName.value
      )
    );
    isLoaderProjects.value = false;
  });
  showTasks(`&filters[$and][0][status][name][$eq]=Done&sort=updatedAt`).then(
    (response) => {
      tasksDone.value = response.data.data.map((task: ResTasks) => task);
    }
  );
  showTasks(`&filters[$and][0][status][name][$eq]=To%20Do&sort=updatedAt`).then(
    (response) => {
      tasksToDo.value = response.data.data.map((task: ResTasks) => task);
    }
  );
  isLoaderTasks.value = true;
  showTasks(
    `&filters[$and][0][status][name][$ne]=Archive$&sort=updatedAt`
  ).then((response) => {
    isLoaderTasks.value = false;
    tasksWorked.value = response.data.data.filter((task: ResTasks) => {
      return task.attributes.members.data.some(
        (item: any) => item.attributes.username === fullName.value
      );
    });
    tasksAssigned.value = response.data.data.filter((task: ResTasks) => {
      isLoaderTasks.value = false;
      return (
        task.attributes.asignee.data.attributes.username === fullName.value
      );
    });
  });
});
</script>

<style lang="scss" scoped>
.work {
  background: var(--background);
  padding: 108px 40px;
  @include media_tablet {
    padding: 108px 20px;
  }
  @include media_mobile {
    padding: 56px 0;
    overflow: auto;
    height: calc(100vh - 168px);
  }

  h2 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0 0 28px;
    @include media_mobile {
      display: none;
    }
  }

  .issues {
    height: 318px;
    overflow: auto;
    @include media_mobile {
      margin-top: 12px;
      padding: 0 16px;
    }
  }

  .issues-block {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    margin-bottom: 6px;
    height: 48px;
    box-sizing: border-box;

    &:hover {
      background: var(--secondary);
      border-radius: 4px;
    }

    @include media_mobile {
      padding: 4px;
      height: 44px;
    }

    .block--left {
      display: flex;
      align-items: center;
      gap: 16px;
      @include media_mobile {
        gap: 8px;
      }
    }

    .img-block {
      display: flex;
      align-items: center;

      &.mobile {
        display: none;
      }

      @include media_mobile {
        &.mobile {
          display: flex;
        }
        &.tablet {
          display: none;
        }
      }

      p {
        margin: 0;
        @include font(12px, 500, 16px, var(--text));
      }

      .count {
        border-radius: 24px;
        border: 1px solid var(--primary);
        background: lightgray -8.173px 0.093px / 156.029% 103.496% no-repeat;
        width: 32px;
        height: 32px;
        z-index: 1;
        position: relative;
        margin: -3px 7px 0 -10px;
        background: var(--background);
        @include font(14px, 500, 20px, var(--accent));
        display: flex;
        align-items: center;
        justify-content: center;
        @include media_mobile {
          width: 24px;
          height: 24px;
          font-size: 10px;
          line-height: 16px;
          margin: -3px 0 0 -10px;
        }
      }

      img.user {
        border-radius: 24px;
        border: 1px solid var(--primary);
        background: lightgray -8.173px 0.093px / 156.029% 103.496% no-repeat;
        width: 32px;
        height: 32px;
        z-index: 1;
        position: relative;
        margin: 0 1px 0 -6px;
        @include media_mobile {
          width: 24px;
          height: 24px;
        }
      }
    }

    .type {
      i {
        position: relative;
        width: 26px;
        height: 26px;
        @include media_mobile {
          width: 20px;
          height: 20px;
        }
      }
    }

    .text-block {
      p {
        margin: 0;
        @include font(16px, 500, 24px, var(--text));
      }

      .text {
        display: flex;
        align-items: center;

        p {
          @include font(8px, 400, 12px, var(--text));
        }

        i.icon.dot {
          position: relative;
          width: 4px;
          height: 3px;
          margin: 3px;
        }
      }
    }
  }

  .recent {
    border-top: 1px solid var(--primary);
    display: flex;
    flex-direction: column;
    @include media_mobile {
      border: none;
      padding: 0 0 0 16px;
    }

    &-box {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      @include media_mobile {
        gap: 8px;
      }
    }

    &--text {
      display: flex;
      align-items: center;
      justify-content: space-between;

      a {
        @include font(16px, 500, 24px, var(--notify_info));
        text-decoration: none;
        @include media_mobile {
          margin-right: 16px;
        }
      }
    }

    h3 {
      @include font(20px, 500, 26px, var(--text));
      margin: 16px 0 20px;
      @include media_mobile {
        margin: 16px 0;
      }
    }

    &-blocks {
      display: flex;
      margin-bottom: 52px;
      @include media_tablet {
        margin-bottom: 12px;
      }
      @include media_mobile {
        margin-bottom: 6px;
      }

      .recent-block {
        box-shadow: 0px 4px 16px 0px rgba(61, 55, 52, 0.08),
          0px 2px 4px 0px rgba(61, 55, 52, 0.04),
          0px 0px 2px 0px rgba(61, 55, 52, 0.16);
        display: flex;
        text-decoration: none;
      }

      .block--left {
        width: 40px;
        height: 206px;
        border-radius: 4px 0px 0px 4px;
        background: var(--primary_border);
        position: relative;
        @include media_mobile {
          width: 32px;
          height: 166px;
        }

        img {
          position: absolute;
          top: 21px;
          left: 23px;
          width: 34px;
          height: 34px;
          border-radius: 2px;
          @include media_mobile {
            width: 24px;
            height: 24px;
            top: 12px;
            left: 15px;
          }
        }
      }

      .block--right {
        width: 220px;
        height: 206px;
        padding: 20px 24px 0px 24px;
        border-radius: 0 4px 4px 0;
        background: var(--white);
        box-sizing: border-box;

        @include media_mobile {
          width: 178px;
          height: 166px;
          padding: 12px 16px;
        }

        h4 {
          margin: 6px 0 0;
          @include font(16px, 500, 24px, var(--text));
          @include media_mobile {
            margin: 0;
          }
        }

        h5 {
          margin: 16px 0 10px;
          @include font(14px, 500, 20px, var(--placeholder));
          text-transform: uppercase;
          text-decoration: none;
          @include media_mobile {
            font-size: 12px;
            line-height: 16px;
            margin: 10px 0;
          }
        }

        .text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;

          h5 {
            @include font(14px, 400, 20px, var(--text));
            margin: 0;
            text-decoration: none;
            text-transform: math-auto;
            @include media_mobile {
              font-size: 12px;
              line-height: 16px;
            }
          }

          p {
            border-radius: 10px;
            background: var(--accent);
            padding: 0px 12px;
            @include font(10px, 400, 16px, var(--white));
            margin: 0;
          }
        }
      }
    }
  }

  .tabs {
    border-bottom: 2px solid var(--primary);
    margin-bottom: 20px;
    gap: 26px;
    display: flex;

    @include media_mobile {
      justify-content: space-between;
      margin: 0 16px;
      height: 40px;
    }

    button {
      padding: 14px 4px;
      background: transparent;
      border: none;
      @include font(20px, 500, 26px, var(--text));
      @include media_mobile {
        padding: 10px 4px;
        font-size: 14px;
        line-height: 20px;
      }

      &.active {
        color: var(--accent);
        border-bottom: 2px solid var(--accent);
      }
    }
  }
}
</style>

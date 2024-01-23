<template lang="pug">
.menu(v-if="isOpen")
  div
    h2 {{ title }}
    div(v-if="project")
      router-link.menu-project(
        v-for="(project, index) in projects.slice(0, 5)",
        :key="index",
        :to="{ name: 'projectsIssues', params: { key: project.attributes.key, projectId: project.id } }"
      )
        img.logo(
          v-if="project.attributes.logo !== null || project.attributes.logo",
          :src="JSON.parse(project.attributes.logo.name)",
          alt="name"
        )
        div
          h3 {{ project.attributes.title }} ({{ project.attributes.key }})
          p {{ project.attributes.tags.data[0].attributes.name }}
        i.icon.unchecked
        i.icon.star
    .work(v-if="work")
      h3 In Progress
      .work--to-do(v-for="task in tasksInProgress.slice(0, 2)", :key="task")
        .type(v-for="t in task.attributes.type", :key="t")
          i.icon(:class="getTaskTypeName(t.attributes.name)")
        .text-block
          p {{ task.attributes.title }}
          .text
            p {{ task.attributes.key }}
            i.icon.dot
            div(v-for="member in task.attributes.members", :key="member")
              div(v-for="m in member", :key="m")
                p(
                  v-if="m.attributes.username === fullName && member.length === 1"
                ) You have all worked on this
                p(
                  v-else-if="m.attributes.username === fullName && member.length > 1"
                ) You, {{ member[0].attributes.username }}, and {{ member.length - 2 }} others have all worked on this
      h3.do To Do
      .work--to-do(v-for="task in tasksToDo.slice(0, 5)", :key="task")
        .type(v-for="t in task.attributes.type", :key="t")
          i.icon(:class="getTaskTypeName(t.attributes.name)")
        .text-block
          p {{ task.attributes.title }}
          .text
            p {{ task.attributes.key }}
            i.icon.dot
            div(v-for="member in task.attributes.members", :key="member")
              div(v-for="m in member", :key="m")
                p(
                  v-if="m.attributes.username === fullName && member.length === 1"
                ) You have all worked on this
                p(
                  v-else-if="m.attributes.username === fullName && member.length > 1"
                ) You, {{ member[0].attributes.username }}, and {{ member.length - 2 }} others have all worked on this

    div(v-else)
      router-link.menu-project(
        v-for="(project, index) in leadNames.slice(0, 5)",
        :key="index",
        :to="{ name: 'teamsUser', params: { id: project.id } }"
      )
        img.logo(
          v-if="project.logo !== null || project.logo",
          :src="JSON.parse(project.logo.name)",
          alt="name"
        )
        img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        div
          h3 {{ project.name }}
    h2(v-if="subtitle") {{ subtitle }}
  div(v-if="project && !projects.length")
    no-results.menu-no(:no-data="true")
  .link(:class="{ workLink: work }")
    router-link(v-if="work", :to="`/dashboard/work`") Go to Your Work page
    router-link(v-else, :to="`/dashboard/${type}`") View all {{ type }}
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import NoResults from "../NoResults.vue";
import { leadNames } from "../../composables/userActions";
import { getTaskTypeName } from "@/composables/projectsAction";
import { showProjects } from "@/services/api/projectApi";
import { showTasks } from "@/services/api/tasksApi";
import { ResTasks } from "@/types/tasksApiInterface";
import { useUserStore } from "@/store/user";

const props = defineProps({
  type: { type: String },
  withIcon: { type: Boolean, default: false },
  isOpen: Boolean,
  title: String,
  subtitle: String,
  project: Boolean,
  work: Boolean,
});
const projects = ref([]);
const tasksToDo = ref([]);
const tasksInProgress = ref([]);
const totalProjects = ref();
const userStore = useUserStore();
const fullName = computed(() => {
  const username = userStore.user.username;
  return username;
});
onMounted(() => {
  showProjects("").then(({ data }) => {
    projects.value = data.data.map((project: any) => project);
    totalProjects.value = projects.value.length;
  });
  showTasks(
    `&filters[$and][0][status][name][$eq]=In%20Progress&sort=updatedAt`
  ).then((response) => {
    tasksInProgress.value = response.data.data.map((task: ResTasks) => task);
  });
  showTasks(`&filters[$and][0][status][name][$eq]=To%20Do&sort=updatedAt`).then(
    (response) => {
      tasksToDo.value = response.data.data.map((task: ResTasks) => task);
    }
  );
});
</script>

<style lang="scss" scoped>
.menu {
  left: 0;
  position: absolute;
  top: 55px;
  padding: 16px 0;
  background: var(--white);
  border-radius: 6px;
  box-sizing: border-box;
  min-width: 351px;
  z-index: 10;
  box-shadow: 0px 4px 8px rgba(61, 55, 52, 0.08);

  .work {
    padding: 0 16px;

    h3 {
      @include font(16px, 600, 20px, var(--text));
      padding: 6px 0;
      margin: 0;

      &.do {
        margin: 6px 0;
        padding: 6px 0 0 0;
      }
    }

    &--to-do {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;

      i.icon {
        position: relative;
      }

      .text-block {
        display: flex;
        flex-direction: column;

        p {
          @include font(16px, 500, 24px, var(--text));
          margin: 0;
        }

        .text {
          display: flex;

          p {
            @include font(8px, 400, 12px, var(--text));
            margin: 0;
          }

          i.icon.dot {
            position: relative;
            width: 4px;
            height: 3px;
            margin: 5px 3px 0;
          }
        }
      }
    }
  }

  .link {
    margin-top: 16px;

    &.workLink {
      border-top: 1px solid var(--primary_border);
      margin: 6px 0 0 0;
      padding: 16px 0 0 0;
    }
  }

  a {
    @include font(16px, 500, 24px, var(--text));
    text-decoration: none;
    margin: 16px;

    &.menu-project {
      margin: 0;
    }
  }

  &-project {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    cursor: pointer;
    position: relative;

    &:last-of-type {
      border-bottom: 1px solid var(--primary);
      margin-bottom: 16px;
    }

    i.icon {
      right: 26px;

      &.unchecked {
        display: none;
      }

      &.star {
        display: none;

        &::before {
          background: var(--notify_warning);
        }
      }
    }

    &:hover {
      background: var(--white-shadow);

      i.icon.unchecked {
        display: block;
      }
    }

    &.active {
      i.icon.star {
        display: block;
      }
    }

    img {
      border-radius: 6px;
      width: 36px;
      height: 36px;
      margin-right: 16px;
    }

    div {
      h3 {
        @include font(14px, 500, 20px, var(--text));
        margin: 0 0 2px;
      }

      p {
        @include font(12px, 400, 18px, var(--text));
        margin: 0;
      }
    }
  }

  h2 {
    @include font(20px, 600, 28px, var(--text));
    margin: 0 0 6px;
    margin-left: 16px;
  }
}
</style>

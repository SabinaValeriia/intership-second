<template lang="pug">
.user(v-if="user.length") 
  div(v-for="(item, index) in user", :key="index")
    .user--bg
      .user--bg-block
        img.user--bg-icon(
          v-if="item.logo",
          :src="JSON.parse(item.logo.name)",
          alt="user"
        )
        .mobile-user
          h2 {{ item.name }}
          p {{ item.email }}

    .user--info
      .tablet 
        .user--info-left 
          .tablet-user
            h2 {{ item.name }}
            p {{ item.email }}
          .block
            h4 About
            .block-user
              img(
                v-if="item.logo",
                :src="JSON.parse(item.logo.name)",
                alt="user"
              ) 
              p {{ item.name }}
            .block-user
              i.icon.company
              p Frontend developer
            .block-user
              i.icon.department
              p {{ item.department.name }} dept
            .block-user
              i.icon.compass
              p Ukraine, Krop
            h4.distance Contact
            .block-user
              i.icon.case
              p {{ item.email }}
        .user--info-block
        .user--info-right
          h3 Worked on
          .block(v-if="item.tasks.length")
            .block-user(
              v-for="(task, index) in item.tasks.slice(0, 3)",
              :key="index"
            )
              div(v-for="(taskItem, index) in tasks", :key="index")
                i.icon(
                  v-if="taskItem.title === task.title",
                  :class="getTaskTypeName(taskItem.type.data.attributes.name)"
                )
              div
                .flex
                  h6 {{ task.title }}
                .flex(v-for="(p, index) in projects", :key="index") 
                  .flex.desc(v-if="p.key === item.projects[0].key")
                    p {{ p.title }}
                    i.icon.dot
                    p.members(
                      v-for="member in p.members.data.slice(0, 2)",
                      :key="member.id"
                    ) {{ member.attributes.username }}
                    span {{ p.members.data.length > 2 ? ", and 2 others all worked on this" : "" }}
          .block(v-else)
            no-results.user-results(
              :noData="'true'",
              :title="'There is no work to see here'",
              :desc="'Things Selected Name worked on in the last 90 days.'",
              :isButton="false"
            )
          h3 Places they work in
          .block(v-if="item.projects.length")
            .block-user(
              v-for="(project, index) in item.projects.slice(0, 5)",
              :key="index"
            )
              img(
                v-if="project.logo",
                :src="JSON.parse(project.logo.name)",
                alt="user"
              )
              p.project-item {{ project.title }} ({{ project.key }})
          .block(v-else)
            no-results.user-results(
              :noData="'true'",
              :title="'We don’t have places to show here yet'",
              :desc="'Selected Name hasn’t worked in any projects in the last 90 days.'",
              :isButton="false"
            )
.loader(v-else)
  .loader-user
    .loader-user--img
      i.icon.foto
  common-loader
</template>

<script setup lang="ts">
import { showUsers } from "@/services/api/userApi";
import { onMounted, ref } from "vue";
import CommonLoader from "@/components/common/CommonLoader.vue";
import NoResults from "@/components/NoResults.vue";
import { showProjects } from "@/services/api/projectApi";
import { useRoute } from "vue-router";
import { UserInterface } from "@/types/UserInterface";
import { showTasks } from "@/services/api/tasksApi";
import { getTaskTypeName } from "@/composables/projectsAction";
import { ShowTasks } from "@/types/tasksApiInterface";
const isLoader = ref(false);
const user = ref([]);
const foundUser = ref([]);
const projects = ref([]);
const tasks = ref([]);
const route = useRoute();
const idUser = Number(route.params.id);

onMounted(() => {
  isLoader.value = true;

  showUsers("").then(({ data }) => {
    foundUser.value = data.find((user: UserInterface) => user.id === idUser);

    if (foundUser.value) {
      user.value.push({
        name: foundUser.value.username,
        logo: foundUser.value.logo,
        id: foundUser.value.id,
        email: foundUser.value.email,
        department: foundUser.value.department,
        tasks: foundUser.value.tasks,
        projects: foundUser.value.projects,
        manager: foundUser.value.managerr,
      });
    }
    isLoader.value = false;
  });

  showProjects("").then(({ data }) => {
    projects.value = data.data.map((project: any) => project.attributes);
  });
  showTasks().then(({ data }) => {
    console.log(data);
    tasks.value = data.data.map((task: ShowTasks) => task.attributes);
    console.log(tasks.value);
  });
});
</script>

<style lang="scss" scoped>
.loader {
  background: var(--background);
  height: 100vh;
  &-user {
    height: 120px;
    background: var(--secondary);
    padding: 29px 0 0 184px;
    box-sizing: border-box;
    @include media_tablet {
      padding: 29px 0 0 20px;
    }
    @include media_mobile {
      height: 100px;
      padding: 20px 0;
    }
    &--img {
      border: 1px solid var(--white);
      border-radius: 75px;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary);
      @include media_mobile {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 84px;
        height: 84px;
      }
      i.foto {
        width: 40px;
        height: 32px;
        &::before {
          background: var(--white);
        }
      }
    }
  }
}

.user {
  overflow: hidden;
  &--bg {
    background: url("../assets/icons/bg_user.svg");
    height: 120px;
    box-sizing: border-box;
    padding: 29px 0 0 0;
    &-block {
      width: 924px;
      margin: 0 auto;
      @include media_mobile {
        width: 100%;
      }
    }
    @include media_tablet {
      padding: 29px 0 0 20px;
    }
    @include media_mobile {
      height: 100px;
      padding: 20px 0;
    }
    .mobile-user {
      display: none;
      @include media_mobile {
        background: var(--background);
        display: block;
        border-radius: 30px 30px 0 0;
        position: sticky;
        margin: 49px 0 0;
        width: 100%;
        z-index: 3;
        h2 {
          @include font(14px, 700, 20px, var(--text));
          margin: 0;
          text-align: center;
          padding: 48px 0 0 0;
        }
        p {
          @include font(10px, 400, 14px, var(--text));
          margin: 0;
          text-align: center;
        }
      }
    }
    &-icon {
      border: 1px solid var(--white);
      border-radius: 75px;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      @include media_mobile {
        width: 84px;
        height: 84px;
        position: absolute;
        left: 50%;
        top: 75px;
        transform: translateX(-50%);
        z-index: 4;
      }
    }
  }
  &--info {
    display: flex;
    justify-content: space-between;
    background: var(--background);
    height: 100vh;
    @include media_tablet {
      padding: 36px 20px;
    }
    @include media_mobile {
      overflow-y: auto;
      height: calc(100vh - 210px);
      padding: 0;
    }
    .tablet {
      display: flex;
      width: 924px;
      padding: 36px 0;
      margin: 0 auto;
      @include media_mobile {
        width: 100%;
        &-user {
          display: none;
        }
        flex-direction: column;
      }
    }
    &-block {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }
    &-left {
      margin-right: 38px;
      flex: 1;
      @include media_mobile {
        margin-right: 0;
        flex: none;
      }
      p {
        @include font(14px, 400, 20px, var(--text));
        margin: 0;
      }
      h2 {
        margin: 26px 0 10px;
        @include font(24px, 600, 28px, var(--text));
      }
      .block {
        border: 1px solid var(--secondary);
        border-radius: 4px;
        padding: 20px 10px;
        max-width: 300px;
        box-sizing: border-box;
        margin-top: 42px;
        @include media_tablet {
          padding: 20px 2px;
        }
        @include media_mobile {
          padding: 29px 12px 16px;
          border: none;
          max-width: 100%;
          margin-top: 0;
        }
        h4 {
          @include font(16px, 500, 24px, var(--text));
          margin: 0;
          padding: 0 16px 6px;
          @include media_mobile {
            padding: 0 0 6px;
          }
          &.distance {
            margin-top: 20px;
            @include media_mobile {
              margin-top: 16px;
            }
          }
        }
        &-user {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          @include media_mobile {
            padding: 8px 0;
          }
          img {
            width: 20px;
            height: 20px;
            border-radius: 11px;
          }
          p {
            margin: 0 0 0 12px;
            @include font(14px, 400, 20px, var(--text));
            @include media_mobile {
              margin: 0 0 0 8px;
            }
          }
          i {
            position: relative;
          }
        }
      }
    }
    &-right {
      flex: auto;
      @include media_mobile {
        padding: 0 12px;
      }
      h3 {
        @include font(20px, 600, 28px, var(--text));
        text-align: left;
        margin: 0 0 14px;
        @include media_mobile {
          margin: 0 0 6px 0;
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
        }
      }
      .block {
        padding: 20px 18px;
        max-width: 588px;
        box-sizing: border-box;
        border: 1px solid var(--secondary);
        border-radius: 4px;
        @include media_tablet {
          padding: 16px 10px;
        }
        @include media_mobile {
          border: none;
          padding: 0;
          max-width: 100%;
          &:last-of-type {
            padding-bottom: 34px;
          }
        }
        &:first-of-type {
          margin-bottom: 36px;
          @include media_mobile {
            margin-bottom: 16px;
          }
        }
        &-user {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          cursor: pointer;
          &:hover {
            background: var(--white);
            border-radius: 3px;
            p.project-item {
              color: var(--accent);
              border-bottom: 1px solid var(--accent);
            }
          }
          @include media_mobile {
            padding: 4px 0;
          }
          .flex {
            display: flex;
            align-items: center;
            .desc {
              margin-left: 12px;
            }
            h6 {
              margin: 0 0 0 10px;
              @include font(16px, 500, 24px, var(--text));
              @include media_mobile {
                margin: 0 0 0 8px;
                font-size: 14px;
                line-height: 20px;
              }
            }
            i.dot {
              width: 5px;
              height: 5px;
            }

            p {
              margin: 0;
              @include font(8px, 400, 12px, var(--text));
              &.members {
                margin-left: 2px;
              }
            }
            span {
              @include font(8px, 400, 12px, var(--text));
            }
          }
        }
        i {
          position: relative;
        }
        p {
          margin: 0 0 0 12px;
          @include font(14px, 400, 20px, var(--text));
        }
        img {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          @include media_mobile {
            width: 26px;
            height: 26px;
          }
        }
      }
    }
  }
}
</style>

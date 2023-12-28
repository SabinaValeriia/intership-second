<template lang="pug">
.board
  h3 {{ route.params.key }} board
  .project-name(v-for="item in project", :key="item")
  .board-panel
    form
      .form-group
        .form-icon
          input(v-model="searchText", placeholder="")
          i.icon.search
    .flex-block
      .mobile-block
        .assignee
          .loader-block--img(v-if="isLoader && !filterUse")
            .loader-logo
            .loader-logo
            .loader-logo
          .assignee-img(v-for="lead in leadNames", v-else, :key="lead")
            img.logo(
              v-if="lead.logo",
              :src="JSON.parse(lead.logo.name)",
              alt="name",
              :class="{ active: lead === userItem }",
              @click="selectUser(lead)"
            )
            img.logo(
              v-else,
              :src="require(`@/assets/icons/default_user.svg`)",
              :class="{ active: lead === userItem }",
              @click="selectUser(lead)"
            )
        .flex
          .dropdown-block
            common-button.btn-secondary-line.btn_arrow(
              :class="{ select: typeItem.length }",
              @click.prevent="toggleDropdown('typeTasks')"
            ) {{ typeItem.length > 0 ? `Type: ${typeItem[0].name}` : "Type" }}
              span.selected(v-if="typeItem.length > 1") + {{ typeItem.length - 1 }}
              i.icon.arrow(
                :class="{ active: dropdownStates.typeTasks.isOpen }"
              )
            dropdown-search(
              v-if="dropdownStates.typeTasks.isOpen",
              :is-open="dropdownStates.typeTasks.isOpen",
              :data="types",
              :checked-item="typeItem",
              :type="'checkbox'",
              :title="'Project types'",
              @selectedItem="selectedItem",
              @clear="clear",
              @allItem="selectAllType"
            )
      common-button.reset.btn-secondary.laptop(
        v-if="userItem || searchText || typeItem.length",
        @click.prevent="reset"
      ) Reset
      common-button.reset.btn-secondary.mobile(
        v-if="userItem || searchText || typeItem.length",
        @click.prevent="reset"
      )
        i.icon.reset
  .board-block
    .board-box.board-block--first
      h4 To do {{ countToDoTasks("To do") }}
      draggable.tablet(v-model="tasks", tag="ul", group="tasks", @end="log")
        template(#item="{ element: task }")
          li(v-if="task.attributes.status.data.attributes.name === 'To do'")
            router-link(:to="{ name: 'issuesItem', params: { id: task.id } }")
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
      ul.mobile(:class="{ disabled: dropdownStates.menu.isOpen }")
        div(v-for="task in tasks", :key="task")
          li(v-if="task.attributes.status.data.attributes.name === 'To do'")
            router-link(
              :to="{ name: 'issuesItem', params: { id: task.id } }",
              @click.stop
            )
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              button.menu(
                :class="{ active: openDropdownIndex === task.id }",
                @click.prevent="toggleClose(task.id)"
              )
                i.icon.menu
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
            dropdown-list.menu(
              v-if="openDropdownIndex === task.id",
              :filtered-data="menuToDo",
              :type="'menu'",
              :class-name="'name'",
              @selectedItem="selectedItem(task, $event)"
            )
    .board-box.board-block--second
      h4 In progress {{ countToDoTasks("In progress") }}
      draggable.tablet(
        v-model="tasks",
        tag="ul",
        group="tasks",
        @end="log($event)"
      )
        template(#item="{ element: task }")
          li(
            v-if="task.attributes.status.data.attributes.name === 'In progress'"
          )
            router-link(:to="{ name: 'issuesItem', params: { id: task.id } }")
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
      ul.mobile(:class="{ disabled: dropdownStates.menu.isOpen }")
        div(v-for="task in tasks", :key="task")
          li(
            v-if="task.attributes.status.data.attributes.name === 'In progress'"
          )
            router-link(
              :to="{ name: 'issuesItem', params: { id: task.id } }",
              @click.stop
            )
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              button.menu(
                :class="{ active: openDropdownIndex === task.id }",
                @click.prevent="toggleClose(task.id)"
              )
                i.icon.menu
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
            dropdown-list.menu(
              v-if="openDropdownIndex === task.id",
              :filtered-data="menu",
              :type="'menu'",
              :class-name="'name'",
              @selectedItem="selectedItem(task, $event)"
            )
    .board-box.board-block--third
      h4 Review {{ countToDoTasks("Review") }}
      draggable.tablet(v-model="tasks", tag="ul", group="tasks", @end="log")
        template(#item="{ element: task }")
          li(v-if="task.attributes.status.data.attributes.name === 'Review'")
            router-link(:to="{ name: 'issuesItem', params: { id: task.id } }")
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
      ul.mobile(:class="{ disabled: dropdownStates.menu.isOpen }")
        div(v-for="task in tasks", :key="task")
          li(v-if="task.attributes.status.data.attributes.name === 'Review'")
            router-link(
              :to="{ name: 'issuesItem', params: { id: task.id } }",
              @click.stop
            )
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              button.menu(
                :class="{ active: openDropdownIndex === task.id }",
                @click.prevent="toggleClose(task.id)"
              )
                i.icon.menu
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
            dropdown-list.menu(
              v-if="openDropdownIndex === task.id",
              :filtered-data="menu",
              :type="'menu'",
              :class-name="'name'",
              @selectedItem="selectedItem(task, $event)"
            )
    .board-box.board-block--fourth
      h4 Testing failed {{ countToDoTasks("Testing failed") }}
      draggable.tablet(v-model="tasks", tag="ul", group="tasks", @end="log")
        template(#item="{ element: task }")
          li(
            v-if="task.attributes.status.data.attributes.name === 'Testing failed'"
          )
            router-link(:to="{ name: 'issuesItem', params: { id: task.id } }")
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
      ul.mobile(:class="{ disabled: dropdownStates.menu.isOpen }")
        div(v-for="task in tasks", :key="task")
          li(
            v-if="task.attributes.status.data.attributes.name === 'Testing failed'"
          )
            router-link(
              :to="{ name: 'issuesItem', params: { id: task.id } }",
              @click.stop
            )
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              button.menu(
                :class="{ active: openDropdownIndex === task.id }",
                @click.prevent="toggleClose(task.id)"
              )
                i.icon.menu
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
            dropdown-list.menu(
              v-if="openDropdownIndex === task.id",
              :filtered-data="menu",
              :type="'menu'",
              :class-name="'name'",
              @selectedItem="selectedItem(task, $event)"
            )
    .board-box.board-block--fifth
      h4 Done {{ countToDoTasks("Done") }}
      draggable.tablet(v-model="tasks", tag="ul", group="tasks", @end="log")
        template(#item="{ element: task }")
          li(v-if="task.attributes.status.data.attributes.name === 'Done'")
            router-link(:to="{ name: 'issuesItem', params: { id: task.id } }")
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
      ul.mobile(:class="{ disabled: dropdownStates.menu.isOpen }")
        div(v-for="task in tasks", :key="task")
          li(v-if="task.attributes.status.data.attributes.name === 'Done'")
            router-link(
              :to="{ name: 'issuesItem', params: { id: task.id } }",
              @click.stop
            )
              i.icon(
                :class="getTaskTypeName(task.attributes.type.data.attributes.name)"
              )
              button.menu(
                :class="{ active: openDropdownIndex === task.id }",
                @click.prevent="toggleClose(task.id)"
              )
                i.icon.menu
              p {{ task.attributes.title }}
              .tags-block(v-for="tag in task.attributes.tags.data", :key="tag")
                .tag {{ tag.attributes.name }}
              .block-desc
                p.key {{ task.attributes.key }}
                div
                  p.date(
                    v-if="task.attributes.dueDate",
                    :class="isTaskOverdue(task.attributes.dueDate, task.attributes.createdAt, task.attributes.status.data.attributes.name)"
                  ) {{ formatDate(task.attributes.dueDate) }}
                    i.icon.clock
                  img.logo(
                    v-if="task.attributes.asignee.data.attributes.image",
                    :src="JSON.parse(task.attributes.asignee.data.attributes.image.name)",
                    alt="name"
                  )
                  img(
                    v-else,
                    :src="require(`@/assets/icons/default_user.svg`)"
                  )
            dropdown-list.menu(
              v-if="openDropdownIndex === task.id",
              :filtered-data="menuDone",
              :type="'menu'",
              :class-name="'name'",
              @selectedItem="selectedItem(task, $event)"
            )
  common-loader(v-if="isLoader")
</template>

<script lang="ts" setup>
import { leadNames, showDataUser } from "@/composables/userActions";
import CommonLoader from "@/components/common/CommonLoader.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import DropdownSearch from "@/components/common/DropdownSearch.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { showProjects } from "@/services/api/projectApi";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import { showTasks, updateTask } from "@/services/api/tasksApi";
import { showTypes } from "@/services/api/typeApi";
import Draggable from "vuedraggable";
import { getTaskTypeName } from "@/composables/projectsAction";
import { page } from "@/composables/pagination";
import { showStatus } from "@/services/api/statusApi";
import DropdownList from "@/components/common/DropdownList.vue";

const components: { draggable: any } = { Draggable };

enum TaskStatus {
  ToDo = "To do",
  InProgress = "In progress",
  Review = "Review",
  TestingFailed = "Testing failed",
}

const route = useRoute();
const foundProject = ref();
const project = ref([]);
const userItem = ref();
const active = ref(false);
const isLoader = ref(false);
const typeItem = ref([]);
const tasks = ref([]);
const types = ref([]);
const filter = ref("");
const searchText = ref("");
const totalTasks = ref(null);
const searchStatus = ref();
const searchId = ref();
const openDropdownIndex = ref(-1);
const filterUse = ref(false);
const dropdownStates = ref({
  typeTasks: { isOpen: false },
  assignee: { isOpen: false },
  reporter: { isOpen: false },
  menu: { isOpen: false },
});
const generateMenu = (moveBackStatus: boolean, moveNextStatus: boolean) => {
  return [
    {
      name: "Move back",
      icon: "arrow-long",
      class: moveBackStatus ? "left" : "",
      status: moveBackStatus ? "disabled" : "",
    },
    {
      name: "Move next",
      icon: "arrow-long",
      status: moveNextStatus ? "disabled" : "",
    },
    {
      name: "Archive",
      icon: "archive",
    },
  ];
};

const menu = ref(generateMenu(false, false));
const menuToDo = ref(generateMenu(true, false));
const menuDone = ref(generateMenu(true, true));

const toggleClose = (index: number) => {
  openDropdownIndex.value = openDropdownIndex.value === index ? -1 : index;
};

const isTaskOverdue = (
  dueDate: string | number | Date,
  createdAt: string | number | Date,
  status: string
) => {
  const currentDate = new Date();
  const taskDueDate = new Date(dueDate);
  const taskCreatedAt = new Date(createdAt);

  const overdueStatuses = [
    TaskStatus.ToDo,
    TaskStatus.InProgress,
    TaskStatus.Review,
    TaskStatus.TestingFailed,
  ];

  if (overdueStatuses.includes(status) && taskDueDate < currentDate) {
    return "overdue";
  }

  if (status === "Done" && taskCreatedAt > taskDueDate) {
    return "overdue";
  }

  if (status === "Done" && taskCreatedAt < taskDueDate) {
    return "onTime";
  }

  return "";
};
const log = (event: Event) => {
  const fromColumn = event.from.parentElement
    .querySelector("h4")
    .innerText.replace(/\d+/g, "");
  const toColumnElement = event.to.parentElement.querySelector("h4");
  const toColumn = toColumnElement
    ? toColumnElement.innerText.replace(/\d+/g, "").trim()
    : "";

  console.log(toColumn);

  const modifiedToColumn = toColumn.replace(
    /(\S+)\s+(\S+)/,
    (match, firstWord, secondWord) => {
      return `${firstWord} ${secondWord.toLowerCase()}`;
    }
  );
  console.log(modifiedToColumn);

  const taskTitle = event.item.querySelector("p").innerText;
  showTasks("").then(({ data }) => {
    searchId.value = data.data.find((task) => {
      return task.attributes.title === taskTitle;
    });
    console.log(searchId.value);

    showStatus().then(({ data }) => {
      searchStatus.value = data.data.find(
        (task) => task.attributes.name === modifiedToColumn
      );
      console.log(searchStatus.value);
      if (fromColumn.trim().toLowerCase() === "done") {
        const updateDataDone = {
          data: {
            status: 5,
          },
        };
        updateTask(searchId.value.id, updateDataDone).then((response) => {
          fetchTasks("");
        });
      } else {
        const updateData = {
          data: {
            status: searchStatus.value.id,
          },
        };
        console.log(updateData);
        updateTask(searchId.value.id, updateData).then((response) => {
          filterUse.value = true;
          fetchTasks("");
        });
      }
    });
  });
};

const selectUser = (lead: { name: string; logo: { name: string } }) => {
  userItem.value = lead;
  active.value = !active.value;
};
const selectedItem = (tag: { id: any; name: string }, status) => {
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
  } else {
    if (status.name === "Archive") {
      const updateDataDone = {
        data: {
          status: 6,
        },
      };
      openDropdownIndex.value = -1;
      updateTask(tag.id, updateDataDone).then((response) => {
        fetchTasks("");
      });
    } else {
      if (status.name === "Move next") {
        if (tag.attributes.status.data.attributes.name === "To do") {
          const updateDataDone = {
            data: {
              status: 2,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (
          tag.attributes.status.data.attributes.name === "In progress"
        ) {
          const updateDataDone = {
            data: {
              status: 3,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (tag.attributes.status.data.attributes.name === "Review") {
          const updateDataDone = {
            data: {
              status: 4,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (
          tag.attributes.status.data.attributes.name === "Testing failed"
        ) {
          const updateDataDone = {
            data: {
              status: 5,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (tag.attributes.status.data.attributes.name === "Done") {
          const updateDataDone = {
            data: {
              status: 5,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        }
      } else if (status.name === "Move back") {
        if (tag.attributes.status.data.attributes.name === "In progress") {
          const updateDataDone = {
            data: {
              status: 1,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (tag.attributes.status.data.attributes.name === "Review") {
          const updateDataDone = {
            data: {
              status: 2,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (
          tag.attributes.status.data.attributes.name === "Testing failed"
        ) {
          const updateDataDone = {
            data: {
              status: 3,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        } else if (tag.attributes.status.data.attributes.name === "Done") {
          const updateDataDone = {
            data: {
              status: 5,
            },
          };
          openDropdownIndex.value = -1;
          updateTask(tag.id, updateDataDone).then((response) => {
            fetchTasks("");
          });
        }
      }
    }
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
  return showTasks(`&filters[$and][0][status][name][$ne]=Archive${filters}`)
    .then((response) => {
      tasks.value = response.data.data.filter(
        (task: any) =>
          task.attributes.project.data.attributes.key === route.params.key
      );
      totalTasks.value = response.data.meta.pagination.total;
    })
    .finally(() => {
      isLoader.value = false;
      filterUse.value = false;
    });
};

const countToDoTasks = (type: string) => {
  return tasks.value.filter(
    (task: any) => task.attributes.status.data.attributes.name === type
  ).length;
};

const formatDate = (data: string) => {
  if (data) {
    const dateObject = new Date(data);
    return dateObject.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return "";
};

const clear = () => {
  typeItem.value = [];
  fetchTasks("");
};

const selectAllType = (item: [{ name: string; id: number }]) => {
  if (!typeItem.value.some((tag) => tag.id === item.id)) {
    typeItem.value.push(item);
  }
  dropdownStates.value.typeTasks.isOpen = false;
};

const reset = () => {
  filterUse.value = true;
  page.value = 1;
  searchText.value = "";
  if (typeItem.value.length) {
    typeItem.value = [];
  }
  userItem.value = "";
  fetchTasks("");
};

onMounted(() => {
  showDataUser();
  fetchTasks("");
  showTypes().then(({ data }) => {
    types.value = data.data.map(
      (item: { [x: string]: any; name: string; id: number }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
  });
  showProjects("").then(({ data }) => {
    foundProject.value = data.data.find(
      (project: ProjectInterfaceItem) =>
        project.attributes.key === route.params.key
    );

    if (foundProject.value) {
      project.value = [
        {
          name: foundProject.value.attributes.title,
          logo: foundProject.value.attributes.logo,
        },
      ];
    }
  });
});
watch(
  [() => searchText.value, () => typeItem.value, () => userItem.value],
  ([searchTextValue, typeItemValue, userItemValue]) => {
    const filters = [];

    if (searchTextValue) {
      filterUse.value = true;
      filters.push(`filters[title][$contains]=${searchTextValue}`);
    }

    if (typeItemValue && typeItemValue.length) {
      filterUse.value = true;
      const tagFilters = typeItemValue
        .map(
          (tag, index) => `filters[$and][${index}][type][name][$eq]=${tag.name}`
        )
        .join("&");
      filters.push(tagFilters);
    }

    if (userItemValue) {
      filterUse.value = true;
      filters.push(
        `filters[$and][${userItem.value.id}][asignee][username][$eq]=${userItem.value.name}`
      );
    }

    filter.value = filters.length ? `&${filters.join("&")}` : "";
    fetchTasks(filter.value);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.board {
  padding: 28px 24px;
  overflow: hidden;
  @include media_mobile {
    padding: 0 16px;
  }

  .loader-block {
    position: absolute;
    top: 62%;
    left: 57%;
    margin: 0;
    @include media_tablet {
      top: 64%;
      left: 51%;
    }
    @include media_mobile {
      top: 51%;
      left: 43%;
    }
  }

  &-panel {
    margin-top: 28px;
    display: flex;
    @include media_mobile {
      margin-top: 0;
      flex-direction: column;
    }

    .flex-block {
      display: flex;

      .mobile-block {
        display: flex;
        @include media_mobile {
          overflow-x: auto;
          overflow-y: hidden;
        }
      }
    }

    .form-group {
      margin-bottom: 0;
      @include media_mobile {
        margin-bottom: 6px;
      }
    }

    .reset {
      margin-left: 10px;
      padding: 12px 26px;
      font-size: 14px;
      line-height: 20px;
      color: var(--white);
      background: var(--accent);
      border: none;
      width: fit-content;

      &:hover {
        background: var(--accent_hover);
      }

      @include media_mobile {
        padding: 10px;
        margin-left: 6px;
        width: 36px;
        height: 34px;
        box-sizing: border-box;
        i.reset {
          position: relative;
          background: var(--white);
          width: 16px;
          height: 16px;
          margin-left: 0;
          top: -2px;
          left: -1px;
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

    .loader-block--img {
      display: flex;
      align-items: center;
      height: 48px;

      .loader-logo {
        width: 44px;
        height: 44px;
        border-radius: 24px;
        border: 2px solid var(--background);
        background: var(--primary);
        margin-left: -10px;
        @include media_mobile {
          width: 32px;
          height: 32px;
          border: 1px solid var(--accent);
          border-radius: 18px;
        }
      }
    }

    .assignee {
      margin: 0 10px;
      display: flex;
      align-items: center;
      @include media_mobile {
        height: 34px;
      }

      &-img {
        width: 48px;
        height: 48px;
        margin-left: -10px;
        @include media_mobile {
          height: 34px;
          width: 34px;
        }
      }

      img.logo {
        width: 44px;
        height: 44px;
        border-radius: 24px;
        border: 2px solid var(--accent);
        cursor: pointer;
        @include media_mobile {
          width: 32px;
          height: 32px;
          border: 1px solid var(--accent);
          border-radius: 18px;
        }

        &:hover {
          width: 54px;
          height: 54px;
          border-radius: 29px;
          border-color: var(--accent_hover);
          z-index: 10;
          position: relative;
          margin: -5px 0 0 0;
          @include media_mobile {
            width: 42px;
            height: 42px;
            position: absolute;
            margin: -5px 0 0 -5px;
          }
        }

        &.active {
          width: 54px;
          height: 54px;
          border-radius: 29px;
          border-color: var(--accent_hover);
          z-index: 10;
          position: relative;
          margin: -5px 0 0 0;
          @include media_mobile {
            width: 34px;
            height: 34px;
            position: absolute;
            margin: -1px 0 0 0;
          }
        }
      }
    }

    .dropdown-block {
      position: relative;
      width: 100%;
      @include media_mobile {
        position: inherit;
        width: inherit;
      }

      .active {
        transform: rotate(180deg);
      }

      .selected {
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
          right: 23px;
          top: 8px;
        }
      }

      .selectBtn {
        background: var(--accent);
      }

      .select {
        color: var(--accent);

        i.arrow {
          &::before {
            background: var(--accent);
          }
        }
      }

      .drop-down {
        top: 61px;
        @include media_mobile {
          left: 16px;
          top: 139px;
        }
      }
    }

    button {
      background: var(--white);
      border: 1px solid var(--primary);
      color: var(--text);
      padding: 14px 44px 14px 16px;
      height: 48px;
      position: relative;
      @include media_mobile {
        padding: 9px 26px 9px 10px;
        height: 34px;
        font-size: 12px;
        line-height: 16px;
      }

      &.btn_arrow {
        background: var(--white);
        border-color: var(--primary);
        color: var(--text);

        &:hover {
          border-color: var(--accent);
          background: var(--white_shadow, #f4f4f4);
        }
      }

      i.arrow {
        height: 10px;
        width: 16px;
        right: 16px;
        @include media_mobile {
          width: 10px;
          height: 7px;
          right: 10px;
        }
      }
    }

    form {
      width: 220px;
      margin-right: 10px;
      @include media_mobile {
        width: 100%;
        margin-right: 0;
      }

      input {
        width: 220px;
        position: relative;
        @include media_mobile {
          width: 100%;
          padding: 8px 8px 8px 27px;
        }
      }

      i.search {
        top: 14px;
        right: 16px;
        @include media_mobile {
          top: 10px;
          left: 8px;
          width: 13px;
          height: 13px;
        }
      }
    }
  }

  h3 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0;
    @include media_mobile {
      display: none;
    }
  }

  &-block {
    display: flex;
    gap: 12px;
    margin-top: 36px;
    width: 100%;
    overflow: auto;
    @include media_mobile {
      width: 106%;
      .board-block--fifth {
        margin-right: 16px;
      }
    }

    .tablet {
      display: block;
      height: 100vh;
    }

    .mobile {
      display: none;

      button.menu {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: var(--secondary);
        position: absolute;
        top: 6px;
        right: 6px;
        border: none;
        pointer-events: auto;

        &:hover {
          background: var(--primary_hover);
        }

        &.active {
          background: var(--primary_hover);
        }

        i.icon.menu {
          right: 4px;
          top: 4px;
          width: 12px;
          height: 12px;
        }
      }
    }

    @include media_mobile {
      margin-top: 16px;
      .tablet {
        display: none;
      }
      .mobile {
        display: block;
      }
    }

    .board-box {
      border-radius: 6px 6px 0px 0px;
      padding: 6px;
      min-width: 260px;
      box-sizing: border-box;
      height: 100vh;

      h4 {
        padding: 6px 10px 12px;
        margin: 0;
        text-transform: capitalize;
        @include font(16px, 500, 24px, var(--text));
      }

      ul {
        margin: 16px 0 0 0;
        padding: 0;

        &.disabled {
          pointer-events: none;
          position: relative;
        }

        div {
          @include media_mobile {
            pointer-events: none;
          }
        }

        a {
          text-decoration: none;
        }

        ul {
          z-index: 1000;
        }

        li {
          background: var(--white);
          list-style: none;
          padding: 6px;
          border-radius: 4px;
          margin-bottom: 6px;
          position: relative;
          cursor: pointer;

          .menu {
            @include media_mobile {
              z-index: 1;
            }
          }

          &:hover {
            border-radius: 4px;
            background: var(--background_hover);
            box-shadow: 0px 4px 16px 0px rgba(61, 55, 52, 0.08),
              0px 2px 4px 0px rgba(61, 55, 52, 0.04),
              0px 0px 2px 0px rgba(61, 55, 52, 0.16);
            border: none;
          }

          p {
            margin: 0;
            @include font(14px, 500, 20px, var(--text));

            &.key {
              @include font(12px, 700, 16px, var(--text));
            }
          }

          i.icon {
            top: 6px;
            right: 6px;
            width: 20px;
            height: 20px;
            @include media_mobile {
              right: 32px;
            }
          }

          .tags-block {
            display: flex;
            gap: 4px;
            margin: 6px 0;

            .tag {
              padding: 4px 6px;
              background: var(--accent);
              border-radius: 6px;
              @include font(8px, 400, 10px, var(--white));
            }
          }

          .block-desc {
            display: flex;
            align-items: center;
            justify-content: space-between;

            div {
              display: flex;
              align-items: center;
            }

            img {
              width: 32px;
              height: 32px;
              border-radius: 24px;
            }

            .date {
              border-radius: 4px;
              background: var(--primary);
              padding: 8px 8px 8px 30px;
              @include font(12px, 400, 16px, var(--text));
              position: relative;
              margin-right: 6px;

              &.overdue {
                background: var(--error);
                color: var(--white);

                i.clock {
                  &::before {
                    background: var(--white);
                  }
                }
              }

              &.onTime {
                background: var(--notify_success);
                color: var(--white);

                i.clock {
                  &::before {
                    background: var(--white);
                  }
                }
              }
            }

            i.clock {
              display: inline-block;
              left: 8px;
              width: 16px;
              height: 16px;
              top: 8px;
            }
          }
        }
      }
    }

    &--first {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        var(--primary);
    }

    &--second {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        var(--notify_warning);
    }

    &--third {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        var(--primary_hover);
    }

    &--fourth {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        var(--error);
    }

    &--fifth {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.5) 100%
        ),
        var(--notify_success);
    }
  }
}
</style>

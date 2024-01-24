<template lang="pug">
.details
  h2 Project Details
  div(v-if="!isLoader")
    .details--block(v-for="item in project", :key="item")
      .block--left
        .name(:class="{ active }")
          input(v-model="inputValue", @click="editName")
          .name-block
            .check-block(:class="{ active }", @click="updateProjectAndFetch")
              i.icon.check
            .close-block(:class="{ active }", @click="closeName")
              i.icon.close
          .tablet
            i.icon.unchecked(v-if="!active")
            i.icon.share
            div(:class="{ active: listOpen }")
              i.icon.menu(@click="listOpen = !listOpen")
            dropdown-list.menu(
              v-if="listOpen",
              :filtered-data="list",
              :type="'menu'",
              :class-name="'list'",
              @selectedItem="selectedItem"
            )
        h4 Tags:
        .tags-block
          .tag(v-for="tag in tags", :key="tag")
            i.icon.close(@click="deleteTag(tag)")
            p {{ tag.name }}
          common-button.btn_primary.btn_icon(
            v-if="tagNotInProject.length !== 0",
            @click.prevent="toggleDropdown('tags')"
          ) Add
          dropdown-component(
            :is-open="dropdownStates.tags.isOpen",
            :data="tagNotInProject",
            :type="'tags'",
            :class-type="'small'",
            @selectedItem="selectedItem"
          )
        h4 Description
        p(v-if="!activeText", @click="editText") {{ desc }}
        .text-area(
          v-if="activeText",
          :class="{ active: activeText }",
          @click="editText"
        )
          textarea(v-model="desc", @click="editText")
        .block-btn(v-if="activeText")
          common-button.btn-secondary(@click="updateProjectAndFetch") Save
          common-button.btn-secondary-line(@click="cancelText") Cancel
      .block-right
        .block--right
          .block-icon
            i.icon.unchecked
            i.icon.share
            div(:class="{ active: listOpen }")
              i.icon.menu(@click="listOpen = !listOpen")
            dropdown-list.menu(
              v-if="listOpen",
              :filtered-data="list",
              :type="'menu'",
              :class-name="'list'",
              @selectedItem="selectedItem"
            )
          .block-details(:class="{ close: !menuOpen }")
            p.details Details
            i.icon.arrow(
              :class="{ menuOpen }",
              @click.prevent="menuOpen = !menuOpen"
            )
          .block-desc(v-if="menuOpen")
            .logo-block
              p.title Project logo
              div
                img.logo(
                  v-if="item.logo",
                  :src="JSON.parse(item.logo.name)",
                  alt="name"
                )
                img.logo(v-else, :src="require(`@/assets/icons/gender.svg`)")
                p.distance or
                image-input.details-image(@file="addFile")
            .lead-block.lead(@click.prevent="toggleDropdown('lead')")
              p.title Lead
              div
                img(
                  v-if="item.lead.data.attributes.image",
                  :src="JSON.parse(item.lead.data.attributes.image.name)",
                  alt="name"
                )
                img(v-else, :src="require(`@/assets/icons/gender.svg`)")
                p.lead(:class="{ active: dropdownStates.lead.isOpen }") {{ item.lead.data.attributes.username }}
                dropdown-component.lead(
                  v-if="dropdownStates.lead.isOpen",
                  :is-open="dropdownStates.lead.isOpen",
                  :data="user",
                  :type="'lead'",
                  @selectedItem="selectedItem"
                )
            .lead-block.lead(@click.prevent="toggleDropdown('manager')")
              p.title Manager
              div
                img(
                  v-if="item.manager.data.attributes.image",
                  :src="JSON.parse(item.manager.data.attributes.image.name)",
                  alt="name"
                )
                img(v-else, :src="require(`@/assets/icons/gender.svg`)")
                p.lead(:class="{ active: dropdownStates.manager.isOpen }") {{ item.manager.data.attributes.username }}
                dropdown-component.lead(
                  v-if="dropdownStates.manager.isOpen",
                  :is-open="dropdownStates.manager.isOpen",
                  :data="user",
                  :type="'lead'",
                  @selectedItem="selectedItem"
                )
            .lead-block.members
              p.title Members
              div
                .members(v-for="member in item.members", :key="member")
                  img(
                    v-if="member.attributes.image",
                    :src="JSON.parse(member.attributes.image.name)",
                    alt="name",
                    :class="{ active: member.id === activeIndex }",
                    @click="toggleSize(member.id)"
                  )
                  img(v-else, :src="require(`@/assets/icons/gender.svg`)")
                .add(
                  v-if="membersNotInProject.length !== 0",
                  @click.prevent="toggleDropdown('members')"
                )
                  i.icon.plus
                dropdown-component.members-dd(
                  :type="'checkbox'",
                  :is-open="dropdownStates.members.isOpen",
                  :data="membersNotInProject",
                  :icon-here="true",
                  :title="'Members'",
                  :checked-item="memberItem",
                  :members-data="'true'",
                  @selectedItem="selectedItem",
                  @clear="clear",
                  @allItem="selectAll"
                )
        .created
          p.distance Created:
            span {{ formatDate(item.created) }}
        .created
          p Updated:
            span {{ formatDate(item.updated) }}
  common-loader.loader(v-else)
</template>
<script lang="ts" setup>
import DropdownComponent from "@/components/common/DropdownSearch.vue";
import CommonLoader from "@/components/common/CommonLoader.vue";
import { computed, onMounted, ref } from "vue";
import {
  deleteProject,
  showProjects,
  updateProject,
} from "@/services/api/projectApi";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import { useRoute } from "vue-router";
import CommonButton from "@/components/common/CommonButton.vue";
import ImageInput from "@/components/common/ImageInput.vue";
import { showTags } from "@/services/api/tagsApi";
import { ImageInterface } from "@/types/ImageInterface";
import { showUsers } from "@/services/api/userApi";
import DropdownList from "@/components/common/DropdownList.vue";
import {
  notifications,
  NotificationType,
  pushNotification,
} from "@/composables/notification";
import dayjs from "dayjs";

const menuOpen = ref(true);
const foundProject = ref();
const route = useRoute();
const project = ref([]);
const isLoader = ref(false);
const active = ref(false);
const activeText = ref(false);
const membersNotInProject = ref();
const desc = ref("");
const showAdd = ref(true);
const memberItem = ref([]);
const tags = ref();
const user = ref();
const tagNotInProject = ref();
const projectTags = ref();
const listOpen = ref(false);
const activeIndex = ref(-1);

const list = [
  {
    name: "Clone",
    icon: "kanban",
  },
  {
    name: "Remove",
    icon: "trash",
  },
];

const dropdownStates = ref({
  tags: { isOpen: false },
  lead: { isOpen: false },
  members: { isOpen: false },
  manager: { isOpen: false },
  menu: { isOpen: false },
  list: { isOpen: false },
});

const inputValue = ref("");
const getInputValue = computed(() => {
  return project.value[0]?.name + " (" + project.value[0]?.key + ")";
});

const getDesc = computed(() => {
  return project.value[0]?.desc;
});

const toggleSize = (index: number) => {
  activeIndex.value = activeIndex.value === index ? -1 : index;
};

const deleteTag = (tag: { name: string; id: number }) => {
  const tagIndex = tags.value.findIndex((t) => t.id === tag.id);

  if (tagIndex !== -1) {
    tags.value.splice(tagIndex, 1);
    const idsArray = tags.value.map((tag) => tag.id.toString());

    const updateData = {
      data: {
        tags: idsArray,
        updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
      },
    };
    pushNotification({
      text: `${tag.name} was removed`,
      type: NotificationType.Success,
      key: `key${notifications.value.length}`,
    });
    updateProject(foundProject.value.id, updateData).then(() => {
      fetchProjects();
    });
  }

  showAdd.value = true;
};

const editText = () => {
  activeText.value = true;
};

const selectAll = (item: [{ name: string; id: number }]) => {
  if (!memberItem.value.some((tag) => tag.id === item.id)) {
    project.value[0].members.push(item);
    membersNotInProject.value.push(item);
    memberItem.value.push(item);
    user.value.splice(item, 1);
    const idsArray = project.value[0].members.map((tag) => tag.id.toString());
    const updateData = {
      data: {
        members: idsArray,
        updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
      },
    };
    pushNotification({
      text: "Project members successfully changed",
      type: NotificationType.Success,
      key: `key${notifications.value.length}`,
    });
    updateProject(foundProject.value.id, updateData).then(() => {
      fetchProjects();
      dropdownStates.value.members.isOpen =
        !dropdownStates.value.members.isOpen;
    });
  }
};

const clear = () => {
  console.log("clear");
};

const addFile = (userImage: ImageInterface) => {
  const updateData = {
    data: {
      logo: {
        name: userImage.value[0].base64,
        updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
      },
    },
  };
  pushNotification({
    text: `Project image successfully changed`,
    type: NotificationType.Success,
    key: `key${notifications.value.length}`,
  });
  updateProject(foundProject.value.id, updateData).then(() => {
    fetchProjects();
  });
};
const cancelText = () => {
  activeText.value = false;
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
const selectedItem = (tag: string) => {
  if (dropdownStates.value.tags.isOpen) {
    if (!tags.value.includes(tag)) {
      pushNotification({
        text: `${tag.name} added to project`,
        type: NotificationType.Success,
        key: `key${notifications.value.length}`,
      });
      tags.value.push(tag);
      const idsArray = tags.value.map((tag) => tag.id.toString());
      const updateData = {
        data: {
          tags: idsArray,
          updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
        },
      };
      updateProject(foundProject.value.id, updateData).then(() => {
        fetchProjects();
        dropdownStates.value.tags.isOpen = !dropdownStates.value.tags.isOpen;
      });
    }
  } else if (dropdownStates.value.lead.isOpen) {
    const updateData = {
      data: {
        lead: tag.id,
        updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
      },
    };
    pushNotification({
      text: "Project lead successfully changed",
      type: NotificationType.Success,
      key: `key${notifications.value.length}`,
    });
    updateProject(foundProject.value.id, updateData).then(() => {
      dropdownStates.value.lead.isOpen = !dropdownStates.value.lead.isOpen;
      fetchProjects();
    });
  } else if (dropdownStates.value.manager.isOpen) {
    const updateData = {
      data: {
        manager: tag.id,
        updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
      },
    };
    pushNotification({
      text: "Project manager successfully changed",
      type: NotificationType.Success,
      key: `key${notifications.value.length}`,
    });
    updateProject(foundProject.value.id, updateData).then(() => {
      dropdownStates.value.manager.isOpen =
        !dropdownStates.value.manager.isOpen;
      fetchProjects();
    });
  } else if (dropdownStates.value.members.isOpen) {
    if (!memberItem.value.includes(tag)) {
      project.value[0].members.push(tag);
      memberItem.value.push(tag);
      user.value.splice(tag, 1);
      const idsArray = project.value[0].members.map((tag) => tag.id.toString());
      const updateData = {
        data: {
          members: idsArray,
          updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
        },
      };
      pushNotification({
        text: "Project members successfully changed",
        type: NotificationType.Success,
        key: `key${notifications.value.length}`,
      });
      updateProject(foundProject.value.id, updateData).then(() => {
        fetchProjects();
      });
      if (project.value[0].members.length === user.value.length) {
        dropdownStates.value.members.isOpen =
          !dropdownStates.value.members.isOpen;
      }
    }
  } else if (listOpen.value) {
    if (tag.name === "Remove") {
      deleteProject(foundProject.value.id);
      window.location.replace(`/dashboard/projects`);
    }
  }
};
const formatDate = (value: string) => {
  const date = new Date(value);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const editName = () => {
  active.value = true;
};

const closeName = () => {
  active.value = false;
};

const updateProjectAndFetch = () => {
  if (inputValue.value) {
    const matches = inputValue.value.match(/\((.*?)\)/);
    let key;

    if (matches) {
      key = matches[1].toUpperCase();
    } else {
      const words = inputValue.value.split(" ");
      key = words.map((word) => word.charAt(0).toUpperCase()).join("");
    }
    const title = matches
      ? inputValue.value.substring(0, inputValue.value.indexOf("(")).trim()
      : inputValue.value;

    const updateData = {
      data: {
        title: title,
        key: key,
        description: desc.value,
        updatedAt: dayjs().format("dddd, MMMM D, YYYY [at] h:mm A"),
      },
    };
    updateProject(foundProject.value.id, updateData).then(() => {
      fetchProjects();
      if (desc.value !== project.value[0]?.desc) {
        activeText.value = false;
        pushNotification({
          text: `Project description successfully changed`,
          type: NotificationType.Success,
          key: `key${notifications.value.length}`,
        });
      } else {
        pushNotification({
          text: `Project name successfully changed`,
          type: NotificationType.Success,
          key: `key${notifications.value.length}`,
        });
      }
    });
  }
  active.value = false;
};

const fetchProjects = () => {
  isLoader.value = true;
  showProjects("").then(({ data }) => {
    foundProject.value = data.data.find((project: ProjectInterfaceItem) => {
      return Number(project.id) === Number(route.params.projectId);
    });

    if (foundProject.value) {
      project.value = [
        {
          name: foundProject.value.attributes.title,
          logo: foundProject.value.attributes.logo,
          members: foundProject.value.attributes.members.data,
          key: foundProject.value.attributes.key,
          tag: foundProject.value.attributes.tags.data,
          desc: foundProject.value.attributes.description,
          lead: foundProject.value.attributes.lead,
          manager: foundProject.value.attributes.manager,
          created: foundProject.value.attributes.createdAt,
          updated: foundProject.value.attributes.updatedAt,
        },
      ];
      projectTags.value = foundProject.value.attributes.tags.data.map((tag) => {
        return {
          id: tag.id,
          name: tag.attributes.name,
          type: tag.attributes.type,
        };
      });
      const projectLead = foundProject.value.attributes.lead.data.id;
      showUsers("").then(({ data }) => {
        user.value = data.map((item) => item);
        user.value = user.value.map(
          (item: {
            [x: string]: any;
            name: string;
            id: number;
            logo: string;
          }) => ({
            name: item.username,
            id: item.id,
            logo: item.image,
          })
        );
        let allMembers = data.map((item) => item);
        let membersIds = project.value[0].members.map((tag) => tag.id);
        membersNotInProject.value = allMembers.filter(
          (tag) => !membersIds.includes(tag.id)
        );
        membersNotInProject.value = membersNotInProject.value.map(
          (item: {
            [x: string]: any;
            name: string;
            id: number;
            logo: string;
          }) => ({
            name: item.username,
            id: item.id,
            logo: item.image,
          })
        );
      });
      tags.value = projectTags.value;
      showTags().then(({ data }) => {
        let allTag = data.data.map((item) => item);
        let tagIds = projectTags.value.map((tag) => tag.id);
        tagNotInProject.value = allTag.filter(
          (tag) => !tagIds.includes(tag.id)
        );
        tagNotInProject.value = tagNotInProject.value.map(
          (item: { [x: string]: any; name: string; id: number }) => ({
            name: item.attributes.name,
            id: item.id,
          })
        );
      });
      inputValue.value = getInputValue.value;
      desc.value = getDesc.value;
    }
    isLoader.value = false;
  });
};

onMounted(() => {
  fetchProjects();
});
</script>

<style lang="scss" scoped>
.details {
  padding: 28px 14px 28px 24px;
  width: 100%;

  @include media_tablet {
    padding: 28px 20px 28px 20px;
  }

  @include media_mobile {
    padding: 0 8px 28px;
    width: calc(100% - 16px);
    overflow-x: auto;
  }

  button {
    width: fit-content;
    @include media_mobile {
      padding: 8px 16px;
    }
  }

  .created {
    display: flex;
    align-items: center;

    p {
      @include font(12px, 400, 18px, var(--placeholder));
      margin: 0;

      &.distance {
        margin-top: 10px;
        @include media_mobile {
          margin-top: 8px;
        }
      }
    }

    span {
      color: var(--text);
      font-width: 500;
      margin-left: 6px;
    }
  }

  &--block {
    display: flex;
    justify-content: space-between;
    gap: 26px;
    @include media_mobile {
      padding: 0 8px;
    }

    .block-right {
      width: 40%;
      @include media_tablet {
        width: 100%;
      }
    }

    .block--left {
      width: 60%;
      @include media_tablet {
        width: 100%;
      }
    }

    .tablet {
      display: none;
    }

    @include media_tablet {
      flex-direction: column;
      gap: 0;

      .tablet {
        gap: 12px;
        display: flex;
        align-items: center;
        margin-right: 6px;
        position: absolute;
        right: 16px;

        i.share {
          @include media_tablet {
            margin: 0 7px 0 12px;
          }
        }

        div {
          width: 32px;
          height: 32px;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          @include media_mobile {
            margin: 0;
          }

          &.active {
            border-radius: 16px;
            background: var(--primary_hover);
          }
        }

        @include media_tablet {
          margin-right: 0;
          gap: 0;
          right: 5px;
        }
        @include media_mobile {
          right: 10px;
        }

        i {
          position: relative;
        }
      }
    }

    .block--right {
      .block-icon {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: relative;
        margin: 3px -5px 17px 0;
        @include media_tablet {
          display: none;
        }

        div {
          width: 32px;
          height: 32px;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            border-radius: 16px;
            background: var(--primary_hover);
          }
        }

        i.icon {
          position: relative;

          &.share {
            margin: 0 6px 0 12px;
          }
        }
      }

      p {
        margin: 0;
        @include font(16px, 400, 24px, var(--text));

        &.active {
          color: var(--accent_hover);
        }

        &.details {
          margin: 0;
          padding: 0;
        }

        @include media_mobile {
          font-size: 14px;
          line-height: 20px;
          &.details {
            font-size: 12px;
            line-height: 16px;
          }
        }

        &.lead {
          margin-left: 12px;
          @include media_mobile {
            margin-left: 6px;
          }
        }
      }

      .block-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        border: 1px solid var(--primary);
        border-radius: 4px 4px 0 0;
        box-sizing: border-box;
        height: 52px;

        &.close {
          border-radius: 4px;
        }

        @include media_mobile {
          height: 38px;
          padding: 11px 10px;
        }

        i.arrow {
          position: relative;
          height: 7px;
          transform: rotate(0);
          @include media_mobile {
            width: 13px;
          }

          &.menuOpen {
            transform: rotate(180deg);
          }
        }
      }

      .block-desc {
        padding: 10px 0 16px;
        border: 1px solid var(--primary);
        border-width: 0 1px 1px 1px;
        border-radius: 0 0 4px 4px;
        @include media_mobile {
          padding: 10px 0;
        }

        .lead-block {
          padding: 9px 16px;
          position: relative;
          cursor: pointer;

          &.members {
            height: 54px;
            box-sizing: border-box;
            @include media_mobile {
              margin-top: 2px;
              height: 38px;
            }

            div {
              display: flex;
              align-items: center;
            }

            img {
              width: 38px;
              height: 38px;

              &:hover {
                width: 38px;
                height: 38px;
              }

              &:not(:hover) {
                width: 30px;
                height: 30px;
              }

              @include media_mobile {
                width: 30px;
                height: 30px;
              }
            }

            div {
              &:hover {
              }
            }
          }

          &.lead {
            img {
              width: 30px;
              height: 30px;
              @include media_mobile {
                width: 20px;
                height: 20px;
              }
            }
          }

          @include media_tablet {
            p {
              width: 50%;
              @include media_mobile {
                width: 35%;
              }
            }
            div {
              width: 50%;
              @include media_mobile {
                width: 100%;
                left: 0;
              }
            }
          }
          @include media_mobile {
            padding: 10px;
          }

          .lead {
            top: 56px;
          }

          img {
            border-radius: 25px;
            border: 1px solid var(--accent);
            z-index: 1;

            &:hover {
              z-index: 2;
              cursor: pointer;
              border-radius: 20px;
              border: 1px solid var(--accent_hover);
            }
          }

          .add {
            cursor: pointer;
            border-radius: 20px;
            border: 1px solid var(--accent);
            background: var(--background);
            z-index: 1;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 0 0 -10px;

            &:hover {
              width: 38px;
              height: 38px;
            }

            @include media_mobile {
              width: 30px;
              height: 30px;
            }

            .plus {
              width: 10px;
              height: 10px;

              &::before {
                background: var(--accent);
              }
            }
          }

          .members {
            display: flex;
            align-items: center;
            margin-bottom: 0;
            margin-left: -10px;
            @include media_tablet {
              width: auto;
            }

            &:first-of-type {
              margin-left: 0;
            }
          }
        }

        .logo-block {
          padding: 8px 16px;
          @include media_mobile {
            padding: 6px 10px;
            margin-bottom: 2px;
          }

          img {
            border-radius: 25px;
            border: 1px solid var(--primary);
            width: 32px;
            height: 32px;
          }
        }

        div {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          @include media_mobile {
            margin: 0;
          }

          p {
            margin-right: 6px;

            &.title {
              width: 30%;
              @include media_tablet {
                width: 50%;
              }
              @include media_mobile {
                width: 34%;
              }
            }

            &.distance {
              width: auto;
              margin: 0 10px;
            }
          }

          img.logo {
            width: 64px;
            height: 64px;
            border-radius: 6px;
            border: none;
            @include media_mobile {
              width: 38px;
              height: 38px;
            }
          }

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  h2 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0 0 22px 0;
    @include media_tablet {
      margin: 0 0 18px 0;
    }
    @include media_mobile {
      display: none;
    }
  }

  .name {
    padding: 10px;
    margin-left: -10px;
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    @include media_tablet {
      margin-bottom: 6px;
    }
    @include media_mobile {
      padding: 0;
      box-sizing: border-box;
      height: 32px;
    }

    .name-block {
      display: flex;
      align-items: center;
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      width: 100%;
      @include font(24px, 700, 28px, var(--text));
      @include media_mobile {
        font-size: 16px;
        line-height: 20px;
        padding: 6px 8px;
      }
    }

    &.active {
      border-radius: 4px;
      border: 1px solid var(--accent);
      background: var(--background);
      box-sizing: border-box;
      @include media_tablet {
        height: 48px;
        width: 83%;
      }
      @include media_mobile {
        width: 104%;
        height: 38px;
        input {
          padding: 6px 8px;
        }
      }
    }

    .check-block {
      display: none;
      padding: 6px 7px;
      border-radius: 4px;
      background: var(--accent);
      @include media_mobile {
        width: 26px;
        height: 26px;
        box-sizing: border-box;
      }

      &.active {
        display: flex;
        justify-content: center;
        align-items: center;

        i.icon {
          display: block;
          position: relative;
          width: 16px;
          height: 16px;
          @include media_mobile {
            height: 13px;
          }

          &::before {
            background: var(--white);
          }
        }
      }
    }

    .close-block {
      display: none;
      border-radius: 4px;
      background: var(--secondary);
      padding: 6px 7px;
      margin-left: 3px;
      @include media_mobile {
        width: 26px;
        height: 26px;
        box-sizing: border-box;
      }

      &.active {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      i.icon {
        display: block;
        position: relative;
        width: 16px;
        height: 16px;
        @include media_mobile {
          height: 13px;
        }
      }
    }
  }

  h3 {
    @include font(24px, 400, 28px, var(--text));
    margin: 0;
  }

  h4 {
    @include font(16px, 500, 24px, var(--text));
    margin: 0;
    @include media_mobile {
      font-size: 12px;
      line-height: 16px;
      margin: 0;
    }
  }

  p {
    @include font(14px, 500, 20px, var(--text));
    margin: 12px 0 0;
    padding: 0;
  }

  .text-area {
    &.active {
      textarea {
        padding: 16px 20px;
        border-radius: 4px;
        border: 1px solid var(--accent);
        margin-bottom: 6px;
        width: 98%;
        @include media_mobile {
          padding: 6px 10px;
        }
      }
    }
  }

  textarea {
    @include font(14px, 500, 20px, var(--text));
    margin: 10px 0 0;
    padding: 0;
    width: 100%;
    height: auto;
    background: transparent;
    border: none;
    outline: none;
    box-sizing: border-box;
    resize: vertical;
    @include media_tablet {
      margin: 8px 0 0;
    }
    @include media_mobile {
      font-size: 10px;
      line-height: 16px;
      margin: 12px 0 8px;
    }
  }

  .block-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-right: 10px;

    button {
      padding: 12px 16px;
      font-size: 14px;
      line-height: 20px;
    }

    @include media_tablet {
      margin-bottom: 16px;
    }
  }

  .tags-block {
    display: flex;
    align-items: center;
    position: relative;
    gap: 8px;
    margin: 8px 0 26px;
    @include media_tablet {
      margin: 8px 0 22px;
    }
    @include media_mobile {
      margin: 6px 0 12px;
      gap: 6px;
    }

    .btn_primary {
      width: fit-content;
      padding: 10px 8px;
      @include font(14px, 500, 20px, var(--white));
      border-radius: 8px;
      height: 32px;
      @include media_mobile {
        height: 24px;
        font-size: 12px;
        line-height: 16px;
        padding: 4px 8px;
      }
    }

    .btn_icon {
      &::before {
        mask-image: url("@/assets/icons/plus.svg");
        background: var(--white);
        width: 12px;
        height: 12px;
        margin-right: 4px;
        @include media_mobile {
          width: 10px;
          height: 10px;
        }
      }
    }

    .tag {
      display: flex;
      align-items: center;
      background: var(--accent);
      padding: 6px 8px;
      border-radius: 8px;
      @include media_mobile {
        padding: 4px 6px;
      }

      p {
        margin: 0;
        @include font(14px, 400, 20px, var(--white));
        @include media_mobile {
          font-size: 12px;
          line-height: 16px;
        }
      }

      i.close {
        position: relative;
        margin-right: 4px;
        width: 10px;
        height: 10px;
        @include media_mobile {
          width: 8px;
          height: 8px;
        }

        &::before {
          background: var(--white);
        }
      }
    }
  }

  .loader {
    position: absolute;
    top: 22%;
    left: 57%;
  }
}
</style>

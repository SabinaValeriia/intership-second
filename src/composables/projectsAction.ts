import { showProjects } from "@/services/api/projectApi";
import { ref, computed } from "vue";
import { ProjectInterfaceItem } from "../types/projectApiInterface";
export const projects = ref([]);

export const showProject = () => {
  showProjects("").then(({ data }) => {
    projects.value = data.data.map((project: ProjectInterfaceItem) => {
      return project.attributes;
    });
  });
};

export const filterFunction = (data: string[]) => {
  const selected: string[] = [];
  const filtered = computed(() => {
    return data.filter((f) => !selected.includes(f));
  });

  return {
    selected,
    filtered,
    addSelected: (item: string) => {
      if (!selected.includes(item)) {
        selected.push(item);
      }
    },
    removeSelected: (item: string) => {
      const index = selected.indexOf(item);
      if (index !== -1) {
        selected.splice(index, 1);
      }
    },
  };
};

export const getTaskTypeName = (taskItem: string) => {
  const lowercaseTaskItem = taskItem.toLowerCase();
  if (lowercaseTaskItem === "bug") {
    return "bug";
  } else if (lowercaseTaskItem === "improvement") {
    return "improvement";
  } else if (lowercaseTaskItem === "feature") {
    return "feature";
  }
};

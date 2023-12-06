import { showProjects } from "@/services/api/projectApi";
import { ref, computed } from "vue";
import { ProjectInterfaceItem } from "../types/projectApiInterface";
export const leadNames = ref([]);
export const projects = ref([]);

export const showProject = () => {
  showProjects("").then(({ data }) => {
    projects.value = data.data.map((project: ProjectInterfaceItem) => {
      return project.attributes;
    });
    leadNames.value = data.data.map(
      (item: {
        attributes: {
          leadName: string;
          logo: {
            name: string;
          };
        };
        id: number;
      }) => ({
        leadName: item.attributes,
        logo: item.attributes.logo.name,
        id: item.id,
      })
    );
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
  };
};

export const getTaskTypeName = (taskItem: string) => {
  if (taskItem === "bug") {
    return "bug";
  } else if (taskItem === "implementation") {
    return "implementation";
  } else if (taskItem === "feature") {
    return "feature";
  }
};

import { showProjects } from "@/services/api/projectApi";
import { ref } from "vue";

export const leadNames = ref([]);
export const projects = ref([]);

export const showProject = () => {
  showProjects().then(({ data }) => {
    projects.value = data.data.map((project: any) => project.attributes);
    leadNames.value = data.data.map((item: any) => ({
      leadName: item.attributes,
      logo: item.attributes.logo.name,
      id: item.id,
    }));
  });
};

export interface ProjectInterface {
  data: {
    title: string;
    key: string;
    description: string;
    logo: {
      name: string;
    };
    lead: string;
    members: string[];
    tags: string[];
  };
}

export interface ResProject {
  data: {
    attributes: {
      title: string;
      key: string;
      description: string;
      logo: {
        name: string;
      };
      lead: string;
      members: string[];
      tags: string[];
    };
  };
}

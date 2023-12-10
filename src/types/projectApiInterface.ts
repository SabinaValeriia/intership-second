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
    managers: string;
  };
}

export interface ResProject {
  [x: string]: any;
  data: {
    [x: string]: any;
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

export interface ProjectInterfaceItem {
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
  id: number;
}

export interface ResType {
  [x: string]: any;
  data: {
    [x: string]: any;
    attributes: {
      name: string;
      publishedAt: string;
      tasks_type: string[];
      createdAt: string;
      updatedAt: string;
    };
  };
}

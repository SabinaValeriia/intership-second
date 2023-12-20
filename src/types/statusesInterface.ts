export interface ResStatus {
  [x: string]: any;
  data: {
    [x: string]: any;
    attributes: {
      name: string;
      publishedAt: string;
      tasks_status: string[];
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface ResTasks {
  data: {
    [index: number]: {
      attributes: {
        key: string;
        title: string;
        description: string;
        dueDate: string;
      };
      id: number;
    };
  };
}

export interface ShowTasks {
  [x: string]: any;
  createdAt: string;
  description: string;
  dueDate: string;
  key: string;
  members: [
    data: {
      [index: number]: {
        attributes: {
          logo: {
            name: string;
          };
          email: string;
          username: string;
        };
        id: number;
      };
    }
  ];
}

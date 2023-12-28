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

  [x: string]: any;
}

export enum Statuses {
  toDo = "To do",
  inProgress = "In progress",
  review = "Review",
  failed = "Testing failed",
  done = "Done",
  archive = "Archive",
}

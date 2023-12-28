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
  toDo = "To Do",
  inProgress = "In Progress",
  review = "Review",
  failed = "Testing Failed",
  done = "Done",
  archive = "Archive",
}

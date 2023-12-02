export interface UserInterface {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  logo?: {
    name: string;
  };
  department?: {
    name: string;
  };
  manager?: {
    username: string;
  };
  project?: {
    [index: number]: {
      title: string;
    };
  }[];
  tasks?: {
    [index: number]: {
      title: string;
    };
  }[];
}

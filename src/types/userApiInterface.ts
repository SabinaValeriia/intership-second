export interface AuthUserInterface {
  identifier: string;
  password: string;
}

export interface ResUser {
  map(
    arg0: (item: { name: string; logo: { name: string }; id: number }) => {
      name: any;
      logo: { name: string };
      id: number;
    }
  ): never[];
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ResTags {
  data: {
    map(
      arg0: (item: { name: string; id: number }) => { name: any; id: number }
    ): never[];
    id: number;
    attributes: {
      createdAt: string;
      name: string;
      type: string;
      projects: [];
      publishedAt: string;
      updatedAt: string;
    };
  };
}

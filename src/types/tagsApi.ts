export interface ResTags {
  data: {
    map(
      arg0: (item: { tag: string; id: number }) => { tag: any; id: number }
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

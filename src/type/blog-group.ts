export type CategoryModel = {
  id: number;
  name: string;
  postCnt: number;
  description: string | null;
  subGroups: {
    id: number;
    subGroupName: string;
    thumb: string | null;
    postCount: number;
  }[];
};

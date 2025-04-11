export type CategoryModel = {
  id: number;
  name: string;
  postCnt: number;
  subGroups: {
    id: number;
    subGroupName: string;
    thumb: string | null;
    postCount: number;
  }[];
};

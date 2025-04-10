export type CategoryModel = {
  id: number;
  name: string;
  postCnt: number;
  subGroups: {
    subGroupId: number;
    subGroupName: string;
    thumb: string | null;
    postCount: number;
  }[];
};

export type BlogGroupModel = {
  groupId: number;
  groupName: string;
  subGroups: {
    subGroupId: number;
    subGroupName: string;
    thumb: string | null;
  }[];
};

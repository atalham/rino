export type RootStackParamList = {
  Auth: undefined;
  ParentMain: undefined;
  ChildMain: undefined;
};

export type ParentTabParamList = {
  Tasks: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type ChildTabParamList = {
  MyTasks: undefined;
  Shop: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: { userType: "parent" };
  UserType: undefined;
};

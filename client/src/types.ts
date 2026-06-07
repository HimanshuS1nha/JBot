export type UserType = {
  id: string;
  name: string;
  email: string;
};

export type ConversationType = {
  id: string;
  title: string;
  createdAt: string;
};

export type MessageType = {
  id: string;
  role: "User" | "Assistant";
  content: string;
  createdAt: Date;
};

import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Base64: any;
  Date: any;
};

export type Connection = {
  edges: Array<Edge>;
  nodes: Array<Node>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Edge = {
  cursor: Scalars['Base64'];
  node?: Maybe<Node>;
};

export type Message = Node & {
  __typename?: 'Message';
  content: Scalars['String'];
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['Date']>;
  user?: Maybe<UserConnection>;
  village: VillageConnection;
};

export type MessageConnection = Connection & {
  __typename?: 'MessageConnection';
  edges: Array<MessageEdge>;
  nodes: Array<Message>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MessageEdge = Edge & {
  __typename?: 'MessageEdge';
  cursor: Scalars['Base64'];
  node: Message;
};

export type Mutation = {
  __typename?: 'Mutation';
  createMessage?: Maybe<Message>;
  createUser?: Maybe<User>;
  createVillage?: Maybe<Village>;
  deleteMessage?: Maybe<Message>;
  deleteUser?: Maybe<User>;
  deleteVillage?: Maybe<Village>;
  editMessage?: Maybe<Message>;
  editUser?: Maybe<User>;
  editVillage?: Maybe<Village>;
  leaveVillage?: Maybe<Village>;
};


export type MutationCreateMessageArgs = {
  content: Scalars['String'];
  villageId: Scalars['String'];
};


export type MutationCreateUserArgs = {
  firebaseToken: Scalars['String'];
};


export type MutationCreateVillageArgs = {
  description?: InputMaybe<Scalars['String']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVillageArgs = {
  villageId: Scalars['ID'];
};


export type MutationEditMessageArgs = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type MutationEditUserArgs = {
  id: Scalars['ID'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  username?: InputMaybe<Scalars['String']>;
};


export type MutationEditVillageArgs = {
  description?: InputMaybe<Scalars['String']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  villageId: Scalars['ID'];
};


export type MutationLeaveVillageArgs = {
  villageId?: InputMaybe<Scalars['ID']>;
};

export type Node = {
  id: Scalars['ID'];
};

export type NodesArgs = {
  __typename?: 'NodesArgs';
  after?: Maybe<Scalars['Base64']>;
  before?: Maybe<Scalars['Base64']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  reverse?: Maybe<Scalars['Boolean']>;
  sortKey?: Maybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['Base64']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Base64']>;
};

export type Query = {
  __typename?: 'Query';
  connect?: Maybe<Scalars['String']>;
  me: User;
  message: Message;
  messages: MessageConnection;
  user: User;
  users: UserConnection;
  village: Village;
  villages: VillageConnection;
};


export type QueryMessageArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['Base64']>;
  before?: InputMaybe<Scalars['Base64']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Base64']>;
  before?: InputMaybe<Scalars['Base64']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Scalars['String']>;
};


export type QueryVillageArgs = {
  id: Scalars['ID'];
};


export type QueryVillagesArgs = {
  after?: InputMaybe<Scalars['Base64']>;
  before?: InputMaybe<Scalars['Base64']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Scalars['String']>;
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['Date'];
  firebaseId: Scalars['String'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isAnonymous: Scalars['Boolean'];
  messages: MessageConnection;
  updatedAt?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
  villages: VillageConnection;
};


export type UserVillagesArgs = {
  after?: InputMaybe<Scalars['Base64']>;
  before?: InputMaybe<Scalars['Base64']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Scalars['String']>;
};

export type UserConnection = Connection & {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type UserEdge = Edge & {
  __typename?: 'UserEdge';
  cursor: Scalars['Base64'];
  node: User;
};

export type Village = Node & {
  __typename?: 'Village';
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  messages: MessageConnection;
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['Date']>;
  users: UserConnection;
};

export type VillageConnection = Connection & {
  __typename?: 'VillageConnection';
  edges: Array<VillageEdge>;
  nodes: Array<Village>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type VillageEdge = Edge & {
  __typename?: 'VillageEdge';
  cursor: Scalars['Base64'];
  node: Village;
};

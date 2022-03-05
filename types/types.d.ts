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
  Date: any;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String'];
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['Date']>;
  user?: Maybe<User>;
  village: Village;
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
  id: Scalars['ID'];
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
  id: Scalars['ID'];
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationLeaveVillageArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  connect?: Maybe<Scalars['String']>;
  getMe?: Maybe<User>;
  getMessageDetail?: Maybe<Message>;
  getMessages?: Maybe<Array<Message>>;
  getUserDetail?: Maybe<User>;
  getUsers?: Maybe<Array<User>>;
  getVillageDetail?: Maybe<Village>;
  getVillages?: Maybe<Array<Village>>;
};


export type QueryGetMessageDetailArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserDetailArgs = {
  id: Scalars['ID'];
};


export type QueryGetVillageDetailArgs = {
  villageId: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date'];
  firebaseId: Scalars['String'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isAnonymous: Scalars['Boolean'];
  messages?: Maybe<Array<Message>>;
  updatedAt?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
  villages?: Maybe<Array<Village>>;
};

export type Village = {
  __typename?: 'Village';
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  messages?: Maybe<Array<Message>>;
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['Date']>;
  users?: Maybe<Array<User>>;
};

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Base64: ResolverTypeWrapper<Scalars['Base64']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Connection: ResolversTypes['MessageConnection'] | ResolversTypes['UserConnection'] | ResolversTypes['VillageConnection'];
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Edge: ResolversTypes['MessageEdge'] | ResolversTypes['UserEdge'] | ResolversTypes['VillageEdge'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Message: ResolverTypeWrapper<Message>;
  MessageConnection: ResolverTypeWrapper<MessageConnection>;
  MessageEdge: ResolverTypeWrapper<MessageEdge>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Message'] | ResolversTypes['User'] | ResolversTypes['Village'];
  NodesArgs: ResolverTypeWrapper<NodesArgs>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  Village: ResolverTypeWrapper<Village>;
  VillageConnection: ResolverTypeWrapper<VillageConnection>;
  VillageEdge: ResolverTypeWrapper<VillageEdge>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Base64: Scalars['Base64'];
  Boolean: Scalars['Boolean'];
  Connection: ResolversParentTypes['MessageConnection'] | ResolversParentTypes['UserConnection'] | ResolversParentTypes['VillageConnection'];
  Date: Scalars['Date'];
  Edge: ResolversParentTypes['MessageEdge'] | ResolversParentTypes['UserEdge'] | ResolversParentTypes['VillageEdge'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Message: Message;
  MessageConnection: MessageConnection;
  MessageEdge: MessageEdge;
  Mutation: {};
  Node: ResolversParentTypes['Message'] | ResolversParentTypes['User'] | ResolversParentTypes['Village'];
  NodesArgs: NodesArgs;
  PageInfo: PageInfo;
  Query: {};
  String: Scalars['String'];
  User: User;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  Village: Village;
  VillageConnection: VillageConnection;
  VillageEdge: VillageEdge;
}>;

export interface Base64ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Base64'], any> {
  name: 'Base64';
}

export type ConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Connection'] = ResolversParentTypes['Connection']> = ResolversObject<{
  __resolveType: TypeResolveFn<'MessageConnection' | 'UserConnection' | 'VillageConnection', ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['Edge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Node']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = ResolversObject<{
  __resolveType: TypeResolveFn<'MessageEdge' | 'UserEdge' | 'VillageEdge', ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['Base64'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['UserConnection']>, ParentType, ContextType>;
  village?: Resolver<ResolversTypes['VillageConnection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageConnection'] = ResolversParentTypes['MessageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['MessageEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageEdge'] = ResolversParentTypes['MessageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Base64'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Message'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationCreateMessageArgs, 'content' | 'villageId'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'firebaseToken'>>;
  createVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, RequireFields<MutationCreateVillageArgs, 'name'>>;
  deleteMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationDeleteMessageArgs, 'id'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, RequireFields<MutationDeleteVillageArgs, 'villageId'>>;
  editMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationEditMessageArgs, 'id'>>;
  editUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationEditUserArgs, 'id'>>;
  editVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, RequireFields<MutationEditVillageArgs, 'villageId'>>;
  leaveVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, Partial<MutationLeaveVillageArgs>>;
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Message' | 'User' | 'Village', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type NodesArgsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodesArgs'] = ResolversParentTypes['NodesArgs']> = ResolversObject<{
  after?: Resolver<Maybe<ResolversTypes['Base64']>, ParentType, ContextType>;
  before?: Resolver<Maybe<ResolversTypes['Base64']>, ParentType, ContextType>;
  first?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  last?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reverse?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sortKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['Base64']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Base64']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  connect?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<QueryMessageArgs, 'id'>>;
  messages?: Resolver<ResolversTypes['MessageConnection'], ParentType, ContextType, Partial<QueryMessagesArgs>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryUsersArgs>>;
  village?: Resolver<ResolversTypes['Village'], ParentType, ContextType, RequireFields<QueryVillageArgs, 'id'>>;
  villages?: Resolver<ResolversTypes['VillageConnection'], ParentType, ContextType, Partial<QueryVillagesArgs>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  firebaseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isAnonymous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<ResolversTypes['MessageConnection'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  villages?: Resolver<ResolversTypes['VillageConnection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Base64'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VillageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Village'] = ResolversParentTypes['Village']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<ResolversTypes['MessageConnection'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VillageConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['VillageConnection'] = ResolversParentTypes['VillageConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['VillageEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Village']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VillageEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['VillageEdge'] = ResolversParentTypes['VillageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Base64'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Village'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Base64?: GraphQLScalarType;
  Connection?: ConnectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Edge?: EdgeResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessageConnection?: MessageConnectionResolvers<ContextType>;
  MessageEdge?: MessageEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NodesArgs?: NodesArgsResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  Village?: VillageResolvers<ContextType>;
  VillageConnection?: VillageConnectionResolvers<ContextType>;
  VillageEdge?: VillageEdgeResolvers<ContextType>;
}>;


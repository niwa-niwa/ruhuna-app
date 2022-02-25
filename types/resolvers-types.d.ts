import { GraphQLResolveInfo } from 'graphql';
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
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
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
  firebaseId: Scalars['ID'];
};


export type MutationCreateVillageArgs = {
  description?: InputMaybe<Scalars['String']>;
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

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  firebaseId: Scalars['String'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isAnonymous: Scalars['Boolean'];
  messages?: Maybe<Array<Message>>;
  updatedAt?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  villages?: Maybe<Array<Village>>;
};

export type Village = {
  __typename?: 'Village';
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  messages?: Maybe<Array<Message>>;
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  users?: Maybe<Array<User>>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  Village: ResolverTypeWrapper<Village>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Message: Message;
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  User: User;
  Village: Village;
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  village?: Resolver<ResolversTypes['Village'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationCreateMessageArgs, 'content' | 'villageId'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'firebaseId'>>;
  createVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, RequireFields<MutationCreateVillageArgs, 'name'>>;
  deleteMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationDeleteMessageArgs, 'id'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, RequireFields<MutationDeleteVillageArgs, 'id'>>;
  editMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationEditMessageArgs, 'id'>>;
  editUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationEditUserArgs, 'id'>>;
  editVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, RequireFields<MutationEditVillageArgs, 'id'>>;
  leaveVillage?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType, Partial<MutationLeaveVillageArgs>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  connect?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getMe?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getMessageDetail?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryGetMessageDetailArgs, 'id'>>;
  getMessages?: Resolver<Maybe<Array<ResolversTypes['Message']>>, ParentType, ContextType>;
  getUserDetail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserDetailArgs, 'id'>>;
  getUsers?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  getVillageDetail?: Resolver<Maybe<ResolversTypes['Village']>, ParentType, ContextType>;
  getVillages?: Resolver<Maybe<Array<ResolversTypes['Village']>>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firebaseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isAnonymous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<ResolversTypes['Message']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  villages?: Resolver<Maybe<Array<ResolversTypes['Village']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VillageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Village'] = ResolversParentTypes['Village']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<ResolversTypes['Message']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Village?: VillageResolvers<ContextType>;
}>;


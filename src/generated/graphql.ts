import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ActionFollowInput = {
  follow: Scalars['String']['input'];
  followed: Scalars['String']['input'];
};

export type Activity = {
  __typename?: 'Activity';
  action: Scalars['String']['output'];
  from: User;
  thread?: Maybe<Thread>;
  threadId: Scalars['String']['output'];
  timeStamp: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type CreateRepllyInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<Scalars['String']['input']>>;
  threadId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateThreadInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<Scalars['String']['input']>>;
  threadId?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type LikeInput = {
  threadId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createReplly?: Maybe<Thread>;
  createThread?: Maybe<Thread>;
  follow: Scalars['Boolean']['output'];
  like: Scalars['Boolean']['output'];
  registerUser?: Maybe<User>;
  unFollow: Scalars['Boolean']['output'];
  unLike: Scalars['Boolean']['output'];
};


export type MutationCreateRepllyArgs = {
  replly: CreateRepllyInput;
};


export type MutationCreateThreadArgs = {
  thread: CreateThreadInput;
};


export type MutationFollowArgs = {
  action: ActionFollowInput;
};


export type MutationLikeArgs = {
  action: LikeInput;
};


export type MutationRegisterUserArgs = {
  user: UserInput;
};


export type MutationUnFollowArgs = {
  action: ActionFollowInput;
};


export type MutationUnLikeArgs = {
  action: LikeInput;
};

export type Query = {
  __typename?: 'Query';
  activity?: Maybe<Array<Activity>>;
  getHomeThreads?: Maybe<Array<Thread>>;
  getThreads?: Maybe<Array<Thread>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryActivityArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetHomeThreadsArgs = {
  page: ThreadInput;
};


export type QueryGetThreadsArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Thread = {
  __typename?: 'Thread';
  _id: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  liked?: Maybe<Scalars['Boolean']['output']>;
  likes?: Maybe<Scalars['Int']['output']>;
  media?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
  replies?: Maybe<Thread>;
  thread?: Maybe<Thread>;
  threadId?: Maybe<Scalars['String']['output']>;
  timeStamp: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type ThreadInput = {
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  followers?: Maybe<Follow>;
  following?: Maybe<Follow>;
  image?: Maybe<Scalars['String']['output']>;
  isFollowing: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  thread?: Maybe<Array<Thread>>;
};


export type UserFollowersArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type UserIsFollowingArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Follow = {
  __typename?: 'follow';
  count: Scalars['Int']['output'];
  users?: Maybe<Array<User>>;
};

export type GetActivitiesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetActivitiesQuery = { __typename?: 'Query', activity?: Array<{ __typename?: 'Activity', timeStamp: string, action: string, to: string, thread?: { __typename?: 'Thread', _id: string, content?: string | null } | null, from: { __typename?: 'User', _id: string, name: string, image?: string | null, email: string } }> | null };

export type LikePostMutationVariables = Exact<{
  action: LikeInput;
}>;


export type LikePostMutation = { __typename?: 'Mutation', like: boolean };

export type UnlikeMutationVariables = Exact<{
  action: LikeInput;
}>;


export type UnlikeMutation = { __typename?: 'Mutation', unLike: boolean };

export type CreteRepllyMutationVariables = Exact<{
  replly: CreateRepllyInput;
}>;


export type CreteRepllyMutation = { __typename?: 'Mutation', createReplly?: { __typename?: 'Thread', _id: string, userId: string, name?: string | null, image?: string | null, content?: string | null } | null };

export type CreateThreadMutationVariables = Exact<{
  thread: CreateThreadInput;
}>;


export type CreateThreadMutation = { __typename?: 'Mutation', createThread?: { __typename?: 'Thread', _id: string, userId: string, content?: string | null, media?: Array<string> | null } | null };

export type GetHomeThreadsQueryVariables = Exact<{
  page: ThreadInput;
}>;


export type GetHomeThreadsQuery = { __typename?: 'Query', getHomeThreads?: Array<{ __typename?: 'Thread', _id: string, userId: string, name?: string | null, email?: string | null, image?: string | null, content?: string | null, media?: Array<string> | null, timeStamp: string, likes?: number | null, liked?: boolean | null, thread?: { __typename?: 'Thread', userId: string, name?: string | null, email?: string | null, image?: string | null, content?: string | null, media?: Array<string> | null, timeStamp: string, likes?: number | null, liked?: boolean | null } | null }> | null };

export type GetUsersQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GetUsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', _id: string, name: string, image?: string | null, email: string }> | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', _id: string, name: string, image?: string | null, bio?: string | null, email: string, isFollowing: boolean, following?: { __typename?: 'follow', count: number } | null, followers?: { __typename?: 'follow', count: number } | null, thread?: Array<{ __typename?: 'Thread', _id: string, userId: string, media?: Array<string> | null, timeStamp: string, content?: string | null, likes?: number | null, liked?: boolean | null, thread?: { __typename?: 'Thread', name?: string | null, email?: string | null, image?: string | null, content?: string | null, media?: Array<string> | null, timeStamp: string, likes?: number | null, liked?: boolean | null } | null }> | null } | null };

export type RegisterUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'User', name: string, email: string, image?: string | null } | null };

export type FollowUserMutationVariables = Exact<{
  action: ActionFollowInput;
}>;


export type FollowUserMutation = { __typename?: 'Mutation', follow: boolean };

export type UnfollowUserMutationVariables = Exact<{
  action: ActionFollowInput;
}>;


export type UnfollowUserMutation = { __typename?: 'Mutation', unFollow: boolean };


export const GetActivitiesDocument = gql`
    query getActivities($userId: ID!) {
  activity(userId: $userId) {
    timeStamp
    action
    to
    thread {
      _id
      content
    }
    from {
      _id
      name
      image
      email
    }
  }
}
    `;
export const LikePostDocument = gql`
    mutation likePost($action: LikeInput!) {
  like(action: $action)
}
    `;
export const UnlikeDocument = gql`
    mutation unlike($action: LikeInput!) {
  unLike(action: $action)
}
    `;
export const CreteRepllyDocument = gql`
    mutation creteReplly($replly: CreateRepllyInput!) {
  createReplly(replly: $replly) {
    _id
    userId
    name
    image
    content
  }
}
    `;
export const CreateThreadDocument = gql`
    mutation createThread($thread: CreateThreadInput!) {
  createThread(thread: $thread) {
    _id
    userId
    content
    media
  }
}
    `;
export const GetHomeThreadsDocument = gql`
    query getHomeThreads($page: ThreadInput!) {
  getHomeThreads(page: $page) {
    _id
    userId
    name
    email
    image
    content
    media
    timeStamp
    likes
    liked
    thread {
      userId
      name
      email
      image
      content
      media
      timeStamp
      likes
      liked
    }
  }
}
    `;
export const GetUsersDocument = gql`
    query getUsers($name: String!) {
  users(name: $name) {
    _id
    name
    image
    email
  }
}
    `;
export const GetUserDocument = gql`
    query getUser($id: ID!, $userId: ID) {
  user(id: $id, userId: $userId) {
    _id
    name
    image
    bio
    email
    following {
      count
    }
    followers(userId: $userId) {
      count
    }
    isFollowing(userId: $userId)
    thread {
      _id
      userId
      media
      timeStamp
      content
      likes
      liked
      thread {
        name
        email
        image
        content
        media
        timeStamp
        likes
        liked
      }
    }
  }
}
    `;
export const RegisterUserDocument = gql`
    mutation registerUser($user: UserInput!) {
  registerUser(user: $user) {
    name
    email
    image
  }
}
    `;
export const FollowUserDocument = gql`
    mutation followUser($action: ActionFollowInput!) {
  follow(action: $action)
}
    `;
export const UnfollowUserDocument = gql`
    mutation unfollowUser($action: ActionFollowInput!) {
  unFollow(action: $action)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getActivities(variables: GetActivitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetActivitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActivitiesQuery>(GetActivitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getActivities', 'query');
    },
    likePost(variables: LikePostMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LikePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LikePostMutation>(LikePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'likePost', 'mutation');
    },
    unlike(variables: UnlikeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UnlikeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnlikeMutation>(UnlikeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unlike', 'mutation');
    },
    creteReplly(variables: CreteRepllyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreteRepllyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreteRepllyMutation>(CreteRepllyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'creteReplly', 'mutation');
    },
    createThread(variables: CreateThreadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateThreadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateThreadMutation>(CreateThreadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createThread', 'mutation');
    },
    getHomeThreads(variables: GetHomeThreadsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetHomeThreadsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetHomeThreadsQuery>(GetHomeThreadsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getHomeThreads', 'query');
    },
    getUsers(variables: GetUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUsersQuery>(GetUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUsers', 'query');
    },
    getUser(variables: GetUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserQuery>(GetUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUser', 'query');
    },
    registerUser(variables: RegisterUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RegisterUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterUserMutation>(RegisterUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'registerUser', 'mutation');
    },
    followUser(variables: FollowUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FollowUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FollowUserMutation>(FollowUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'followUser', 'mutation');
    },
    unfollowUser(variables: UnfollowUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UnfollowUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnfollowUserMutation>(UnfollowUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unfollowUser', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
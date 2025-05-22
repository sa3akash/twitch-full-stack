import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AuthModel = {
  __typename?: 'AuthModel';
  message?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserModel>;
};

export type CategoryModel = {
  __typename?: 'CategoryModel';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  streams: Array<StreamModel>;
  thumbnailUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
};

export type ChangeNotificationsSettingsInput = {
  siteNotifications: Scalars['Boolean']['input'];
  telegramNotifications: Scalars['Boolean']['input'];
};

export type ChangeNotificationsSettingsResponse = {
  __typename?: 'ChangeNotificationsSettingsResponse';
  notificationSettings: NotificationSettingsModel;
  telegramAuthToken?: Maybe<Scalars['String']['output']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangeProfileInfoInput = {
  bio: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ChangeSettingsInput = {
  isChatEnabled: Scalars['Boolean']['input'];
  isChatFollowersOnly: Scalars['Boolean']['input'];
  isChatPremiumFollowersOnly: Scalars['Boolean']['input'];
};

export type ChangeStreamInfoInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type ChatMessageModel = {
  __typename?: 'ChatMessageModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  stream: StreamModel;
  streamId: Scalars['String']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeactivateInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type DeviceModel = {
  __typename?: 'DeviceModel';
  browser: Scalars['String']['output'];
  os: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type FiltersInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};

export type FollowModel = {
  __typename?: 'FollowModel';
  createdAt: Scalars['DateTime']['output'];
  follower: UserModel;
  followerId: Scalars['String']['output'];
  following: UserModel;
  followingId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GenerateStreamTokenInput = {
  channelId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type GenerateTokenStreamModel = {
  __typename?: 'GenerateTokenStreamModel';
  token: Scalars['String']['output'];
};

export type LocationModel = {
  __typename?: 'LocationModel';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latidute: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeAvater: Scalars['Boolean']['output'];
  changeChatSettings: Scalars['Boolean']['output'];
  changeEmail: Scalars['Boolean']['output'];
  changeNotificationsSettings: ChangeNotificationsSettingsResponse;
  changePassword: Scalars['Boolean']['output'];
  changeProfileInfo: Scalars['Boolean']['output'];
  changeStreamInfo: Scalars['Boolean']['output'];
  changeStreamThumbnail: Scalars['Boolean']['output'];
  clearSessionsCookie: Scalars['Boolean']['output'];
  createIngress: Scalars['Boolean']['output'];
  createSocialLink: Scalars['Boolean']['output'];
  createUser: Scalars['Boolean']['output'];
  deactivate: AuthModel;
  enabledTotp: Scalars['Boolean']['output'];
  followChannel: Scalars['Boolean']['output'];
  generateStreamToken: GenerateTokenStreamModel;
  login: AuthModel;
  logout: Scalars['Boolean']['output'];
  newPassword: Scalars['Boolean']['output'];
  removeAvater: Scalars['Boolean']['output'];
  removeSession: Scalars['Boolean']['output'];
  removeSocialLink: Scalars['Boolean']['output'];
  removeStreamThumbnail: Scalars['Boolean']['output'];
  reorderSocialLinkArray: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  sendChatMessage: ChatMessageModel;
  unfollowChannel: Scalars['Boolean']['output'];
  updateSocialLink: Scalars['Boolean']['output'];
  verifyAccount: UserModel;
};


export type MutationChangeAvaterArgs = {
  avatar: Scalars['Upload']['input'];
};


export type MutationChangeChatSettingsArgs = {
  data: ChangeSettingsInput;
};


export type MutationChangeEmailArgs = {
  data: ChangeEmailInput;
};


export type MutationChangeNotificationsSettingsArgs = {
  data: ChangeNotificationsSettingsInput;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationChangeProfileInfoArgs = {
  data: ChangeProfileInfoInput;
};


export type MutationChangeStreamInfoArgs = {
  data: ChangeStreamInfoInput;
};


export type MutationChangeStreamThumbnailArgs = {
  thumbnail: Scalars['Upload']['input'];
};


export type MutationCreateIngressArgs = {
  ingressType: Scalars['Float']['input'];
};


export type MutationCreateSocialLinkArgs = {
  data: SocialLinkInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeactivateArgs = {
  data: DeactivateInput;
};


export type MutationEnabledTotpArgs = {
  data: TotpInput;
};


export type MutationFollowChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type MutationGenerateStreamTokenArgs = {
  data: GenerateStreamTokenInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationNewPasswordArgs = {
  data: NewPasswordInput;
};


export type MutationRemoveSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSocialLinkArgs = {
  id: Scalars['String']['input'];
};


export type MutationReorderSocialLinkArrayArgs = {
  list: Array<SocialLinkOrderInput>;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationSendChatMessageArgs = {
  data: SendMessageInput;
};


export type MutationUnfollowChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type MutationUpdateSocialLinkArgs = {
  data: SocialLinkInput;
  id: Scalars['String']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerificationInput;
};

export type NewPasswordInput = {
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type NotificationModel = {
  __typename?: 'NotificationModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type NotificationSettingsModel = {
  __typename?: 'NotificationSettingsModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  siteNotifications: Scalars['Boolean']['output'];
  telegramNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export enum NotificationType {
  EnableTwoFactor = 'ENABLE_TWO_FACTOR',
  NewFollower = 'NEW_FOLLOWER',
  NewSponsorship = 'NEW_SPONSORSHIP',
  StreamStart = 'STREAM_START',
  VerifiedChannel = 'VERIFIED_CHANNEL'
}

export type Query = {
  __typename?: 'Query';
  disabledTotp: Scalars['Boolean']['output'];
  findAllCategories: Array<CategoryModel>;
  findAllStream: Array<StreamModel>;
  findCategoryBySlug: CategoryModel;
  findChannelByUsername: UserModel;
  findCurrentSession: SessionModel;
  findFollowersCountByChannel: Scalars['Float']['output'];
  findMessagesByStreamId: Array<ChatMessageModel>;
  findMyFollowers: Array<FollowModel>;
  findMyFollowings: Array<FollowModel>;
  findNotificationsByUser: Array<NotificationModel>;
  findNotificationsUnreadCount: Scalars['Float']['output'];
  findProfile: UserModel;
  findRandomCategory: Array<CategoryModel>;
  findRandomStreams: Array<StreamModel>;
  findRecommendedChannels: Array<UserModel>;
  findSessionByUser: Array<SessionModel>;
  generateOtpSecret: TotpModel;
  getSocialLink: Array<SocialLinkModel>;
  sendDeactivateEmail: Scalars['Boolean']['output'];
};


export type QueryFindAllStreamArgs = {
  filters: FiltersInput;
};


export type QueryFindCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryFindChannelByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryFindFollowersCountByChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryFindMessagesByStreamIdArgs = {
  streamId: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
};

export type SendMessageInput = {
  streamId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type SessionMetadataModel = {
  __typename?: 'SessionMetadataModel';
  device: DeviceModel;
  ip: Scalars['String']['output'];
  location: LocationModel;
};

export type SessionModel = {
  __typename?: 'SessionModel';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata: SessionMetadataModel;
  userId: Scalars['String']['output'];
};

export type SocialLinkInput = {
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type SocialLinkModel = {
  __typename?: 'SocialLinkModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type SocialLinkOrderInput = {
  id: Scalars['String']['input'];
  position: Scalars['Float']['input'];
};

export type StreamModel = {
  __typename?: 'StreamModel';
  category: CategoryModel;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ingressId?: Maybe<Scalars['String']['output']>;
  isChatEnabled: Scalars['Boolean']['output'];
  isChatFollowersOnly: Scalars['Boolean']['output'];
  isChatPremiumFollowersOnly: Scalars['Boolean']['output'];
  isLive: Scalars['Boolean']['output'];
  serverUrl?: Maybe<Scalars['String']['output']>;
  streamKey?: Maybe<Scalars['String']['output']>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  chatMessageAdded: ChatMessageModel;
};


export type SubscriptionChatMessageAddedArgs = {
  streamId: Scalars['String']['input'];
};

export type TotpInput = {
  pin: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type TotpModel = {
  __typename?: 'TOTPModel';
  qrcodeUrl: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type UserModel = {
  __typename?: 'UserModel';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deactivatedAt?: Maybe<Scalars['DateTime']['output']>;
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  followers: Array<FollowModel>;
  followings: Array<FollowModel>;
  id: Scalars['ID']['output'];
  isDeactivated: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  isTotpEnabled: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  notificationSettings: NotificationSettingsModel;
  notifications: Array<NotificationModel>;
  socialLinks: Array<SocialLinkModel>;
  stream: StreamModel;
  telegramId?: Maybe<Scalars['String']['output']>;
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type VerificationInput = {
  token: Scalars['String']['input'];
};

export type FindChannelByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type FindChannelByUsernameQuery = { __typename?: 'Query', findChannelByUsername: { __typename?: 'UserModel', id: string, username: string, displayName: string, avatar?: string | null, bio?: string | null, isVerified: boolean, socialLinks: Array<{ __typename?: 'SocialLinkModel', title: string, url: string }>, stream: { __typename?: 'StreamModel', id: string, title: string, thumbnailUrl?: string | null, isLive: boolean, isChatEnabled: boolean, isChatFollowersOnly: boolean, isChatPremiumFollowersOnly: boolean, category: { __typename?: 'CategoryModel', id: string, title: string } }, followings: Array<{ __typename?: 'FollowModel', id: string }> } };

export type FindAllStreamsQueryVariables = Exact<{
  filters: FiltersInput;
}>;


export type FindAllStreamsQuery = { __typename?: 'Query', findAllStream: Array<{ __typename?: 'StreamModel', title: string, thumbnailUrl?: string | null, isLive: boolean, user: { __typename?: 'UserModel', username: string, avatar?: string | null, isVerified: boolean }, category: { __typename?: 'CategoryModel', title: string, slug: string } }> };


export const FindChannelByUsernameDocument = gql`
    query FindChannelByUsername($username: String!) {
  findChannelByUsername(username: $username) {
    id
    username
    displayName
    avatar
    bio
    isVerified
    socialLinks {
      title
      url
    }
    stream {
      id
      title
      thumbnailUrl
      isLive
      isChatEnabled
      isChatFollowersOnly
      isChatPremiumFollowersOnly
      category {
        id
        title
      }
    }
    followings {
      id
    }
  }
}
    `;

/**
 * __useFindChannelByUsernameQuery__
 *
 * To run a query within a React component, call `useFindChannelByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindChannelByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindChannelByUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFindChannelByUsernameQuery(baseOptions: Apollo.QueryHookOptions<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables> & ({ variables: FindChannelByUsernameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables>(FindChannelByUsernameDocument, options);
      }
export function useFindChannelByUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables>(FindChannelByUsernameDocument, options);
        }
export function useFindChannelByUsernameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables>(FindChannelByUsernameDocument, options);
        }
export type FindChannelByUsernameQueryHookResult = ReturnType<typeof useFindChannelByUsernameQuery>;
export type FindChannelByUsernameLazyQueryHookResult = ReturnType<typeof useFindChannelByUsernameLazyQuery>;
export type FindChannelByUsernameSuspenseQueryHookResult = ReturnType<typeof useFindChannelByUsernameSuspenseQuery>;
export type FindChannelByUsernameQueryResult = Apollo.QueryResult<FindChannelByUsernameQuery, FindChannelByUsernameQueryVariables>;
export const FindAllStreamsDocument = gql`
    query FindAllStreams($filters: FiltersInput!) {
  findAllStream(filters: $filters) {
    title
    thumbnailUrl
    isLive
    user {
      username
      avatar
      isVerified
    }
    category {
      title
      slug
    }
  }
}
    `;

/**
 * __useFindAllStreamsQuery__
 *
 * To run a query within a React component, call `useFindAllStreamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllStreamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllStreamsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useFindAllStreamsQuery(baseOptions: Apollo.QueryHookOptions<FindAllStreamsQuery, FindAllStreamsQueryVariables> & ({ variables: FindAllStreamsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllStreamsQuery, FindAllStreamsQueryVariables>(FindAllStreamsDocument, options);
      }
export function useFindAllStreamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllStreamsQuery, FindAllStreamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllStreamsQuery, FindAllStreamsQueryVariables>(FindAllStreamsDocument, options);
        }
export function useFindAllStreamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllStreamsQuery, FindAllStreamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllStreamsQuery, FindAllStreamsQueryVariables>(FindAllStreamsDocument, options);
        }
export type FindAllStreamsQueryHookResult = ReturnType<typeof useFindAllStreamsQuery>;
export type FindAllStreamsLazyQueryHookResult = ReturnType<typeof useFindAllStreamsLazyQuery>;
export type FindAllStreamsSuspenseQueryHookResult = ReturnType<typeof useFindAllStreamsSuspenseQuery>;
export type FindAllStreamsQueryResult = Apollo.QueryResult<FindAllStreamsQuery, FindAllStreamsQueryVariables>;
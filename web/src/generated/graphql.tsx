import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
}

export type FieldError = {
	__typename?: 'FieldError'
	field: Scalars['String']
	message: Scalars['String']
}

export type LoginInputs = {
	password: Scalars['String']
	usernameOrEmail: Scalars['String']
}

export type Mutation = {
	__typename?: 'Mutation'
	createPost?: Maybe<Posts>
	deletePost: Scalars['Boolean']
	forgotPassword: Scalars['Boolean']
	login: UserResponse
	logout: Scalars['Boolean']
	register: UserResponse
	updatePost?: Maybe<Posts>
}

export type MutationCreatePostArgs = {
	title: Scalars['String']
}

export type MutationDeletePostArgs = {
	id: Scalars['Float']
}

export type MutationForgotPasswordArgs = {
	email: Scalars['String']
}

export type MutationLoginArgs = {
	options: LoginInputs
}

export type MutationRegisterArgs = {
	options: RegisterInputs
}

export type MutationUpdatePostArgs = {
	id: Scalars['Float']
	title?: InputMaybe<Scalars['String']>
}

export type Posts = {
	__typename?: 'Posts'
	createdAt: Scalars['String']
	id: Scalars['Int']
	title: Scalars['String']
	updatedAt: Scalars['String']
}

export type Query = {
	__typename?: 'Query'
	hello: Scalars['String']
	me?: Maybe<Users>
	post?: Maybe<Posts>
	posts: Array<Posts>
}

export type QueryPostArgs = {
	id: Scalars['Int']
}

export type RegisterInputs = {
	email: Scalars['String']
	password: Scalars['String']
	username: Scalars['String']
}

export type UserResponse = {
	__typename?: 'UserResponse'
	errors?: Maybe<Array<FieldError>>
	user?: Maybe<Users>
}

export type Users = {
	__typename?: 'Users'
	createdAt: Scalars['String']
	email: Scalars['String']
	id: Scalars['Float']
	updatedAt: Scalars['String']
	username: Scalars['String']
}

export type UserPropertiesFragment = {
	__typename?: 'Users'
	id: number
	username: string
}

export type LoginMutationVariables = Exact<{
	options: LoginInputs
}>

export type LoginMutation = {
	__typename?: 'Mutation'
	login: {
		__typename?: 'UserResponse'
		errors?: Array<{
			__typename?: 'FieldError'
			field: string
			message: string
		}> | null
		user?: {
			__typename?: 'Users'
			id: number
			username: string
		} | null
	}
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = {
	__typename?: 'Mutation'
	logout: boolean
}

export type RegisterMutationVariables = Exact<{
	options: RegisterInputs
}>

export type RegisterMutation = {
	__typename?: 'Mutation'
	register: {
		__typename?: 'UserResponse'
		errors?: Array<{
			__typename?: 'FieldError'
			field: string
			message: string
		}> | null
		user?: {
			__typename?: 'Users'
			id: number
			username: string
			email: string
		} | null
	}
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
	__typename?: 'Query'
	me?: { __typename?: 'Users'; id: number; username: string } | null
}

export type PostsQueryVariables = Exact<{ [key: string]: never }>

export type PostsQuery = {
	__typename?: 'Query'
	posts: Array<{
		__typename?: 'Posts'
		id: number
		createdAt: string
		updatedAt: string
		title: string
	}>
}

export const UserPropertiesFragmentDoc = gql`
	fragment UserProperties on Users {
		id
		username
	}
`
export const LoginDocument = gql`
	mutation Login($options: LoginInputs!) {
		login(options: $options) {
			errors {
				field
				message
			}
			user {
				...UserProperties
			}
		}
	}
	${UserPropertiesFragmentDoc}
`

export function useLoginMutation() {
	return Urql.useMutation<LoginMutation, LoginMutationVariables>(
		LoginDocument,
	)
}
export const LogoutDocument = gql`
	mutation Logout {
		logout
	}
`

export function useLogoutMutation() {
	return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
		LogoutDocument,
	)
}
export const RegisterDocument = gql`
	mutation Register($options: RegisterInputs!) {
		register(options: $options) {
			errors {
				field
				message
			}
			user {
				id
				username
				email
			}
		}
	}
`

export function useRegisterMutation() {
	return Urql.useMutation<
		RegisterMutation,
		RegisterMutationVariables
	>(RegisterDocument)
}
export const MeDocument = gql`
	query Me {
		me {
			...UserProperties
		}
	}
	${UserPropertiesFragmentDoc}
`

export function useMeQuery(
	options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>,
) {
	return Urql.useQuery<MeQuery>({ query: MeDocument, ...options })
}
export const PostsDocument = gql`
	query Posts {
		posts {
			id
			createdAt
			updatedAt
			title
		}
	}
`

export function usePostsQuery(
	options?: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>,
) {
	return Urql.useQuery<PostsQuery>({
		query: PostsDocument,
		...options,
	})
}

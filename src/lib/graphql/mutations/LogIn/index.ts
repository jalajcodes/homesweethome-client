import { gql } from '@apollo/client';

export const LOG_IN = gql`
	mutation LogIn($input: LogInInput) {
		login(input: $input) {
			id
			token
			avatar
			hasWallet
			didRequest
		}
	}
`;

export const GUEST_LOGIN = gql`
	mutation GuestLogin {
		loginAsGuest {
			id
			token
			avatar
			hasWallet
			didRequest
		}
	}
`;

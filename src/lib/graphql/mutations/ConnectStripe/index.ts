import { gql } from '@apollo/client';

export const CONNECT_STRIPE = gql`
	mutation ConnectStripe($input: StripeConnectInput!) {
		stripeConnect(input: $input) {
			hasWallet
		}
	}
`;

import { gql } from '@apollo/client';

export const DELETE_LISTING = gql`
	mutation DeleteListing($input: DeleteListingInput!) {
		deleteListing(input: $input) {
			id
		}
	}
`;

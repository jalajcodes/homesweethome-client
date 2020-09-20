import { gql } from '@apollo/client';

export const EDIT_LISTING = gql`
	query EditListing($id: ID!) {
		listing(id: $id) {
			id
			title
			description
			image
			type
			address
			city
			price
			numOfGuests
			host {
				id
			}
		}
	}
`;

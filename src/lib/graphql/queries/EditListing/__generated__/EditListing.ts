/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingType } from './../../../globalTypes';

// ====================================================
// GraphQL query operation: EditListing
// ====================================================

export interface EditListing_listing_host {
	__typename: 'User';
	id: string;
}

export interface EditListing_listing {
	__typename: 'Listing';
	id: string;
	title: string;
	description: string;
	image: string;
	type: ListingType;
	address: string;
	city: string;
	price: number;
	numOfGuests: number;
	host: EditListing_listing_host;
}

export interface EditListing {
	listing: EditListing_listing;
}

export interface EditListingVariables {
	id: string;
}

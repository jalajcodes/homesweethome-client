/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteListingInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteListing
// ====================================================

export interface DeleteListing_deleteListing {
  __typename: "Listing";
  id: string;
}

export interface DeleteListing {
  deleteListing: DeleteListing_deleteListing;
}

export interface DeleteListingVariables {
  input: DeleteListingInput;
}

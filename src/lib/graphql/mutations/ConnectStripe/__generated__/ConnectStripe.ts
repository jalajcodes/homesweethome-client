/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StripeConnectInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: ConnectStripe
// ====================================================

export interface ConnectStripe_stripeConnect {
  __typename: "Viewer";
  hasWallet: boolean | null;
}

export interface ConnectStripe {
  stripeConnect: ConnectStripe_stripeConnect;
}

export interface ConnectStripeVariables {
  input: StripeConnectInput;
}

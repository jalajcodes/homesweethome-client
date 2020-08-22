/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: GuestLogin
// ====================================================

export interface GuestLogin_loginAsGuest {
  __typename: "Viewer";
  id: string | null;
  token: string | null;
  avatar: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}

export interface GuestLogin {
  loginAsGuest: GuestLogin_loginAsGuest;
}

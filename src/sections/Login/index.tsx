import React, { useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Layout, Typography, Card, Spin } from 'antd';
import { UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { AUTH_URL } from '../../lib/graphql/queries';
import { LOG_IN, GUEST_LOGIN } from '../../lib/graphql/mutations';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import {
	LogIn as LogInData,
	LogInVariables,
} from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import { GuestLogin as GuestLoginData } from '../../lib/graphql/mutations/LogIn/__generated__/GuestLogin';
// import googleLogo from './assets/google_logo.jpg';
import { ErrorBanner } from '../../lib/components';
import { displayErrorMessage, displaySuccessNotification } from '../../lib/utils';
import useViewerState from '../../lib/context/useViewerState';

// interface Props {
// 	setViewer: (viewer: Viewer) => void;
// }

export const Login = () => {
	const { setViewer } = useViewerState();

	const [authQuery, { data: authQueryData, error: authQueryError }] = useLazyQuery<AuthUrlData>(
		AUTH_URL
	);
	const [logInMutaion, { loading: logInLoading, error: logInError, data: logInData }] = useMutation<
		LogInData,
		LogInVariables
	>(LOG_IN, {
		onCompleted: (data) => {
			if (data && data.login && data.login.token) {
				setViewer(data.login);
				sessionStorage.setItem('token', data.login.token);
				displaySuccessNotification("You've been successfully logged in!");
			}
		},
	});
	const [
		guestLoginMutation,
		{ loading: guestLoading, error: guestError, data: guestData },
	] = useMutation<GuestLoginData>(GUEST_LOGIN, {
		onCompleted: (data) => {
			if (data && data.loginAsGuest && data.loginAsGuest.token) {
				setViewer(data.loginAsGuest);
				sessionStorage.setItem('token', data.loginAsGuest.token);
				displaySuccessNotification(
					'Successfully logged in as a Test User!',
					"This account has only viewer rights, you can host a listing but you won't be able to book a listing from this account. To book a listing, logout and then login from a different account. ",
					60
				);
			}
		},
	});

	// if query for auth url is successful, redirect.
	if (authQueryData) {
		window.location.href = authQueryData.authUrl;
	}
	if (authQueryError) {
		displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!");
	}

	// just to make useEffect believe logInMutation won't change during rerenders.
	const logInRef = useRef(logInMutaion);

	// after being redirected back from google consent form if
	// the code param exists in the url, this useEffect hook will run
	// the login mutation with the code variable, our backend uses this
	// code to fetch details of the user.
	useEffect(() => {
		const code = new URL(window.location.href).searchParams.get('code');
		if (code) {
			logInRef.current({
				variables: {
					input: { code },
				},
			});
		}
	}, []);

	// Ant design components
	const { Content } = Layout;
	const { Title, Text } = Typography;

	if (logInLoading || guestLoading) {
		return (
			<Content className="log-in">
				<Spin size="large" tip="Logging you in..."></Spin>
			</Content>
		);
	}

	if (logInData && logInData.login) {
		const { id } = logInData.login;
		return <Redirect to={`/user/${id}`} />;
	}

	if (guestData && guestData.loginAsGuest) {
		const { id } = guestData.loginAsGuest;
		return <Redirect to={`/user/${id}`} />;
	}

	const logInErrorBannerElement =
		logInError || guestError ? (
			<ErrorBanner description="We weren't able to log you in. Please try again soon." />
		) : null;

	return (
		<Content className="log-in">
			{logInErrorBannerElement}
			<Card className="log-in-card">
				<div className="log-in-card__intro">
					<Title level={3} className="log-in-card__intro-title">
						<span role="img" aria-label="wave">
							👋
						</span>
					</Title>
					<Title level={3} className="log-in-card__intro-title">
						Log in to HomeSweetHome!
					</Title>
					<Text>Sign In to start booking available rentals!</Text>
				</div>
				<button className="log-in-card__google-button" onClick={() => authQuery()}>
					{/* <img src={googleLogo} alt="Google Logo" className="log-in-card__google-button-logo" /> */}
					<div className="login-col-1">
						<GoogleOutlined />
					</div>
					<div className="login-col-2">
						<span className="log-in-card__google-button-text">Sign in with Google</span>
					</div>
				</button>
				<button
					className="log-in-card__google-button guestLogin"
					onClick={() => guestLoginMutation()}>
					<div className="login-col-1">
						<UserOutlined />
					</div>
					<div className="login-col-2">
						<span className="log-in-card__google-button-text">Sign in as Guest</span>
					</div>
				</button>
				<Text type="secondary">
					Note: By signing in, you'll be redirected to the consent form to sign in with your
					account.
				</Text>
			</Card>
		</Content>
	);
};

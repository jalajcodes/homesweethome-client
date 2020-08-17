import React, { useEffect, useRef, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Layout, Typography, Card, Spin } from 'antd';
// import { Viewer } from '../../lib/types';
import { AUTH_URL } from '../../lib/graphql/queries';
import { LOG_IN } from '../../lib/graphql/mutations';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { LogIn as LogInData, LogInVariables } from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import googleLogo from './assets/google_logo.jpg';
import { ErrorBanner } from '../../lib/components';
import { displayErrorMessage, displaySuccessNotification } from '../../lib/utils';
import ViewerStateContext from '../../ViewerStateContext';

// interface Props {
// 	setViewer: (viewer: Viewer) => void;
// }

export const Login = () => {
	const state = useContext(ViewerStateContext);
	const setViewer = state!.setViewer;

	const [authQuery, { data: authQueryData, error: authQueryError }] = useLazyQuery<AuthUrlData>(AUTH_URL);
	const [logInMutaion, { loading: logInLoading, error: logInError, data: logInData }] = useMutation<
		LogInData,
		LogInVariables
	>(LOG_IN, {
		onCompleted: (data) => {
			if (data && data.login && data.login.token) {
				setViewer(data.login);
				sessionStorage.setItem('token', data.login.token);
				displaySuccessNotification("You've successfully logged in!");
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

	if (logInLoading) {
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

	const logInErrorBannerElement = logInError ? (
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
					<Text>Sign in with Google to start booking available rentals!</Text>
				</div>
				<button className="log-in-card__google-button" onClick={() => authQuery()}>
					<img src={googleLogo} alt="Google Logo" className="log-in-card__google-button-logo" />
					<span className="log-in-card__google-button-text">Sign in with Google</span>
				</button>
				<Text type="secondary">
					Note: By signing in, you'll be redirected to the Google consent form to sign in with your Google
					account.
				</Text>
			</Card>
		</Content>
	);
};

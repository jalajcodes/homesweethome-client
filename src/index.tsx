import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOG_IN } from './lib/graphql/mutations/LogIn';
import { LogIn as LogInData, LogInVariables } from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import { Layout, Affix, Spin } from 'antd';
import { Viewer } from './lib/types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ViewerStateContext from '../src/lib/context/ViewerStateContext';
import * as serviceWorker from './serviceWorker';
import './styles/index.less';

// Components
import { AppHeader, Home, User, Listings, Listing, Host, NotFound, Login, Stripe, EditListing } from './sections';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';

// check apollo docs for more info about this snippet
const authLink = setContext((_, { headers }) => {
	// get the authentication token from session storage if it exists
	const token = sessionStorage.getItem('token');
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			'X-CSRF-TOKEN': token || '',
		},
	};
});

const httpLink = createHttpLink({
	uri: 'https://hsh-server.herokuapp.com/api',
	credentials: 'include',
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

const initialViewerState: Viewer = {
	id: null,
	token: null,
	avatar: null,
	hasWallet: null,
	didRequest: false,
};

const App = () => {
	const [viewer, setViewer] = useState<Viewer>(initialViewerState);
	const stripePromise = loadStripe(process.env.REACT_APP_S_PUBLISHABLE_KEY as string);

	const [login, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
		onCompleted: (data) => {
			if (data && data.login) {
				setViewer(data.login);

				if (data.login.token) {
					sessionStorage.setItem('token', data.login.token);
				} else {
					sessionStorage.removeItem('token');
				}
			}
		},
	});

	const loginRef = useRef(login);

	useEffect(() => {
		loginRef.current();
	}, []);

	const loginErrorBanner = error ? (
		<ErrorBanner message="Something went wrong while you were being logged in. Please try again later! ;(" />
	) : null;

	if (!viewer.didRequest && !error) {
		return (
			<Layout className="app-skeleton">
				<AppHeaderSkeleton />
				<div className="app-skeleton__spin-section">
					<Spin size="large" tip="Launching the App..." />
				</div>
			</Layout>
		);
	}
	return (
		<ViewerStateContext.Provider value={{ viewer, setViewer }}>
			<Router>
				<Layout id="app">
					{loginErrorBanner}
					<Affix offsetTop={0} className="app__affix-header">
						<div>
							<AppHeader />
						</div>
					</Affix>
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route exact path="/host">
							<Host />
						</Route>
						<Route exact path="/listing/:id">
							<Elements stripe={stripePromise}>
								<Listing />
							</Elements>
						</Route>
						<Route exact path="/listing/:id/edit">
							<EditListing />
						</Route>
						<Route exact path="/listings/:location?">
							<Listings />
						</Route>
						<Route exact path="/login">
							<Login />
						</Route>
						<Route exact path="/user/:id/">
							<User />
						</Route>
						<Route exact path={['/user/:id/', '/user/:id/listings', '/user/:id/bookings']}>
							<User /> {/* User components handles the ".../listings" & ".../bookings" routes */}
						</Route>
						<Route exact path="/stripe">
							<Stripe />
						</Route>
						<Route>
							<NotFound />
						</Route>
					</Switch>
				</Layout>
			</Router>
		</ViewerStateContext.Provider>
	);
};

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

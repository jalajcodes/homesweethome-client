import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';
import { Layout, Affix } from 'antd';
import { Viewer } from './lib/types';

// Components
import { AppHeader, Home, User, Listings, Listing, Host, NotFound, Login } from './sections';

const client = new ApolloClient({
	uri: 'http://localhost:9000/api',
	cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
	id: null,
	token: null,
	avatar: null,
	hasWallet: null,
	didRequest: false,
};

const App = () => {
	const [viewer, setViewer] = useState<Viewer>(initialViewer);
	console.log(viewer);
	return (
		<Router>
			<Layout id="app">
				<Affix offsetTop={0} className="app__affix-header">
					<AppHeader viewer={viewer} setViewer={setViewer} />
				</Affix>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/host">
						<Host />
					</Route>
					<Route exact path="/listing/:id">
						<Listing />
					</Route>
					<Route exact path="/listings/:location?">
						<Listings />
					</Route>
					<Route exact path="/login">
						<Login setViewer={setViewer} />
					</Route>
					<Route exact path="/user/:id">
						<User />
					</Route>
					<Route>
						<NotFound />
					</Route>
				</Switch>
			</Layout>
		</Router>
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

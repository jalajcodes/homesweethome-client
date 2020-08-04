import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';
import { Home, User, Listings, Listing, Host, NotFound } from './sections';

const client = new ApolloClient({
	uri: 'http://localhost:9000/api',
	cache: new InMemoryCache(),
});

const App = () => (
	<Router>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/host" component={Host} />
			<Route exact path="/listing/:id" component={Listing} />
			<Route exact path="/listings/:location?" component={Listings} />
			<Route exact path="/user/:id" component={User} />
			<Route component={NotFound} />
		</Switch>
	</Router>
);

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

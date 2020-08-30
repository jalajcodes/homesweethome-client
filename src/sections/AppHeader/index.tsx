import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import logo from './assets/hsh-logo-2.png';
import { MenuItems } from './components';
import Search from 'antd/lib/input/Search';
import { displayErrorMessage } from '../../lib/utils';

const { Header } = Layout;

export const AppHeader = () => {
	const [searchInput, setSearchInput] = useState('');

	const location = useLocation();
	useEffect(() => {
		const { pathname } = location;
		const pathNameSubstrings = pathname.split('/');
		if (!pathname.includes('/listings')) {
			setSearchInput('');
			return;
		}

		if (pathname.includes('/listings') && pathNameSubstrings.length === 3) {
			setSearchInput(pathNameSubstrings[2]);
			return;
		}
	}, [location]);

	const history = useHistory();
	const onSearch = (value: string) => {
		const trimmedValue = value.trim();
		if (trimmedValue) {
			history.push('/listings/' + trimmedValue);
		} else {
			displayErrorMessage('Please enter a valid search!');
		}
	};

	return (
		<Header className="app-header">
			<div className="app-header__logo-search-section">
				<div className="app-header__logo">
					<Link to="/">
						<img src={logo} alt="HomeSweetHome Logo" />
					</Link>
				</div>
				<div className="app-header__search-input">
					<Search
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search 'San Francisco'"
						enterButton
						onSearch={onSearch}
					/>
				</div>
			</div>
			<div>
				<MenuItems />
			</div>
		</Header>
	);
};

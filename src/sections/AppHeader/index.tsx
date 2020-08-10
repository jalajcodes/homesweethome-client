import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import logo from './assets/hsh-logo-2.png';
import { MenuItems } from './components';
import { Viewer } from '../../lib/types';

const { Header } = Layout;

interface Props {
	viewer: Viewer;
	setViewer: (viewer: Viewer) => void;
}
export const AppHeader = ({ viewer, setViewer }: Props) => {
	return (
		<Header className="app-header">
			<div className="app-header__logo-search-section">
				<div className="app-header__logo">
					<Link to="/">
						<img src={logo} alt="HomeSweetHome Logo" />
					</Link>
				</div>
			</div>
			<div>
				<MenuItems viewer={viewer} setViewer={setViewer} />
			</div>
		</Header>
	);
};

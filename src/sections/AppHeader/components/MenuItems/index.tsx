import React, { useState } from 'react';
import { Button, Menu, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import useViewerState from '../../../../lib/context/useViewerState';
import { useMutation } from '@apollo/client';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils';

const { SubMenu, Item } = Menu;

// interface Props {
// 	viewer: Viewer;
// 	setViewer: (viewer: Viewer) => void;
// }

export const MenuItems = () => {
	const { viewer, setViewer } = useViewerState();
	const [c, d] = useState(false);
	const [logOut] = useMutation<LogOutData>(LOG_OUT, {
		onCompleted: (data) => {
			if (data && data.logout) {
				setViewer(data.logout);
				sessionStorage.removeItem('token');
				displaySuccessNotification("You've been Successfully Logged Out.");
				d(true);
			}
		},
		onError: () => {
			displayErrorMessage('Unable to log out. Please try again later!');
		},
	});

	const handleLogout = () => {
		logOut();
	};

	if (c) {
		return <Redirect to="/" />;
	}

	const subMenu =
		viewer.id && viewer.avatar ? (
			<SubMenu title={<Avatar src={viewer.avatar} />}>
				<Item key="/user">
					<Link to={`/user/${viewer.id}`}>
						<UserOutlined />
						Profile
					</Link>
				</Item>
				<Item key="/logout">
					<div onClick={handleLogout}>
						<LogoutOutlined />
						Log Out
					</div>
				</Item>
			</SubMenu>
		) : (
			<Item>
				<Link to="/login">
					<Button shape="round" type="primary">
						Login
					</Button>
				</Link>
			</Item>
		);

	return (
		<Menu mode="horizontal" selectable={false} className="menu">
			<Item key="/host">
				<Link to="/host">
					<HomeOutlined />
					Host
				</Link>
			</Item>
			{subMenu}
		</Menu>
	);
};

import React, { useContext } from 'react';
import { Button, Menu, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
// import { Viewer } from '../../../../lib/types';
import { useMutation } from '@apollo/client';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils';
import ViewerStateContext from '../../../../ViewerStateContext';

const { SubMenu, Item } = Menu;

// interface Props {
// 	viewer: Viewer;
// 	setViewer: (viewer: Viewer) => void;
// }

export const MenuItems = () => {
	const state = useContext(ViewerStateContext);
	const viewer = state!.viewer;
	const setViewer = state!.setViewer;

	const [logOut] = useMutation<LogOutData>(LOG_OUT, {
		onCompleted: (data) => {
			if (state && data && data.logout) {
				setViewer(data.logout);
				sessionStorage.removeItem('token');
				displaySuccessNotification("You've Successfully Logged Out.");
			}
		},
		onError: () => {
			displayErrorMessage('Unable to log out. Please try again later!');
		},
	});

	const handleLogout = () => {
		logOut();
	};

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

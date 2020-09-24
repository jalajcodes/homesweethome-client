import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouteMatch, Route, NavLink, useParams } from 'react-router-dom';
import { USER } from '../../lib/graphql/queries';
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { UserOutlined, OrderedListOutlined, BookOutlined } from '@ant-design/icons';
import { PageSkeleton, ErrorBanner } from '../../lib/components';
import { UserProfile, UserListings, UserBookings } from './Components';
import useViewerState from '../../lib/context/useViewerState';

const { Text } = Typography;
const { Content, Sider } = Layout;
const PAGE_LIMIT = 4;

interface Params {
	id: string;
}

export const User = () => {
	const { viewer } = useViewerState(); // global viewer state
	const { id: idUrlParam } = useParams<Params>(); // this is "/user/:id"
	const match = useRouteMatch();

	const [listingsPage, setListingsPage] = useState(1);
	const [bookingsPage, setBookingsPage] = useState(1);

	const { data, error, loading, refetch } = useQuery<UserData, UserVariables>(USER, {
		variables: {
			id: idUrlParam,
			limit: PAGE_LIMIT,
			bookingsPage,
			listingsPage,
		},
	});

	const user = data ? data.user : null;
	const viewerIsUser = viewer.id === idUrlParam;

	const userListings = user ? user.listings : null;
	const userBookings = user ? user.bookings : null;

	const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} refetch={refetch} /> : null;

	const userListingsElement = userListings ? (
		<UserListings
			viewerIsUser={viewerIsUser}
			userListings={userListings}
			listingsPage={listingsPage}
			limit={PAGE_LIMIT}
			setListingsPage={setListingsPage}
			refetch={refetch}
		/>
	) : null;

	const userBookingsElement =
		userBookings && viewerIsUser ? (
			<UserBookings
				viewerIsUser={viewerIsUser}
				userBookings={userBookings}
				bookingsPage={bookingsPage}
				limit={PAGE_LIMIT}
				setBookingsPage={setBookingsPage}
			/>
		) : (
			<Text>You can't view another users Bookings.</Text>
		);

	const stripeError = new URL(window.location.href).searchParams.get('stripe_error');
	const stripeErrorBanner = stripeError ? (
		<ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." />
	) : null;

	if (loading) {
		return (
			<Content className="user">
				<PageSkeleton />
			</Content>
		);
	}

	if (error) {
		return (
			<Content className="user">
				<ErrorBanner description="This user may not exist or we've encountered an error. Please try again." />
				<PageSkeleton />
			</Content>
		);
	}

	return (
		<Layout hasSider>
			<Sider
				// breakpoint={}
				width={250}
				className="user-sider">
				<Menu
					mode="inline"
					// this is just a hack to add correct stying based on the path
					defaultSelectedKeys={
						match.path === '/user/:id'
							? ['1']
							: match.path === '/user/:id/listings'
							? ['2']
							: match.path === '/user/:id/bookings'
							? ['3']
							: ['1']
					}>
					<div className="user-sider__menuitem-avatar">
						{/* <Avatar size={100} style={{ backgroundColor: iconColor }} icon={<UserOutlined />} /> */}
						<Avatar size={100} src={user?.avatar} />
					</div>
					<Menu.Item key="1" icon={<UserOutlined />}>
						<NavLink exact activeClassName="ant-menu-item-selected ant-menu-item-active" to={`/user/${idUrlParam}`}>
							Profile Info
						</NavLink>
					</Menu.Item>
					<Menu.Item key="2" icon={<OrderedListOutlined />}>
						<NavLink
							exact
							activeClassName="ant-menu-item-selected ant-menu-item-active"
							to={`/user/${idUrlParam}/listings`}>
							Listings
						</NavLink>
					</Menu.Item>
					{viewerIsUser ? (
						<Menu.Item key="3" icon={<BookOutlined />}>
							<NavLink
								exact
								activeClassName="ant-menu-item-selected ant-menu-item-active"
								to={`/user/${idUrlParam}/bookings`}>
								Your Bookings
							</NavLink>
						</Menu.Item>
					) : null}
				</Menu>
			</Sider>
			<Layout>
				<Content className="user">
					{stripeErrorBanner}
					<Route exact path="/user/:id">
						{userProfileElement}
					</Route>
					<Route exact path="/user/:id/listings">
						{userListingsElement}
					</Route>
					<Route exact path="/user/:id/bookings">
						{userBookingsElement}
					</Route>
				</Content>
			</Layout>
		</Layout>
	);
};

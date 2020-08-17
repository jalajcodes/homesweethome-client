import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { USER } from '../../lib/graphql/queries/User';
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User';
import { Layout, Col, Row } from 'antd';
import { UserProfile } from './Components';

const { Content } = Layout;

export const User = () => {
	const { id } = useParams();

	const { data, error, loading } = useQuery<UserData, UserVariables>(USER, {
		variables: {
			id,
		},
	});

	const user = data ? data.user : null;
	const userProfileElement = user ? <UserProfile user={user} /> : null;

	return (
		<Content className="user">
			<Row gutter={12} justify="space-between">
				<Col xs={24}>{userProfileElement}</Col>
			</Row>
		</Content>
	);
};

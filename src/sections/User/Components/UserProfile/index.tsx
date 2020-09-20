import React from 'react';
import { useMutation } from '@apollo/client';
import { Avatar, Card, Divider, Typography, Button, Tag } from 'antd';
import { DISCONNECT_STRIPE } from '../../../../lib/graphql/mutations';
import { DisconnectStripe as DisconnectStripeData } from '../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe';
import { displayErrorMessage, displaySuccessNotification, formatListingPrice } from '../../../../lib/utils';
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';
import useViewerState from '../../../../lib/context/useViewerState';

interface Props {
	user: UserData['user'];
	viewerIsUser: boolean;
	refetch: () => void;
}

const { Paragraph, Text, Title } = Typography;
const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;

export const UserProfile = ({ user, viewerIsUser, refetch }: Props) => {
	const { viewer, setViewer } = useViewerState();
	const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(DISCONNECT_STRIPE, {
		onCompleted: (data) => {
			if (data && data.stripeDisconnect) {
				setViewer({ ...viewer, hasWallet: data.stripeDisconnect.hasWallet });
				displaySuccessNotification(
					`You have successfully disconnected from Stripe`,
					`You'll to reconnect Stripe to continue to create listings`
				);
				refetch();
			}
		},
		onError: () => {
			displayErrorMessage(`Sorry, we weren't able to disconnect you from stripe. Please try again later!`);
		},
	});

	const redirectToStripe = () => {
		window.location.href = stripeAuthUrl;
	};

	const additionalDetails = user.hasWallet ? (
		<>
			<Paragraph>
				<Paragraph>
					<Tag color="green">Stripe Connected</Tag>
				</Paragraph>
				<Paragraph>
					Income Earned: <Text strong>{user.income ? formatListingPrice(user.income) : '₹0'}</Text>
					{'\n'}
				</Paragraph>
				<Button
					loading={loading}
					onClick={() => disconnectStripe()}
					type="primary"
					className="user-profile__details-cta">
					Disconnect Stripe
				</Button>
				<Paragraph type="secondary">
					By Disconnecting, you won't be able to recieve <Text strong>any further payments</Text>. This will prevent
					other users from booking listings that you have created.
				</Paragraph>
			</Paragraph>
		</>
	) : (
		<>
			<Paragraph>Interested in becoming a HSH host? Register with your Stripe account!</Paragraph>
			<Button onClick={redirectToStripe} type="primary" className="user-profile__details-cta">
				Connect with Stripe!
			</Button>
			<Paragraph type="secondary">
				HomeSweetHome uses{' '}
				<a href="https://stripe.com/en-US/connect" target="_blank" rel="noopener noreferrer">
					Stripe
				</a>{' '}
				to help transfer your earnings in a secure and trusted manner.
			</Paragraph>
		</>
	);

	const additionalDetailsSection = viewerIsUser ? (
		<>
			<Divider />
			<div className="user-profile__details">
				<Title level={4}>Additional Details</Title>
				{additionalDetails}
			</div>
		</>
	) : null;

	return (
		<div className="user-profile">
			<Card className="user-profile__card">
				<div className="user-profile__avatar">
					<Avatar size={100} src={user.avatar} />
				</div>
				<Divider />
				<div className="user-profile__details">
					<Title level={4}>Info</Title>
					<Paragraph>
						Name: <Text strong>{user.name}</Text>
					</Paragraph>
					<Paragraph>
						Contact: <Text strong>{user.contact}</Text>
					</Paragraph>
				</div>
				{additionalDetailsSection}
			</Card>
		</div>
	);
};

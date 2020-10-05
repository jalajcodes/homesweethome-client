import React, { useState } from 'react';
import { Card, Typography, Modal } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { iconColor, formatListingPrice, displaySuccessNotification } from '../../utils';
import { ListingCardActions } from './components';
import { useMutation } from '@apollo/client';
import { DELETE_LISTING } from '../../graphql/mutations/DeleteListing';
import {
	DeleteListing as DeleteListingData,
	DeleteListingVariables,
} from '../../graphql/mutations/DeleteListing/__generated__/DeleteListing';

interface Props {
	viewerIsUser?: boolean;
	refetch?: () => void;
	listing: {
		id: string;
		title: string;
		image: string;
		address: string;
		price: number;
		numOfGuests: number;
	};
}

const { Text, Title } = Typography;

export const ListingCard = ({ listing, viewerIsUser, refetch }: Props) => {
	const { title, image, address, price, numOfGuests, id } = listing;
	const [showModal, setShowModal] = useState(false);

	const [deleteListing, { loading }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING, {
		variables: { input: { id } },
		onCompleted: () => {
			displaySuccessNotification(`Listing Successfully Deleted!`);
		},
	});

	const listingCardActionsElement = viewerIsUser ? <ListingCardActions setShowModal={setShowModal} id={id} /> : null;

	const handleCancel = () => {
		setShowModal(false);
	};
	const handleDelete = () => {
		deleteListing();
		setShowModal(false);
		refetch!(); // "!" is here to tell typescript that refetch will not be undefined
	};

	return (
		<>
			<Link to={`/listing/${id}`}>
				<Card
					hoverable
					cover={<div style={{ backgroundImage: `url(${image})` }} className="listing-card__cover-img" />}>
					<div className="listing-card__details">
						<div className="listing-card__description">
							<Title level={4} className="listing-card__price">
								{formatListingPrice(price)}
								<span>/day</span>
							</Title>
							<Text strong ellipsis className="listing-card__title">
								{title}
							</Text>
							<Text ellipsis className="listing-card__address">
								{address}
							</Text>
						</div>
						<div className="listing-card__dimensions">
							<div className="listing-card__dimensions--guests">
								<UserOutlined style={{ color: `${iconColor}` }} /> <Text>{numOfGuests} guests</Text>
							</div>
						</div>
					</div>
				</Card>
			</Link>
			{listingCardActionsElement}
			<Modal
				title={'Are you sure you want to delete this listing?'}
				okText="Yes"
				cancelText="No"
				// okButtonProps={{ style: { background: 'red', color: 'white' } }}
				// cancelButtonProps={{ style: { background: '#00ff00d4', color: 'white' } }}
				visible={showModal}
				confirmLoading={loading}
				onCancel={handleCancel}
				onOk={handleDelete}>
				<p style={{ textTransform: 'uppercase' }}>
					<Text strong>
						<ArrowRightOutlined size={24} style={{ color: iconColor }} /> {title}
					</Text>
				</p>
			</Modal>
		</>
	);
};

import React from 'react';
import { Button, Divider, Modal, Typography } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatListingPrice } from '../../../../lib/utils';

interface Props {
	modalVisible: boolean;
	setModalVisible: (modalVisible: boolean) => void;
	checkInDate: Moment;
	checkOutDate: Moment;
	price: number;
}

const { Paragraph, Title, Text } = Typography;

export const ListingCreateBookingModal = ({
	checkInDate,
	checkOutDate,
	price,
	modalVisible,
	setModalVisible,
}: Props) => {
	const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
	const listingPrice = price * daysBooked;

	const stripe = useStripe();
	const elements = useElements();

	const handleClick = async () => {
		if (!stripe || !elements) return;

		const cardElement = elements?.getElement(CardElement);

		if (!cardElement) return;

		const { token: stripeToken } = await stripe.createToken(cardElement);
		console.log(stripeToken);
	};

	return (
		<Modal visible={modalVisible} centered footer={null} onCancel={() => setModalVisible(false)}>
			<div className="listing-booking-modal">
				<div className="listing-booking-modal__intro">
					<Title className="listing-boooking-modal__intro-title">
						<KeyOutlined />
					</Title>
					<Title level={3} className="listing-boooking-modal__intro-title">
						Book your trip
					</Title>
					<Paragraph>
						Enter your payment information to book the listing from the dates between{' '}
						<Text mark strong>
							{moment(checkInDate).format('MMMM Do YYYY')}
						</Text>{' '}
						and{' '}
						<Text mark strong>
							{moment(checkOutDate).format('MMMM Do YYYY')}
						</Text>
						, inclusive.
					</Paragraph>
				</div>

				<Divider />

				<div className="listing-booking-modal__charge-summary">
					<Paragraph>
						{formatListingPrice(price, false)} x {daysBooked} days ={' '}
						<Text strong>{formatListingPrice(listingPrice, false)}</Text>
					</Paragraph>
					<Paragraph className="listing-booking-modal__charge-summary-total">
						Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
					</Paragraph>
				</div>

				<div className="listing-booking-modal__stripe-card-section">
					{/* Provided by react-stripe */}
					<CardElement
						options={{ hidePostalCode: true, style: { base: { fontFamily: 'Arial' } } }}
						className="listing-booking-modal__stripe-card"
					/>

					<Button size="large" type="primary" className="listing-booking-modal__cta" onClick={handleClick}>
						Book
					</Button>
				</div>
			</div>
		</Modal>
	);
};

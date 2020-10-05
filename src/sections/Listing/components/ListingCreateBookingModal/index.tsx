import React from 'react';
import { Button, Divider, message, Modal, Typography } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatListingPrice, displayErrorMessage, displaySuccessNotification } from '../../../../lib/utils';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations/CreateBooking';
import {
	CreateBooking as CreateBookingData,
	CreateBookingVariables,
} from '../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking';

interface Props {
	id: string;
	modalVisible: boolean;
	checkInDate: Moment;
	checkOutDate: Moment;
	price: number;
	setModalVisible: (modalVisible: boolean) => void;
	clearBookingData: () => void;
	refetchListing: () => Promise<void>;
}

const { Paragraph, Title, Text } = Typography;

export const ListingCreateBookingModal = ({
	id,
	checkInDate,
	checkOutDate,
	price,
	modalVisible,
	setModalVisible,
	clearBookingData,
	refetchListing,
}: Props) => {
	const [createBooking, { loading }] = useMutation<CreateBookingData, CreateBookingVariables>(CREATE_BOOKING, {
		onCompleted: () => {
			clearBookingData();
			displaySuccessNotification(
				"You've successfully booked the listing!",
				'Booking history can always be found in your Profile.'
			);
			refetchListing();
		},
		onError: () => {
			displayErrorMessage("Sorry! We weren't able to book the listing. Please try again later!");
		},
	});

	const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
	const listingPrice = price * daysBooked;

	const stripe = useStripe();
	const elements = useElements();

	const handleClick = async () => {
		if (!stripe || !elements) return;

		const cardElement = elements?.getElement(CardElement);

		if (!cardElement) return;

		const { token: stripeToken, error } = await stripe.createToken(cardElement);

		if (stripeToken) {
			createBooking({
				variables: {
					input: {
						id,
						source: stripeToken.id,
						checkIn: moment(checkInDate).format('YYYY-MM-DD'),
						checkOut: moment(checkInDate).format('YYYY-MM-DD'),
					},
				},
			});
		} else {
			displayErrorMessage(error && error.message ? error.message : 'Unable to Book the Listing. Try again later.');
		}
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

					<Button
						loading={loading}
						size="large"
						type="primary"
						className="listing-booking-modal__cta"
						onClick={handleClick}>
						Book
					</Button>
				</div>
			</div>
		</Modal>
	);
};

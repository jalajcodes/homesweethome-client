import React from 'react';
import moment, { Moment } from 'moment';
import { Divider, Button, Typography, Card, DatePicker } from 'antd';
import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils';
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';
import useViewerState from '../../../../lib/context/useViewerState';
import { BookingsIndex } from './types';

const { Paragraph, Title, Text } = Typography;

interface Props {
	host: ListingData['listing']['host'];
	bookingsIndex: ListingData['listing']['bookingsIndex'];
	price: number;
	checkInDate: Moment | null;
	checkOutDate: Moment | null;
	setCheckInDate: (checkInDate: Moment | null) => void;
	setCheckOutDate: (checkOutDate: Moment | null) => void;
	setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBooking = ({
	setModalVisible,
	bookingsIndex,
	host,
	price,
	checkInDate,
	checkOutDate,
	setCheckInDate,
	setCheckOutDate,
}: Props) => {
	const { viewer } = useViewerState();
	const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

	const dateIsBooked = (currentDate: Moment) => {
		const year = moment(currentDate).year();
		const month = moment(currentDate).month();
		const day = moment(currentDate).date();

		if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
			return Boolean(bookingsIndexJSON[year][month][day]);
		} else {
			return false;
		}
	};

	const disabledDate = (currentDate?: Moment) => {
		if (currentDate) {
			const dateIsBeforeEndOfToday = currentDate.isBefore(moment().endOf('day'));
			return dateIsBeforeEndOfToday || dateIsBooked(currentDate);
		} else {
			return false;
		}
	};

	const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
		if (checkInDate && selectedCheckOutDate) {
			if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
				return displayErrorMessage(`You can't book date of check out to be prior to check in!`);
			}

			let dateCursor = checkInDate;

			while (moment(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
				dateCursor = moment(dateCursor).add(1, 'days');

				const year = moment(dateCursor).year();
				const month = moment(dateCursor).month();
				const day = moment(dateCursor).date();

				if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month] && bookingsIndexJSON[year][month][day]) {
					return displayErrorMessage(
						"You can't book a period of time that overlaps existing bookings. Please try again!"
					);
				}
			}
		}

		setCheckOutDate(selectedCheckOutDate);
	};

	const viewerIsHost = viewer.id === host.id;
	const checkInInputDisabled =
		!viewer.id || viewerIsHost || !host.hasWallet; /* isLoggedIn || isHostOfTheListing || hasConnectedStripe */
	const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
	const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

	let buttonMessage = "You won't be charged yet";

	if (!viewer.id) {
		buttonMessage = 'You have to be signed in to book a listing!';
	} else if (viewerIsHost) {
		buttonMessage = "You can't book your own listing!";
	} else if (!host.hasWallet) {
		buttonMessage = "The host has disconnected from Stripe and thus won't be able to receive payments.";
	}

	return (
		<div className="listing-booking">
			<Card className="listing-booking__card">
				<div>
					<Paragraph>
						<Title level={2} className="listing-booking__card-title">
							{formatListingPrice(price, false)}
							<span>/day</span>
						</Title>
					</Paragraph>
					<Divider />
					<div className="listing-booking__card-date-picker">
						<Paragraph strong>Check In</Paragraph>
						<DatePicker
							value={checkInDate}
							onChange={(dateValue) => setCheckInDate(dateValue)}
							format={'YYYY/MM/DD'}
							disabledDate={disabledDate}
							showToday={false}
							disabled={checkInInputDisabled}
							onOpenChange={() => setCheckOutDate(null)}
						/>
					</div>
					<div className="listing-booking__card-date-picker">
						<Paragraph strong>Check Out</Paragraph>
						<DatePicker
							value={checkOutDate}
							format={'YYYY/MM/DD'}
							disabledDate={disabledDate}
							onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
							showToday={false}
							disabled={checkOutInputDisabled}
						/>
					</div>
				</div>
				<Divider />
				<Button
					disabled={buttonDisabled}
					size="large"
					type="primary"
					onClick={() => setModalVisible(true)}
					className="listing-booking__card-cta">
					Request to book!
				</Button>
				<Text type="secondary" mark>
					{buttonMessage}
				</Text>
			</Card>
		</div>
	);
};

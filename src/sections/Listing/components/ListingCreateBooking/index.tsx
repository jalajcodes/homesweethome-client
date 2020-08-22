import React from 'react';
import moment, { Moment } from 'moment';
import { Divider, Button, Typography, Card, DatePicker } from 'antd';
import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils';

const { Paragraph, Title } = Typography;

interface Props {
	price: number;
	checkInDate: Moment | null;
	checkOutDate: Moment | null;
	setCheckInDate: (checkInDate: Moment | null) => void;
	setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export const ListingCreateBooking = ({ price, checkInDate, checkOutDate, setCheckInDate, setCheckOutDate }: Props) => {
	const disabledDate = (currentDate?: Moment) => {
		if (currentDate) {
			const dateIsBeforeEndOfToday = currentDate.isBefore(moment().endOf('day'));
			return dateIsBeforeEndOfToday;
		} else {
			return false;
		}
	};

	const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
		if (checkInDate && selectedCheckOutDate) {
			if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
				return displayErrorMessage(`You can't book date of check out to be prior to check in!`);
			}
		}

		setCheckOutDate(selectedCheckOutDate);
	};

	return (
		<div className="listing-booking">
			<Card className="listing-booking__card">
				<div>
					<Paragraph>
						<Title level={2} className="listing-booking__card-title">
							{formatListingPrice(price)}
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
							disabled={!checkInDate}
						/>
					</div>
				</div>
				<Divider />
				<Button
					disabled={!checkInDate || !checkOutDate}
					size="large"
					type="primary"
					className="listing-booking__card-cta"
				>
					Request to book!
				</Button>
			</Card>
		</div>
	);
};

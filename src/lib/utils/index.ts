import { message, notification } from 'antd';

export const displaySuccessNotification = (message: string, description?: string) => {
	return notification['success']({
		message,
		description,
		placement: 'topLeft',
		style: {
			marginTop: 50,
		},
	});
};

export const displayErrorMessage = (error: string) => {
	return message.error(error);
};

export const iconColor = '#ff932b';

export const formatListingPrice = (price: number, round = true) => {
	const priceInDollars = round ? Math.round(price / 100) : price / 100;
	const formattedListingPrice = priceInDollars * 74;
	return `₹${formattedListingPrice.toLocaleString()}`;
};

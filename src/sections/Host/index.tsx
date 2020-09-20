import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Form, Input, InputNumber, Radio, Upload, Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import { BankOutlined, HomeOutlined } from '@ant-design/icons';
import useViewerState from '../../lib/context/useViewerState';
import { ListingType } from '../../lib/graphql/globalTypes';
import { iconColor, displayErrorMessage, displaySuccessNotification } from '../../lib/utils';
import { useMutation } from '@apollo/client';
import { HOST_LISTING } from '../../lib/graphql/mutations';
import {
	HostListing as HostListingData,
	HostListingVariables,
} from '../../lib/graphql/mutations/HostListing/__generated__/HostListing';

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

declare global {
	interface Window {
		placeSearch: any;
	}
}

export const Host = () => {
	const { viewer } = useViewerState();
	const [imageLoading, setImageLoading] = useState(false);
	const addressRef = useRef(null);
	const [form] = Form.useForm();
	const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

	const [hostListing, { loading, data }] = useMutation<HostListingData, HostListingVariables>(HOST_LISTING, {
		onCompleted: () => {
			displaySuccessNotification('Successfully created new Listing!');
		},
		onError: (error) => {
			console.log(error);

			displayErrorMessage("Sorry! We weren't able to create your listing. Please try again later.");
		},
	});

	useEffect(() => {
		const place = window.placeSearch({
			key: process.env.REACT_APP_M_KEY,
			container: document.querySelector('#placeSearch'),
		});
		place.on('change', (e: any) => {
			form.setFieldsValue({
				city: e.result.city,
				state: e.result.state,
				postalCode: e.result.postalCode,
			});
		});
	}, [form]);

	// if the mutation is successfull, redirect the user
	if (data && data.hostListing) {
		return <Redirect to={`/listing/${data.hostListing.id}`} />;
	}

	const handleImageUpload = (info: UploadChangeParam) => {
		const { file } = info;

		if (file.status === 'uploading') {
			setImageLoading(true);
			return;
		}

		if (file.status === 'done' && file.originFileObj) {
			getBase64Value(file.originFileObj, (imageBase64Value) => {
				setImageBase64Value(imageBase64Value);
				setImageLoading(false);
			});
		}
	};

	const handleFormFinish = (values: any) => {
		// prepare full address
		// here I replaced "," with empty string in address because of api limitation
		const fullAddress = `${values.address.replace(',', '')}, ${values.city}, ${values.state}, ${values.postalCode}`;
		// prepare the input for hostListing mutation
		const input = {
			...values,
			address: fullAddress,
			image: imageBase64Value,
			price: values.price * 100,
		};
		// delete extra fields from input
		delete input.city;
		delete input.state;
		delete input.postalCode;

		// trigger the mutation
		hostListing({ variables: { input } });
	};

	const handleFormFinishFailed = (errorInfo: any) => {
		displayErrorMessage('Please complete all the required form fields!');
	};

	if (!viewer.id || !viewer.hasWallet) {
		return (
			<Content className="host-content">
				<div className="host__form-header">
					<Title level={4} className="host__form-title">
						You'll have to be signed in and connected with Stripe to host a listing!
					</Title>
					<Text type="secondary">
						We only allow users who've signed in to our application and have connected with Stripe to host new listings.
						You can sign in at the <Link to="/login">/login</Link> page and connect with Stripe shortly after.
					</Text>
				</div>
			</Content>
		);
	}

	if (loading) {
		return (
			<Content className="host-content">
				<div className="host__form-header">
					<Title level={3} className="host__form-title">
						Please wait!
					</Title>
					<Text type="secondary">We're creating your listing now.</Text>
				</div>
			</Content>
		);
	}

	return (
		<Content className="host-content">
			<Form form={form} layout="vertical" onFinish={handleFormFinish} onFinishFailed={handleFormFinishFailed}>
				<div className="host__form-header">
					<Title level={3} className="host__form-title">
						Hi! Let's get started listing your place.
					</Title>
					<Text type="secondary">
						In this form, we'll collect some basic and additional information about your listing.
					</Text>
				</div>

				<Item name="type" rules={[{ required: true, message: 'Please select a home type!' }]} label="Home Type">
					<Radio.Group>
						<Radio.Button value={ListingType.APARTMENT}>
							<BankOutlined style={{ color: iconColor }} /> <span>Apartment</span>
						</Radio.Button>
						<Radio.Button value={ListingType.HOUSE}>
							<HomeOutlined style={{ color: iconColor }} /> <span>House</span>
						</Radio.Button>
					</Radio.Group>
				</Item>

				<Item
					name="numOfGuests"
					rules={[
						{
							required: true,
							message: 'Please enter the max number of guests!',
						},
					]}
					label="Max # of Guests">
					<InputNumber min={1} placeholder="4" />
				</Item>

				<Item
					name="title"
					rules={[{ required: true, message: 'Please enter a title for your listing!' }]}
					extra="Max Length of 45"
					label="Title">
					<Input placeholder="Luxurious 2 Bed apartment with ocaen view..." maxLength={45} />
				</Item>

				<Item
					name="description"
					rules={[{ required: true, message: 'Please enter a description for your listing!' }]}
					label="Description of listing"
					extra="Max character count of 400">
					<Input.TextArea
						rows={3}
						bordered
						maxLength={400}
						placeholder="Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of..."
					/>
				</Item>
				<Item
					name="address"
					rules={[{ required: true, message: 'Please enter an address for your listing!' }]}
					label="Address">
					<Input ref={addressRef} id="placeSearch" placeholder="251 North Bristol Avenue" />
				</Item>

				<Item
					name="city"
					rules={[{ required: true, message: 'Please enter a city (or region) for your listing!' }]}
					label="City/Town">
					<Input placeholder="Los Angeles" />
				</Item>

				<Item
					name="state"
					rules={[{ required: true, message: 'Please enter a state for your listing!' }]}
					label="State/Province">
					<Input placeholder="California" />
				</Item>

				<Item
					name="postalCode"
					rules={[{ required: true, message: 'Please enter a postal code for your listing!' }]}
					label="Zip/Postal Code">
					<Input placeholder="Please enter a zip code for your listing!" />
				</Item>

				<Item
					name="image"
					rules={[{ required: true, message: 'Please provide a image for your listing!' }]}
					label="Image"
					extra="Images have to be under 1MB in size and of type JPG or PNG">
					<div className="host__form-image-upload">
						<Upload
							name="image"
							listType="picture-card"
							showUploadList={false}
							customRequest={dummyRequest}
							// action="https://run.mocky.io/v3/13478d8a-7eb2-4540-8219-99cbf0b97402"
							beforeUpload={beforeImageUpload}
							onChange={handleImageUpload}>
							{imageBase64Value ? (
								<img src={imageBase64Value} alt="Listing" />
							) : (
								<div>
									{imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
									<div className="ant-upload-text">Upload</div>
								</div>
							)}
						</Upload>
					</div>
				</Item>

				<Item
					name="price"
					rules={[{ required: true, message: 'Please enter a price for your listing!' }]}
					label="Price"
					extra="Per day price of your Listing">
					<InputNumber min={0} placeholder="120" />
				</Item>

				<Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Item>
			</Form>
		</Content>
	);
};

// https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
const dummyRequest = ({ file, onSuccess }: { file: File; onSuccess: any }) => {
	setTimeout(() => {
		onSuccess('ok');
	}, 1500);
};

const beforeImageUpload = (file: File) => {
	const fileIsValidImage = file.type === 'image/jpeg' || file.type === 'image/png';
	const fileIsValidSize = file.size / 1024 / 1024 < 1;

	if (!fileIsValidImage) {
		displayErrorMessage("You're only able to upload valid JPG or PNG files!");
		return false;
	}

	if (!fileIsValidSize) {
		displayErrorMessage("You're only able to upload valid image files of under 1MB in size!");
		return false;
	}

	return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (image: File | Blob, callback: (imageBase64Value: string) => void) => {
	const reader = new FileReader();
	reader.readAsDataURL(image);

	reader.onload = () => {
		callback(reader.result as string);
	};
};

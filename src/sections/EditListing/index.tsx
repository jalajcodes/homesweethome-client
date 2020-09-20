import React, { useState, useEffect } from 'react';
import { Layout, Typography, Form, Input, InputNumber, Radio, Upload, Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, Redirect, useParams } from 'react-router-dom';
import { BankOutlined, HomeOutlined } from '@ant-design/icons';
import useViewerState from '../../lib/context/useViewerState';
import { ListingType } from '../../lib/graphql/globalTypes';
import { iconColor, displayErrorMessage, displaySuccessNotification } from '../../lib/utils';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_LISTING } from '../../lib/graphql/queries';
import {
	EditListing as EditListingData,
	EditListingVariables,
} from '../../lib/graphql/queries/EditListing/__generated__/EditListing';
import { HOST_LISTING } from '../../lib/graphql/mutations';
import {
	HostListing as HostListingData,
	HostListingVariables,
} from '../../lib/graphql/mutations/HostListing/__generated__/HostListing';

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Params {
	id: string;
}

export const EditListing = () => {
	const { viewer } = useViewerState();
	const { id } = useParams<Params>();
	const [form] = Form.useForm();
	const [imageLoading, setImageLoading] = useState(false);
	const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
	const [listingInfo, setListingInfo] = useState<EditListingData['listing']>({
		__typename: 'Listing',
		type: ListingType.APARTMENT || ListingType.HOUSE,
		numOfGuests: 1,
		title: '',
		address: '',
		city: '',
		description: '',
		image: '',
		id: '',
		price: 0,
		host: { id: '', __typename: 'User' },
	});

	// query listing data based on id
	const { data: listingData, loading: listingLoading } = useQuery<EditListingData, EditListingVariables>(EDIT_LISTING, {
		variables: {
			id,
		},
	});

	// set the state and iniialize form fields
	useEffect(() => {
		if (listingData?.listing) {
			setListingInfo(listingData.listing);
			form.setFieldsValue({
				...listingInfo,
				price: Math.floor(listingInfo.price / 100),
			});
		}
	}, [listingData, listingInfo, form]);

	// hostListing mutation
	const [hostListing, { loading: hostListingLoading, data: hostListingData }] = useMutation<
		HostListingData,
		HostListingVariables
	>(HOST_LISTING, {
		onCompleted: () => {
			displaySuccessNotification("You've successfully updated your listing!");
		},
		onError: (error) => {
			console.log(`Unable to create listing: ${error}`);

			displayErrorMessage("Sorry! We weren't able to update your listing. Please try again later.");
		},
		refetchQueries: [
			{
				query: EDIT_LISTING,
				variables: { id: id },
			},
		],
	});

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
		// prepare the input for hostListing mutation
		const input = {
			id: listingInfo.id,
			...values,
			address: listingInfo.address,
			image: imageBase64Value ? imageBase64Value : listingInfo.image,
			price: values.price * 100,
		};
		// trigger the mutation
		hostListing({ variables: { input } });
	};

	const handleFormFinishFailed = (errorInfo: any) => {
		displayErrorMessage('Please complete all the required form fields!');
	};

	// check if user is logged in
	if (!viewer.id) {
		return (
			<Content className="host-content">
				<div className="host__form-header">
					<Title level={4} className="host__form-title">
						You'll have to be signed in to edit a listing!
					</Title>
					<Text type="secondary">
						We only allow users who've signed in to our application edit listings. You can sign in at the{' '}
						<Link to="/login">/login</Link> page.
					</Text>
				</div>
			</Content>
		);
	}

	console.log(' listingData?.listing.host?.id', listingData?.listing.host?.id);
	console.log('listingData.listing.host?.id !== viewer.id', listingData?.listing.host?.id !== viewer.id);
	// check if loggedin user is the same as the listing host
	if (listingData && listingData.listing.host.id) {
		if (listingData.listing.host.id !== viewer.id) {
			displayErrorMessage(`You can't edit someone else's listing.`);
			return <Redirect to="/" />;
		}
	}

	if (listingLoading) {
		return (
			<Content className="host-content">
				<div className="host__form-header">
					<Title level={3} className="host__form-title">
						Please wait!
					</Title>
					<Text type="secondary">We're loading your listing now.</Text>
				</div>
			</Content>
		);
	}

	// when the mutation is successfull, redirect the user to the listing page
	if (hostListingData && hostListingData.hostListing) {
		return <Redirect to={`/listing/${hostListingData.hostListing.id}`} />;
	}

	return (
		<Content className="host-content">
			<Form
				form={form}
				// onValuesChange={handleFormValuesChange}
				initialValues={listingInfo}
				layout="vertical"
				onFinish={handleFormFinish}
				onFinishFailed={handleFormFinishFailed}>
				<div className="host__form-header">
					<Title level={3} className="host__form-title">
						Edit Listing
					</Title>
					<Text type="secondary">Use this form to update your listing data.</Text>
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
					<Input placeholder="Luxurious apartment with ocean view..." maxLength={45} />
				</Item>

				<Item
					name="description"
					rules={[{ required: true, message: 'Please enter a description for your listing!' }]}
					label="Description of listing"
					extra="Max character count of 400">
					<Input.TextArea
						rows={5}
						bordered
						maxLength={400}
						placeholder="Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of..."
					/>
				</Item>
				<Item
					name="address"
					rules={[{ required: true, message: 'Please enter an address for your listing!' }]}
					label="Address">
					<Input disabled />
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
							{imageBase64Value || listingInfo.image ? (
								<img src={imageBase64Value || listingInfo.image} alt="Listing" />
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
					<Button type="primary" htmlType="submit" loading={hostListingLoading}>
						Update
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

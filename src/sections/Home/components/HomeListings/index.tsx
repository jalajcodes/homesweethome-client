import React from 'react';
import { List, Typography } from 'antd';
import { ListingCard } from '../../../../lib/components';
import { Listings } from '../../../../lib/graphql/queries/Listings/__generated__/Listings';

interface Props {
	title: string;
	listings: Listings['listings']['result'];
}

const { Title } = Typography;

export const HomeListings = ({ title, listings }: Props) => {
	return (
		<div className="home-listings">
			<Title level={4} className="home-listings__title">
				{title}
			</Title>
			<List
				grid={{
					gutter: 8,
					xs: 1,
					sm: 2,
					md: 2,
					lg: 4,
					xl: 4,
				}}
				dataSource={listings}
				renderItem={(listing, i) => (
					<List.Item data-aos="zoom-in" data-aos-duration={1000} data-aos-delay={500 * i}>
						<ListingCard listing={listing} />
					</List.Item>
				)}
			/>
		</div>
	);
};

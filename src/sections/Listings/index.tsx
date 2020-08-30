import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { Layout, List, Typography, Affix } from 'antd';
import { ListingCard, ErrorBanner } from '../../lib/components';
import { LISTINGS } from '../../lib/graphql/queries';
import { Listings as ListingsData, ListingsVariables } from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from './components';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 4;

interface Params {
	location: string;
}

export const Listings = () => {
	const { location } = useParams<Params>();
	const locationRef = useRef(location); // this will persist whatever the location param was during the first search.
	const [filter, setFilter] = useState(ListingsFilter.PRICE_HIGH_TO_LOW);
	const [page, setPage] = useState(1);

	console.log(
		'Listings -> locationRef.current !== location && page !== 1',
		locationRef.current !== location && page !== 1
	);
	const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
		skip: locationRef.current !== location && page !== 1,
		// when user was on page 2 and they search for another place, two network
		// requests were made, first bcoz location parameter changes and second bcoz of
		// the page state variable changes (bcoz useEffect hook below catches the location change and sets the
		// page to 1)

		// so to solve the above problem, what I did is skip the query to be made if the locationRef
		// value and page state value isn't
		// equal to the current location param and 1 respectively

		//  thus the query is only made when the useEffect catches the location change and sets the page variable
		// to 1
		variables: {
			filter,
			limit: PAGE_LIMIT,
			page,
			location,
		},
	});

	// set the page back to 1 if location changes i.e. when user searches for a new listing while on "nth" page
	useEffect(() => {
		setPage(1);
		// set the locationRef to the current location
		locationRef.current = location;
	}, [location]);

	const listings = data ? data.listings : null;
	const listingsRegion = listings ? listings.region : null;

	const listingsSectionElement =
		listings && listings.result.length ? (
			<div>
				<Affix offsetTop={64}>
					<ListingsPagination limit={PAGE_LIMIT} total={listings.total} page={page} setPage={setPage} />
					<ListingsFilters filter={filter} setFilter={setFilter} />
				</Affix>
				<List
					grid={{
						gutter: 8,
						xs: 1,
						sm: 2,
						lg: 4,
						xl: 4,
					}}
					dataSource={listings.result}
					renderItem={(listing) => (
						<List.Item>
							<ListingCard listing={listing} />
						</List.Item>
					)}
				/>
			</div>
		) : (
			<div>
				<Paragraph>
					It appears that no listings have yet been created for <Text mark>"{listingsRegion}"</Text>
				</Paragraph>
				<Paragraph>
					Be the first person to create a <Link to="/host">listing in this area</Link>!
				</Paragraph>
			</div>
		);

	const listingsRegionElement = listingsRegion ? (
		<Title level={3} className="listings__title">
			Results for "{listingsRegion}"
		</Title>
	) : null;

	if (loading) {
		return (
			<Content className="listings">
				<ListingsSkeleton />
			</Content>
		);
	}

	if (error) {
		return (
			<Content className="listings">
				<ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
				<ListingsSkeleton />
			</Content>
		);
	}

	return (
		<Content className="listings">
			{listingsRegionElement}
			{listingsSectionElement}
		</Content>
	);
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Props {
	id: string;
	setShowModal: (value: boolean) => void;
}

export const ListingCardActions = ({ id, setShowModal }: Props) => {
	return (
		<div>
			<div className="listing-card__dimensions--actions">
				<Tooltip title="Edit Listing">
					<Link to={`/listing/${id}/edit`}>
						<EditOutlined style={{ color: 'white' }} />
					</Link>
				</Tooltip>
				<Tooltip title="Delete Listing">
					<DeleteOutlined onClick={() => setShowModal(true)} style={{ color: 'white' }} />
				</Tooltip>
			</div>
		</div>
	);
};

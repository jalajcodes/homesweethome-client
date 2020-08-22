import React from 'react';
import { HomeHeroArea } from './components';
import { Layout } from 'antd';
import mapBackground from './assets/map-background.jpg';

const { Content } = Layout;

export const Home = () => {
	return (
		<Content className="home" style={{ backgroundImage: `url(${mapBackground})` }}>
			<HomeHeroArea />
		</Content>
	);
};

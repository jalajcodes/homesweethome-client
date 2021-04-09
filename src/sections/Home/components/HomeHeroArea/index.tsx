import React from "react";
import { Card, Carousel, Col, Input, Row, Typography } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { displayErrorMessage } from "../../../../lib/utils";

import torontoImage from "../../assets/toronto.jpg";
import dubaiImage from "../../assets/dubai.jpg";
import losAngelesImage from "../../assets/los-angeles.jpg";
import londonImage from "../../assets/london.jpg";

const { Title } = Typography;
const { Search } = Input;

export const HomeHeroArea = () => {
    const history = useHistory();

    const onSearch = (value: string) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length === 0) return displayErrorMessage(`Please enter a valid search!`);
        history.push(`/listings/${trimmedValue}`);
    };

    return (
        <div className="home-hero">
            <Carousel
                className="home-hero__carousel"
                autoplay
                autoplaySpeed={5000}
                pauseOnHover={false}
                dots={false}
                speed={1200}
                // waitForAnimate
                useCSS
                useTransform
                // speed={10}
                // fade={true}
                effect="fade">
                <div className="home-hero__image home-hero__image-1">{/* <div></div> */}</div>
                <div className="home-hero__image home-hero__image-2">{/* <div></div> */}</div>
                <div className="home-hero__image home-hero__image-3">{/* <div></div> */}</div>
                <div className="home-hero__image home-hero__image-4">{/* <div></div> */}</div>
            </Carousel>
            <div className="home-hero__search">
                <Title className="home-hero__title">Find a place you'll love to stay at...</Title>
                <Search
                    onSearch={onSearch}
                    placeholder="Search 'London'"
                    size="large"
                    enterButton
                    className="home-hero__search-input"
                />
            </div>
            {/* <ArrowDownOutlined style={{ fontSize: "5rem", color: "red" }} /> */}
            {/* <div className="home-hero__image"></div> */}
            <Row gutter={12} data-aos-duration="4000" className="home-hero__cards">
                <Col xs={12} md={6}>
                    <Link to="/listings/toronto">
                        <Card
                            data-aos="zoom-out"
                            // data-aos-delay={400}
                            cover={<img src={torontoImage} alt="Toronto" />}>
                            Toronto
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} md={6}>
                    <Link to="/listings/dubai">
                        <Card
                            data-aos="zoom-out"
                            data-aos-delay={200}
                            cover={<img src={dubaiImage} alt="Dubai" />}>
                            Dubai
                        </Card>
                    </Link>
                </Col>
                <Col xs={0} md={6}>
                    <Link to="/listings/los%20angeles">
                        <Card
                            data-aos="zoom-out"
                            data-aos-delay={500}
                            cover={<img src={losAngelesImage} alt="Los Angeles" />}>
                            Los Angeles
                        </Card>
                    </Link>
                </Col>
                <Col xs={0} md={6}>
                    <Link to="/listings/london">
                        <Card
                            data-aos="zoom-out"
                            data-aos-delay={800}
                            cover={<img src={londonImage} alt="London" />}>
                            London
                        </Card>
                    </Link>
                </Col>
            </Row>
        </div>
    );
};

import React from "react";

import BackgroundImage1 from "../../../assets/images/slider_1.jpg";
import BackgroundImage2 from "../../../assets/images/slider_2.jpg";
import BackgroundImage3 from "../../../assets/images/slider_3.jpg";
import { Carousel } from "react-bootstrap";
import "./HomeBanner.scss";
import { Link } from "react-router-dom";

function HomeBanner() {
  return (
    <Carousel>
      <Carousel.Item>
        <div
          className="d-block w-100 main_slider"
          style={{
            backgroundImage: `url(${BackgroundImage1})`,
            backgroundPosition: "center top"
          }}
        >
          <div className="container fill_height">
            <div className="row align-items-center fill_height">
              <div className="col">
                <div className="main_slider_content" data-aos="fade-right">
                  <h6>Spring / Bộ sưu tập mùa hè 2023</h6>
                  <h1>Khuyến mãi cực lớn lên đến 30%</h1>
                  <div className="red_button shop_now_button">
                    <Link to="/category/t-shirt">Mua ngay</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div
          className="d-block w-100 main_slider"
          style={{
            backgroundImage: `url(${BackgroundImage2})`,
            backgroundPosition: "center top"

          }}
        >
          <div className="container fill_height">
            <div className="row align-items-center fill_height">
              <div className="col">
                <div className="main_slider_content" data-aos="fade-right">
                  <h6>Spring / Bộ sưu tập mùa xuân 2023</h6>
                  <h1>Khuyến mãi cực lớn lên đến 30%</h1>
                  <div className="red_button shop_now_button">
                    <Link to="/category/sweater">Mua ngay</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div
          className="d-block w-100 main_slider"
          style={{
            backgroundImage: `url(${BackgroundImage3})`,
            backgroundPosition: "center top"

          }}
        >
          <div className="container fill_height">
            <div className="row align-items-center fill_height">
              <div className="col">
                <div className="main_slider_content" data-aos="fade-right">
                  <h6>Spring / Bộ sưu tập đồ đi biển 2023</h6>
                  <h1>Khuyến mãi cực lớn lên đến 30%</h1>
                  <div className="red_button shop_now_button">
                    <Link to="/category/hoodie">Mua ngay</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomeBanner;

import React, { useState } from "react";

import DEALOFWEEK from "../../../assets/images/deal_ofthe_week.png";
import "./Advertisement.scss";
import { Link } from "react-router-dom";
const Advertisement = (localDate) => {
  const [date, setDate] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  });

  const calculateCountdown = (endDate) => {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  };

  const addLeadingZeros = (value) => {
    value = String(value);
    while (value.length < 2) {
      value = "0" + value;
    }
    return value;
  };

  setInterval(() => {
    const currentDate = calculateCountdown(localDate.localDate);
    currentDate ? setDate(currentDate) : clearInterval();
  }, 1000);

  return (
    <div className="deal_ofthe_week" data-aos="fade-up">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="deal_ofthe_week_img">
              <img src={DEALOFWEEK} alt="" />
            </div>
          </div>
          <div className="col-lg-6 text-right deal_ofthe_week_col">
            <div className="deal_ofthe_week_content d-flex flex-column align-items-center float-right">
              <div className="section_title">
                <h2>Khuyến mại cực SỐC !!!</h2>
              </div>
              <ul className="timer">
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="day" className="timer_num">
                    {addLeadingZeros(date.days)}{" "}
                  </div>
                  <div className="timer_unit">
                    {date.days === 1 ? "Ngày" : "Ngày"}
                  </div>
                </li>
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="hour" className="timer_num">
                    {addLeadingZeros(date.hours)}
                  </div>
                  <div className="timer_unit">Giờ</div>
                </li>
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="minute" className="timer_num">
                    {addLeadingZeros(date.min)}
                  </div>
                  <div className="timer_unit">Phút</div>
                </li>
                <li className="d-inline-flex flex-column justify-content-center align-items-center">
                  <div id="second" className="timer_num">
                    {addLeadingZeros(date.sec)}
                  </div>
                  <div className="timer_unit">Giây</div>
                </li>
              </ul>
              <div className="red_button deal_ofthe_week_button">
                <Link to="/category/t-shirt">Mua ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Advertisement.defaultProps = {
  date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toString(),
};

export default Advertisement;

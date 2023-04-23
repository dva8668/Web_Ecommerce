import React from "react";
import "./Category.scss";
import { Link } from "react-router-dom";

function Filter() {
  return (
    <div className="sidebar_section">
      <div className="sidebar_title">
        <h5>Product Category</h5>
      </div>
      <ul className="sidebar_categories">
        <li>
          <Link to="#">New Arrivals</Link>
        </li>
        <li>
          <Link to="#">Best Seller</Link>
        </li>
        <li>
          <Link to="/category/t-shirt">T-shirt</Link>
        </li>
        <li>
          <Link to="/category/sweater">Sweater</Link>
        </li>
        <li>
          <Link to="/category/hoodie">Hoodie</Link>
        </li>
      </ul>
    </div>
  );
}

export default Filter;

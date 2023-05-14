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
          <Link to="/category/t-shirt">Áo thun</Link>
        </li>
        <li>
          <Link to="/category/sweater">Áo thu đông</Link>
        </li>
        <li>
          <Link to="/category/hoodie">Áo Hoodie</Link>
        </li>
      </ul>
    </div>
  );
}

export default Filter;

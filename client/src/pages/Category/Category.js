import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SingleProduct from "../../layouts/components/SingleProduct/SingleProduct";
import Filter from "./Filter";
import "./Category.scss";
import apiRequest from "../../hooks/api";

function Category() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const path =
    window.location.href.split("/")[window.location.href.split("/").length - 1];
  const addToBag = (params) => {
    localStorage.setItem("cart", params);
  };

  useEffect(() => {
    async function getCategoryByPath() {
      try {
        const data = await apiRequest(`/product/getProductByCategory/${path}`);
        if (data.success) {
          setProducts(
            data.products.map((product) => {
              return {
                productId: product.productId,
                price: product.price,
                title: product.title,
                image: require(`../../assets/images/${product.image.name}`),
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCategoryByPath();
  }, [path]);
  return (
    <div className="container product_section_container">
      <div className="row">
        <div className="col product_section clearfix">
          <div className="breadcrumbs d-flex flex-row align-items-center">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="active">
                <Link to={`/category/${location.pathname.split("/")[2]}`}>
                  <i className="fa fa-angle-right" aria-hidden="true"></i>
                  {location.pathname.split("/")[2]}
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar">
            {/* <Filter applyFilters={applyFilters} /> */}
            <Filter />
          </div>
          <div className="main_content">
            <div className="products_iso">
             

              <div className="row">
                {products &&
                  products.slice(0, 8).map((item, index) => {
                    return (
                      <div
                        className="col-lg-3 col-sm-6"
                        key={index}
                        data-aos="zoom-in"
                      >
                        <SingleProduct productItem={item} addToBag={addToBag} />
                      </div>
                    );
                  })}
              </div>
              <div className="product_sorting_container product_sorting_container_bottom clearfix">
                <div className="pages d-flex flex-row align-items-center">
                  <div className="page_current">
                    <span>1</span>
                    <ul className="page_selection">
                      <li>
                        <Link to="#">1</Link>
                      </li>
                      <li>
                        <Link to="#">2</Link>
                      </li>
                      <li>
                        <Link to="#">3</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="page_total">
                    <span>of</span> 3
                  </div>
                  <div id="next_page_1" className="page_next">
                    <Link to="#" style={{ lineHeight: "12px" }}>
                      <i
                        className="fas fa-long-arrow-right"
                        aria-hidden="true"
                      ></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;

import React from "react";
import SingleProduct from "../SingleProduct/SingleProduct";
import Heading from "../Heading/Heading";

function BestSeller({ products, departments, addToBag }) {
  return (
    <div className="best_sellers">
      <div className="container">
        <div className="row">
          <Heading title="Best Sellers" data-aos="fade-up" />
        </div>

        <div className="row" style={{ marginTop: 50 }}>
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
      </div>
    </div>
  );
}

export default BestSeller;

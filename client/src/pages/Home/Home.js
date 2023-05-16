import { Fragment, useState, useEffect } from "react";
import HomeBanner from "../../layouts/components/HomeBanner/HomeBanner";
import CategoryBanner from "../../layouts/components/CategoryBanner/CategoryBanner";
import Benefit from "../../layouts/components/Benefit/Benefit";
import Advertisement from "../../layouts/components/Advertisement/Advertisement";
import BestSeller from "../../layouts/components/BestSeller/BestSeller";
import apiRequest from "../../hooks/api";
const addToBag = (params) => {
  localStorage.setItem("cart", params);
};

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      "date",
      new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toString()
    );
  }, []);

  useEffect(() => {
    async function getCategoryByPath() {
      try {
        // const data = await apiRequest(`/product/getProductByCategory/t-shirt`);
        const data = await apiRequest(`/product/getBestSeller`);
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
  }, []);

  return (
    <Fragment>
      <HomeBanner />
      <CategoryBanner />
      <BestSeller products={products} addToBag={addToBag} />
      <Benefit />
      <Advertisement localDate={localStorage.getItem("date")} />
    </Fragment>
  );
}

export default Home;

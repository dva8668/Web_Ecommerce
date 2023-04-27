import { Fragment, useEffect } from "react";
import HomeBanner from "../../layouts/components/HomeBanner/HomeBanner";
import CategoryBanner from "../../layouts/components/CategoryBanner/CategoryBanner";
import Benefit from "../../layouts/components/Benefit/Benefit";
import Advertisement from "../../layouts/components/Advertisement/Advertisement";
import BestSeller from "../../layouts/components/BestSeller/BestSeller";
import product123 from "../../assets/images/banner_1.jpg";
const products = [
  {
    _id: 1,
    title: "Ao Phong",
    imagePath: product123,
    price: 29.99,
  },
  {
    _id: 2,
    title: "Ao Phong 2",
    imagePath: product123,
    price: 29.99,
  },
  {
    _id: 3,
    title: "Ao 3",
    imagePath: product123,
    price: 29.99,
  },
  {
    _id: 4,
    title: "Ao Phong",
    imagePath: product123,
    price: 29.99,
  },
];

const addToBag = (params) => {
  localStorage.setItem("cart", params);
};

function Home() {
  useEffect(() => {
    localStorage.setItem(
      "date",
      new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toString()
    );
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

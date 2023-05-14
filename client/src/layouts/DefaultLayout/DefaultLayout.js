import { Link } from "react-router-dom";
import React, { memo, useEffect, useState, useContext } from "react";
import HomeCartView from "../components/HomeCartView/HomeCartView";
import "./DefaultLayout.scss";
import "./DefaultCss.scss";
import apiPrivate from "../../hooks/apiPrivate";
import { AuthContext } from "../../contexts/authContext";

const DefaultLayout = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    async function getCart() {
      if (localStorage["token"]) {
        setFetchLoading(false);
        try {
          const data = await apiPrivate("/cart/getCart");
          if (data.success) {
            const productIds = [
              ...new Set(data.cart.map((id) => id.productId)),
            ];
            const newProductPist = await Promise.all(
              productIds.map(async (productId) => {
                return await apiPrivate(`/product/getOneProduct/${productId}`);
              })
            );
            const newData = data.cart.map((item) => {
              let newItem = {};
              newProductPist.forEach((product) => {
                if (product.products.productId === item.productId) {
                  newItem = {
                    cartId: item.id,
                    productId: product.products.productId,
                    title: product.products.title,
                    color: item.color,
                    size: item.size,
                    quality: item.quality,
                    imagePath: product.products.imageLinks[0].name,
                    price: item.price * item.quality,
                  };
                }
              });
              if (newItem) return newItem;
            });
            const totalQty = newData.reduce((a, b) => a + b.quality, 0);
            const totalPrice = newData.reduce((a, b) => a + b.price, 0);

            setCart(newData);
            setTotalPrice(totalPrice);
            setTotalQty(totalQty);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setFetchLoading(true);
        }
      }
    }

    getCart();
  }, []);

  const deleteItem = async (i) => {
    try {
      const deleteItem = await apiPrivate(`cart/delete/${i.cartId}`, "DELETE");
      if (deleteItem.success) {
        const newCart = cart.filter((item) => item !== i);
        setCart(newCart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showHideModal = () => {
    setShow(!show);
  };

  return (
    <div className="main-wrapper">
      <div className="super_container">
        <header className="header">
          <div className="main_nav_container">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-right">
                  <div className="logo_container">
                    <Link to="/">
                      <span>Ha</span>Lao
                    </Link>
                  </div>
                  <nav className="navbar">
                    <ul className="navbar_menu">
                      <li>
                        <Link to="/">Trang chủ</Link>
                      </li>
                      <li>
                        <Link to="/category/t-shirt">Sản phẩm</Link>
                      </li>

                      
                    </ul>
                    {token || authState.isAuthenticated ? (
                      <ul className="navbar_user">
                        <li className="user">
                          <button>
                            <Link to="/profile">
                              <i className="fa fa-user" aria-hidden="true"></i>
                            </Link>
                          </button>
                        </li>
                        <li className="checkout">
                          <button onClick={() => showHideModal()}>
                            <i className="fas fa-shopping-bag"></i>
                            {totalQty !== undefined && (
                              <span
                                id="checkout_items"
                                className="checkout_items"
                              >
                                {totalQty}
                              </span>
                            )}
                          </button>
                        </li>
                      </ul>
                    ) : (
                      <ul className="navbar_user">
                        <li className="user">
                          <button>
                            <Link to="/login">
                              <i className="fa fa-user" aria-hidden="true"></i>
                            </Link>
                          </button>
                        </li>
                      </ul>
                    )}
                  </nav>
                </div>
              </div>
            </div>
            {show && fetchLoading ? (
              <HomeCartView
                cart={cart}
                totalPrice={totalPrice}
                show={show}
                showHideModal={showHideModal}
                handleDelete={(item) => deleteItem(item)}
              />
            ) : null}
          </div>
        </header>
        <div className="layout_Container">{children}</div>
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-6" style={{ paddingLeft: "20px" }}>
                <div className="footer_nav_container d-flex flex-sm-row flex-column align-items-center justify-content-lg-start justify-content-center text-center">
                  <ul className="footer_nav">
                    <li>
                      <Link to="#">Checking</Link>
                    </li>
                    <li>
                      <Link to="#">FAQs</Link>
                    </li>
                    <li>
                      <Link to="#">Contact us</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6" style={{ paddingRight: "20px" }}>
                <div className="footer_social d-flex flex-row align-items-center justify-content-lg-end justify-content-center">
                  <ul>
                    <li>
                      <Link to="https://fb.com/dva8668" target="_blank">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://fb.com/dva8668" target="_blank">
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://fb.com/dva8668" target="_blank">
                        <i className="fab fa-instagram"></i>
                      </Link>
                    </li>

                    <li>
                      <Link to="https://fb.com/dva8668" target="_blank">
                        <i className="fab fa-pinterest-p"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="footer_nav_container">
                  <div className="cr">
                    ©2022 All Rights Reserved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default memo(DefaultLayout);

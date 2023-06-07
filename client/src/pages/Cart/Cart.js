import React, { useEffect, useState } from "react";
import Heading from "../../layouts/components/Heading/Heading";
import CartItem from "./CartItem";
import { Button } from "react-bootstrap";
import EmptyCart from "../../assets/images/emptyCart.png";
import apiPrivate from "../../hooks/apiPrivate";
import ModalCheckout from "../../layouts/components/Modal/ModalCheckout";

function Cart() {
  const [cart, setCart] = useState();
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartSelect, setCartSelect] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    async function getCart() {
      setFetchLoading(false);
      try {
        const data = await apiPrivate("/cart/getCart");
        if (data.success) {
          const productIds = [...new Set(data.cart.map((id) => id.productId))];
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
            return newItem;
          });
          // const totalQty = newData.reduce((a, b) => a + b.quality, 0);
          // const totalPrice = newData.reduce((a, b) => a + b.price, 0);

          setCart(newData);
          // setTotalPrice(totalPrice);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetchLoading(true);
      }
    }

    if (localStorage["token"]) {
      getCart();
    }
  }, []);

  const postCart = async (item, increase, decrease) => {
    try {
      const updateItem = await apiPrivate(`cart/update/${item.cartId}`, "PUT", {
        increase,
        decrease,
      });
      if (updateItem.success) {
        const newCart = cart.map((i) => {
          if (
            i.productId === item.productId &&
            i.color === item.color &&
            i.size === item.size
          ) {
            if (decrease && i.quality > 1) {
              return {
                ...i,
                quality: i.quality - 1,
              };
            }
            if (increase) {
              return {
                ...i,
                quality: i.quality + 1,
              };
            }
          }
          return i;
        });
        setCart(newCart);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    fetchLoading && (
      <div className="shopping--cart" data-aos="fade-up">
        <div className="container">
          <div className="shopping--cart--container">
            <div className="row ">
              <Heading title="Your Shopping Cart" data-aos="fade-up" />
            </div>
            <div style={{ height: 30 }}></div>
            <CartItem
              items={cart || {}}
              setTotalPrice={setTotalPrice}
              handleClick={(pid, increase, decrease) =>
                postCart(pid, increase, decrease)
              }
              handleDelete={(item) => deleteItem(item)}
              cartSelect={cartSelect}
              setCartSelect={setCartSelect}
            />
            {cart ? (
              <div
                className="d-flex flex-column justify-content-end align-items-end"
                style={{ paddingRight: 50 }}
              >
                <p>
                  SubTotal :{" "}
                  <span style={{ color: "#FE4C50" }}>
                    {" "}
                    {(totalPrice * 1)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    đ
                  </span>
                </p>

                <h3 style={{ textAlign: "center" }}>
                  Total:{" "}
                  <span style={{ color: "#FE4C50" }}>
                    {" "}
                    {(totalPrice * 1)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    đ
                  </span>
                </h3>
                <hr />

                {cartSelect.length ? (
                  <Button
                    variant="danger"
                    size="lg"
                    style={{ marginTop: 30 }}
                    onClick={() => setOpen(true)}
                  >
                    Confirm Checkouts
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    disabled
                    size="lg"
                    style={{ marginTop: 30 }}
                  >
                    Confirm Checkouts
                  </Button>
                )}

                <ModalCheckout
                  open={open}
                  setOpen={setOpen}
                  cartSelect={cartSelect}
                  totalPrice={totalPrice}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src={EmptyCart}
                  alt=""
                  style={{ maxHeight: 400, maxWidth: 400 }}
                  className="img-fluid"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default Cart;

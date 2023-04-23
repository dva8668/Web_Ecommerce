import React, { useEffect, useContext, useState } from "react";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Button, Modal, Card, Avatar, Form, Row, Col, Input } from "antd";
import apiPrivate from "../../../hooks/apiPrivate";
import { AuthContext } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const ModalCheckout = ({ open, setOpen, cartSelect, totalPrice }) => {
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [openCheck, setOpenCheck] = useState(false);
  const [fetchedLoading, setFetchedLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await apiPrivate(`/userByUsername`);
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetchedLoading(true);
      }
    }
    getProfile();
  }, [authState]);

  const onFinish = async (values) => {
    console.log(values);

    if (authState.isAuthenticated) {
      try {
        const newValue = {
          ...values,
        };
        const updateUser = await apiPrivate(
          `/updateAddressByUsername`,
          "PUT",
          newValue
        );
        if (updateUser.success) {
          setUser({
            ...user,
            username: newValue.fullname,
            address: newValue.address,
            phone: newValue.phone,
          });
          setOpenCheck(false);
        } else {
          alert("Update failed!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOrder = async () => {
    try {
      setLoading(true);
      const createOrder = await apiPrivate("order/createOrder", "POST", {
        user: user,
        cart: cartSelect,
        totalPrice: totalPrice,
      });

      if (createOrder.success) {
        alert("Order successfully!");
        navigation("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    fetchedLoading && (
      <>
        <Modal
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={handleCancel}
          width={1200}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              danger
              loading={loading}
              onClick={handleOrder}
            >
              Order
            </Button>,
          ]}
        >
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "32px",
              color: "#fe4c50",
            }}
          >
            Checkout
          </h2>

          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#fe4c50",
                  fontSize: "20px",
                }}
              >
                <EnvironmentOutlined style={{ marginRight: 10 }} />
                Delivery address
              </div>
            }
            style={{
              boxSizing: "border-box",
              margin: "60px",
            }}
            bordered={false}
            extra={
              !openCheck && (
                <Button
                  type="dashed"
                  danger
                  className="open-modal"
                  onClick={() => setOpenCheck(true)}
                >
                  Edit
                </Button>
              )
            }
          >
            {!openCheck ? (
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                }
                title={`${user.fullname} ${user.phone}`}
                description={user.address}
              />
            ) : (
              <Form
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 14,
                }}
                name="update_user"
                layout="horizontal"
                onFinish={onFinish}
                scrollToFirstError
                initialValues={{
                  fullname: user.fullname,
                  phone: user.phone,
                  address: user.address,
                }}
              >
                <Row style={{ marginTop: 60 }}>
                  <Col xl={24} sx={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="fullname"
                      label="Your name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input style={{ width: "348px", marginLeft: "20px" }} />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="Phone number"
                      rules={[
                        {
                          required: true,
                          message: "Please input your phone number!",
                        },
                      ]}
                    >
                      <Input style={{ width: "348px", marginLeft: "20px" }} />
                    </Form.Item>
                    <Form.Item
                      name="address"
                      label="Your address"
                      rules={[
                        {
                          required: true,
                          message: "Please input your address!",
                        },
                      ]}
                    >
                      <Input
                        style={{ width: "348px", marginLeft: "20px" }}
                        placeholder="Ex: N05/21 Trieu khuc, Thanh Tri, Thanh Xuan, Ha Noi"
                      />
                    </Form.Item>

                    <Form.Item
                      style={{
                        marginTop: "60px",
                        float: "right",
                        marginRight: "60px",
                      }}
                    >
                      <Button
                        type="primary"
                        danger
                        className="open-modal"
                        htmlType="submit"
                        style={{ minWidth: "120px" }}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </Card>

          {cartSelect &&
            cartSelect.map((item, index) => (
              <div
                key={index}
                className="row shopping--cart--item"
                data-aos="fade-up"
              >
                <div className="col-sm-3">
                  <div className="cart--item--img">
                    <img
                      src={require(`../../../assets/images/${item.imagePath}`)}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="item-with-delete">
                    <div className="cart--item--title">{item.title}</div>
                  </div>
                  <div className="basket--item--quantity">
                    Color: <span>{item.color}</span>
                  </div>
                  <div className="basket--item--quantity">
                    Size: <span>{item.size}</span>
                  </div>
                  <div className="basket--item--quantity">
                    Quantity: <span>{item.quality}</span>
                  </div>
                </div>
                <div
                  className="col-sm-3 quality-with-icon"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div className="basket--item--price">
                    {" "}
                    Price:{" "}
                    <span>
                      {" "}
                      {(item.price * item.quality)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            ))}

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
            <p>
              Shipping : <span style={{ color: "#FE4C50" }}>25,000 đ</span>
            </p>

            <h3 style={{ textAlign: "center" }}>
              Total:{" "}
              <span style={{ color: "#FE4C50" }}>
                {" "}
                {(totalPrice * 1 + 25000)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                đ
              </span>
            </h3>
            <hr />
          </div>
        </Modal>
      </>
    )
  );
};
export default ModalCheckout;

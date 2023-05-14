import { Modal, Button } from "react-bootstrap";

import EmptyCart from "../../../assets/images/emptyCart.png";
import { useNavigate } from "react-router-dom";
import "./HomeCartView.scss";

function HomeCartView({ cart, show, showHideModal, totalPrice, handleDelete }) {
  const navigation = useNavigate();
  const goToChechout = () => {
    showHideModal();
    navigation("/cart");
  };

  return (
    <Modal show={show} onHide={() => showHideModal()} className="right">
      <Modal.Header closeButton>
        <Modal.Title>Giỏ hàng</Modal.Title>
       
      </Modal.Header>
      <Modal.Body className="modal-body-content">
        <div>
          {cart.length < 1 ? (
            <div className="empty--basket">
              <img src={EmptyCart} className="img-fluid" />
              <h4 style={{ textAlign: "center" }}>Empty cart</h4>
            </div>
          ) : (
            <div>
              {cart.map((item, index) => {
                return (
                  <div key={index} className="basket--item">
                    <div className="basket--item--img">
                      <img
                        src={require(`../../../assets/images/${item.imagePath}`)}
                        alt=""
                      />
                    </div>
                    <div className="basket--item--details">
                      <div className="item-with-delete">
                        <div className="basket--item--title">{item.title}</div>
                        <i
                          className="fa-solid fa-trash"
                          onClick={() => handleDelete(item)}
                        ></i>
                      </div>
                      <div className="basket--item--quantity">
                        Màu: <span>{item.color}</span>
                      </div>
                      <div className="basket--item--quantity">
                        Size: <span>{item.size}</span>
                      </div>
                      <div className="basket--item--quantity">
                        Số lượng: <span>{item.quality}</span>
                      </div>
                      <div className="basket--item--price">
                        {" "}
                        Giá:{" "}
                        <span>
                          {" "}
                          {(item.price * 1)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="total--price-container">
                <h3
                  style={{ textAlign: "right", marginTop: 16, marginRight: 16 }}
                >
                  Tổng:{" "}
                  <span style={{ color: "#FE4C50" }}>
                    {(totalPrice * 1)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    đ
                  </span>{" "}
                </h3>
                <Button
                  className="btn btn-gotocheckout "
                  variant="danger"
                  style={{
                    float: "right",
                    marginRight: 16,
                    marginTop: 20,
                    height: 36,
                    fontSize: 12,
                    backgroundColor: "#ff4d4f",
                    color: "white",
                  }}
                  onClick={goToChechout}
                >
                  {" "}
                  Go to checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default HomeCartView;

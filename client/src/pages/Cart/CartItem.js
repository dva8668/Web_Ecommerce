import React from "react";
import Form from "react-bootstrap/Form";

function CartItem({
  items,
  handleClick,
  setTotalPrice,
  handleDelete,
  cartSelect,
  setCartSelect,
}) {
  const handleChangValue = (value) => {
    setCartSelect((prew) => [...prew, value]);
    setTotalPrice([...cartSelect, value].reduce((a, b) => a + b.price, 0));
  };
  return (
    <div style={{ marginTop: 30 }}>
      <Form aria-label="Default select">
        {items &&
          items.map((item, index) => (
            <Form.Check
              key={index}
              inline
              type="checkbox"
              name="order"
              value={item}
              onChange={() => handleChangValue(item)}
              label={
                <div className="row shopping--cart--item" data-aos="fade-up">
                  <div className="col-sm-2">
                    <div className="cart--item--img">
                      <img
                        src={require(`../../assets/images/${item.imagePath}`)}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="item-with-delete">
                      <div className="cart--item--title">{item.title}</div>
                    </div>
                    <div className="basket--item--quantity">
                      Color: <span>{item.color}</span>
                    </div>
                    <div className="basket--item--quantity">
                      Size: <span>{item.size}</span>
                    </div>
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
                  <div
                    className="col-sm-5 quality-with-icon"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div className="quantity d-flex flex-column flex-sm-row align-items-sm-center">
                      <span style={{ fontSize: 14 }}>Quantity:</span>
                      <div className="quantity_selector">
                        <span
                          className="minus"
                          onClick={() => handleClick(item, false, true)}
                        >
                          <i className="fa fa-minus" aria-hidden="true"></i>
                        </span>
                        <span id="quantity_value"> {item.quality}</span>
                        <span
                          className="plus"
                          onClick={() => handleClick(item, true, false)}
                        >
                          <i className="fa fa-plus" aria-hidden="true"></i>
                        </span>
                      </div>
                    </div>
                    <div>
                      <i
                        className="fa-solid fa-trash"
                        onClick={() => handleDelete(item)}
                      ></i>
                    </div>
                  </div>
                </div>
              }
            ></Form.Check>
          ))}
      </Form>
    </div>
  );
}

export default CartItem;

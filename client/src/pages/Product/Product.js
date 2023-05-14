import React, { useState, useEffect } from "react";
import "./Product.scss";
import { Link } from "react-router-dom";
import apiPrivate from "../../hooks/apiPrivate";
import apiRequest from "../../hooks/api";
import { Button, Form, InputNumber, Select } from "antd";
import { useNavigate } from "react-router";

function ProductPage() {
  const navigate = useNavigate();

  const path =
    window.location.href.split("/")[window.location.href.split("/").length - 1];

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchedLoading] = useState(false);

  const [product, setProduct] = useState([]);
  const [image, setImage] = useState([]);
  const [variants, setVariants] = useState({});
  const [colors, setColors] = useState();
  const [size, setSize] = useState();
  const [colorData, setColorData] = useState();
  const [sizeData, setSizeData] = useState({});
  const [quality, setQuality] = useState();
  const [curentColor, setCurrentColor] = useState();

  useEffect(() => {
    async function GetProductById() {
      setFetchedLoading(false);
      try {
        const product = await apiRequest(`/product/getOneProduct/${path}`);
        const variants = await apiRequest(`/variant/getOneVariant/${path}`);

        if (product.success) {
          setProduct({
            ...product.products,
            imagePath: require(`../../assets/images/${product.products.imageLinks[0].name}`),
          });

          setImage(
            product.products.imageLinks.map((image) => {
              return {
                name: image.name,
                imagePath: require(`../../assets/images/${image.name}`),
              };
            })
          );
        }
        if (variants.success) {
          const newColorData = [
            ...new Set(variants.variants.map((variant) => variant.color)),
          ];

          const newSizeData = Object.assign(
            {},
            ...newColorData.map((color) => {
              const newSizeList = variants.variants.filter(
                (variant) => variant.color === color
              );
              return {
                [color]: newSizeList.map((size) => size.size),
              };
            })
          );

          const newQuality = variants.variants.find(
            (variant) =>
              variant.color === newColorData[0] &&
              variant.size === newSizeData[newColorData[0]][0]
          );

          setVariants(variants.variants);
          // color
          setColorData(newColorData);
          setColors(newSizeData[newColorData[0]]);
          // size
          setSizeData(newSizeData);
          setSize(newSizeData[newColorData[0]][0]);

          // quality
          setCurrentColor(newColorData[0]);
          setQuality(newQuality.quality);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetchedLoading(true);
      }
    }
    GetProductById();
  }, [path]);

  const handleChangeColor = (value) => {
    setCurrentColor(value);
    setColors(sizeData[value]);
    // set Quality
    const newQuality = variants.find(
      (variant) => variant.color === value && variant.size === size
    );
    setQuality(newQuality ? newQuality.quality : 0);
  };
  const onChangeSizeValue = (value) => {
    setSize(value);
    const newQuality = variants.find(
      (variant) => variant.color === curentColor && variant.size === value
    );
    setQuality(newQuality ? newQuality.quality : 0);
  };

  const handleThumbnailClick = (item) => {
    setProduct({ ...product, imagePath: item.imagePath });
  };

  const addToBag = async (values) => {
    setLoading(true);

    const token = localStorage.getItem("token")
    if (token) {

      try {
        const newValue = { ...values, productId: path, price: product.price };
        const post = await apiPrivate("/cart/createCart", "POST", newValue);
        if (post.success) {
          alert("Added to cart");
          navigate(0);
        } else alert("Failed to cart");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/login")
    }
    
  };

  return (
    <div className="container single_product_container">
      {fetchLoading && (
        <div>
          <div className="row">
            <div className="col">
              <div className="breadcrumbs d-flex flex-row align-items-center">
                <ul>
                  <li>
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li className="active">
                    <Link to={`/category/${product.category}`}>
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                      {product.category}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-7">
              <div className="single_product_pics">
                <div className="row">
                  <div className="col-lg-3 thumbnails_col order-lg-1 order-2">
                    <div className="single_product_thumbnails">
                      <ul>
                        {image &&
                          image.slice(0, 4).map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleThumbnailClick(item)}
                            >
                              <img
                                src={item.imagePath}
                                alt=""
                                className="img-fluid"
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-9 image_col order-lg-2 order-1">
                    <div className="single_product_image">
                      <div
                        className="single_product_image_background"
                        style={{
                          backgroundImage: `url(${product.imagePath})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="product_details">
                <div className="product_details_title">
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                </div>
                <div className="free_delivery d-flex flex-row align-items-center justify-content-center">
                  <span>
                    <i className="fas fa-truck"></i>
                  </span>
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="original_price">
                  {(product.price * 2 - 1)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  đ
                </div>
                <div className="product_price">
                  {(product.price * 1)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  đ
                </div>
                <ul className="star_rating">
                  <li>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </li>
                  <li>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </li>
                  <li>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </li>
                  <li>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </li>
                  <li>
                    <i className="fa fa-star-o" aria-hidden="true"></i>
                  </li>
                </ul>

                {/* form */}
                <Form
                  labelCol={{
                    span: 4,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  name="add to cart"
                  layout="horizontal"
                  scrollToFirstError
                  onFinish={addToBag}
                  initialValues={{
                    quality: 1,
                    color: colorData[0],
                    size: size,
                  }}
                  style={{ marginTop: 40 }}
                >
                  <Form.Item
                    name="color"
                    label="Màu"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: 220,
                      }}
                      onChange={handleChangeColor}
                      options={colorData.map((color) => ({
                        label: color,
                        value: color,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name="size"
                    label="Size"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: 220,
                      }}
                      onChange={onChangeSizeValue}
                      options={colors.map((size) => ({
                        label: size,
                        value: size,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item label="Số lượng">
                    <Form.Item
                      name="quality"
                      noStyle
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        disabled={quality ? false : true}
                        style={{
                          width: "120px",
                          height: "32px",
                        }}
                        min={1}
                        max={10}
                      />
                    </Form.Item>
                    <label style={{ marginLeft: 12 }}>
                      Còn lại
                      <span style={{ color: "#fe4c50" }}>{` ${quality} `}</span>
                      sản phẩm
                    </label>
                  </Form.Item>
                  <Form.Item style={{ marginTop: 20, marginLeft: 78 }}>
                    {loading ? (
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading
                        danger
                        style={{
                          minHeight: 42,
                          minWidth: 120,
                        }}
                      >
                        adding
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={quality ? false : true}
                        danger
                        style={{
                          minHeight: 42,
                          minWidth: 120,
                        }}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;

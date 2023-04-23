import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Row,
  Col,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import apiPrivate from "../../../hooks/apiPrivate";
const { Option } = Select;
const { TextArea } = Input;

const EditProduct = () => {
  const id =
    window.location.href.split("/")[window.location.href.split("/").length - 1];
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedLoading, setFetchedLoading] = useState(false);
  const [validate, setValidate] = useState("");
  const [product, setProduct] = useState({});

  // xu ly listFile khi them anh hoac xoa anh
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // submit form
  const onFinish = async (values) => {
    setLoading(true);
    const newValues = {
      ...values,
      description: values.description ? values.description : null,
      images: values.images.fileList
        ? values.images.fileList.map((image) => {
            return {
              status: image.status,
              name: image.name,
              thumbUrl: image.thumbUrl,
            };
          })
        : values.images.map((image) => {
            return {
              status: image.status,
              name: image.name,
              thumbUrl: image.thumbUrl,
            };
          }),
    };

    try {
      const dataUpdate = await apiPrivate(
        `/product/update/${id}`,
        "PUT",
        newValues
      );
      if (dataUpdate.success) {
        alert("Update successfully!");
      } else {
        alert("Update failed!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get product after render
  useEffect(() => {
    async function getProductbyId() {
      try {
        const product = await apiPrivate(`product/getOneProduct/${id}`);
        const variant = await apiPrivate(`variant/getOneVariant/${id}`);
        const newProduct = { ...product.products, variants: variant.variants };
        const newFileList = product.products.imageLinks.map((image) => {
          return {
            name: image.name,
            status: "done",
            type: "image/png",
            percent: 100,
            thumbUrl: `data:image/png;base64,${image.thumbUrl}`,
          };
        });
        setFileList(newFileList);
        setProduct(newProduct);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchedLoading(true);
      }
    }
    getProductbyId();
  }, [id]);

  return (
    fetchedLoading && (
      <>
        <h2 style={{ marginBottom: "60px" }}>Edit Product</h2>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          name="create"
          layout="horizontal"
          onFinish={onFinish}
          scrollToFirstError
          initialValues={{
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            path: product.path,
            variants: product.variants,
            images: fileList.map((file) => file),
          }}
        >
          <Row>
            <Col xl={12} sx={24} sm={24} md={24} lg={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  {
                    required: true,
                    message: "Please input this title!",
                    whitespace: true,
                  },
                ]}
              >
                <Input style={{ width: "348px" }} />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={10} style={{ width: "348px" }} />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: "Please input this price!",
                  },
                ]}
              >
                <InputNumber
                  min={10000}
                  addonAfter="VND"
                  style={{ width: "348px" }}
                />
              </Form.Item>

              <Form.Item
                name="path"
                label="Path"
                hasFeedback
                validateStatus={validate}
                rules={[
                  {
                    required: true,
                    message: "Please input this path!",
                  },
                ]}
              >
                <Input
                  style={{ width: "348px" }}
                  onFocus={() => setValidate("success")}
                />
              </Form.Item>
            </Col>
            <Col xl={12} sx={24} sm={24} md={24} lg={24}>
              <Form.Item label="Upload" name="images">
                <Upload
                  action="http://localhost:3001/product/image"
                  listType="picture-card"
                  accept="image/png, image/jpeg"
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 6 ? null : (
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.List label="Variants" name="variants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                          alignItems: "center",
                          right: "-112px",
                          width: "348px",
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "color"]}
                          noStyle
                        >
                          <Select
                            style={{
                              width: "120px",
                            }}
                          >
                            <Option value="black">Black</Option>
                            <Option value="white">White</Option>
                            <Option value="red">Red</Option>
                            <Option value="grey">Grey</Option>
                            <Option value="blue">Blue</Option>
                            <Option value="green">Green</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "size"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Missing last name",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Size"
                            style={{
                              width: "120px",
                            }}
                          >
                            <Option value="S">S</Option>
                            <Option value="M">M</Option>
                            <Option value="L">L</Option>
                            <Option value="XL">XL</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name={[name, "quality"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Quality is required",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="quality"
                            style={{
                              width: "100px",
                              height: "32px",
                            }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          style={{ width: "8px" }}
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item label="Variants">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{ width: "348px" }}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item
                name="category"
                label="Category"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please choose this category!",
                  },
                ]}
              >
                <Select style={{ width: "348px" }}>
                  <Select.Option value="t-shirt">T-shirt</Select.Option>
                  <Select.Option value="sweater">Sweater</Select.Option>
                  <Select.Option value="hoodie">Hoodie</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginTop: "60px" }}>
                {loading ? (
                  <Button type="primary" htmlType="submit" loading>
                    Updating
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    )
  );
};
export default EditProduct;

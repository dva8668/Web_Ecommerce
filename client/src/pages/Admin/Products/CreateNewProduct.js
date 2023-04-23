import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Row,
  Col,
} from "antd";
import { useState } from "react";
import apiPrivate from "../../../hooks/apiPrivate";

const { TextArea } = Input;

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateNewProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validate, setValidate] = useState("");

  // xu ly preview image
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };

  // xu ly listFile khi them anh hoac xoa anh
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // submit form
  const onFinish = async (values) => {
    setLoading(true);
    const newValues = {
      ...values,
      description: values.description ? values.description : null,
      images: values.images.fileList.map((image) => {
        return {
          uid: image.uid,
          status: image.status,
          name: image.name,
          thumbUrl: image.thumbUrl,
        };
      }),
    };
    try {
      const data = await apiPrivate("/product/create", "POST", newValues);
      if (data.success) {
        alert("Create product successfully!");
      } else {
        alert("Create failled!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: "60px" }}>Create New Product</h2>
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
          color: ["black", "white"],
          size: ["M", "L", "XL"],
          category: "t-shirt",
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
              name="quality"
              label="Quality"
              rules={[
                {
                  required: true,
                  message: "Please input this quality!",
                },
              ]}
            >
              <InputNumber
                min={10}
                addonAfter="/Size /Color"
                style={{ width: "348px" }}
              />
            </Form.Item>
            <Form.Item
              name="path"
              label="Supplier"
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
            <Form.Item
              label="Upload"
              name="images"
              rules={[
                {
                  required: true,
                  message: "Please choose this images!",
                },
              ]}
            >
              <Upload
                action="http://localhost:3001/product/image"
                listType="picture-card"
                accept="image/png, image/jpeg"
                fileList={fileList}
                onPreview={handlePreview}
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
            <Form.Item
              name="color"
              label="Color"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please choose this color!",
                },
              ]}
            >
              <Select mode="multiple">
                <Select value="black">Black</Select>
                <Select value="white">White</Select>
                <Select value="red">Red</Select>
                <Select value="grey">Grey</Select>
                <Select value="blue">Blue</Select>
                <Select value="green">Green</Select>
              </Select>
            </Form.Item>
            <Form.Item
              name="size"
              label="Size"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please choose this size!",
                  type: "array",
                },
              ]}
            >
              <Select mode="multiple">
                <Select value="S">S</Select>
                <Select value="M">M</Select>
                <Select value="L">L</Select>
                <Select value="XL">XL</Select>
              </Select>
            </Form.Item>
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
                  Creating
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default CreateNewProduct;

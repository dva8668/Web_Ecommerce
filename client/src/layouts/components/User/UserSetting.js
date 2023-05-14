import { UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Radio,
  Avatar,
  Row,
  Col,
  Space,
  DatePicker,
  Skeleton,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import DefaultUser from "./DefaultUser";
import { AuthContext } from "../../../contexts/authContext";
import apiPrivate from "../../../hooks/apiPrivate";

const UserSetting = () => {
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetchedLoading, setFetchedLoading] = useState(false);
  const [user, setUser] = useState({});

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
  }, []);

  // submit form
  const onFinish = async (values) => {
    if (authState.isAuthenticated) {
      setLoading(true);
      console.log(values.date);
      try {
        const newValue = {
          ...values,
          dateofbirth: values.date.$d.toISOString().split("T")[0],
        };
        const updateUser = await apiPrivate(
          `/updateUserByUsername`,
          "PUT",
          newValue
        );
        if (updateUser.success) {
          alert("Update successfully!");
        } else {
          alert("Update failed!");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {fetchedLoading ? (
        <DefaultUser>
          <div style={{ borderBottom: "2px solid #efefef" }}>
            <h1>Thông tin cá nhân</h1>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản.</p>
          </div>
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
              email: user.username,
              phone: user.phone,
              gender: user.gender,
              address: user.address,
              date: user.dateofbirth && dayjs(user.dateofbirth, "YYYY/MM/DD"),
            }}
          >
            <Row style={{ marginTop: 60 }}>
              <Col xl={16} sx={24} sm={24} md={24} lg={24}>
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
                  <Input style={{ width: "348px" }} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Your email"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input style={{ width: "348px" }}  />
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
                  <Input style={{ width: "348px" }} />
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
                    style={{ width: "348px" }}
                    placeholder="Ex: N05/21 Trieu khuc, Thanh Tri, Thanh Xuan, Ha Noi"
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label="Gender"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please choose your gender!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="male"> Male </Radio>
                    <Radio value="famale"> Female </Radio>
                    <Radio value="other"> Other </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="date" label="Date of birth">
                  <DatePicker format="YYYY/MM/DD" style={{ width: "348px" }} />
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
              <Col
                xl={8}
                sx={24}
                sm={24}
                md={24}
                lg={24}
                style={{ borderLeft: "2px solid #efefef" }}
              >
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={140}
                    icon={<UserOutlined />}
                    style={{ lineHeight: " 86px" }}
                  />
                  <h2>{user.fullname}</h2>
                </Space>
              </Col>
            </Row>
          </Form>
        </DefaultUser>
      ) : (
        <Skeleton
          avatar
          paragraph={{
            rows: 4,
          }}
        />
      )}
    </>
  );
};

export default UserSetting;

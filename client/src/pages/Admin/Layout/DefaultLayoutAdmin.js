import {
  PoweroffOutlined,
  ShopOutlined,
  UserOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <NavLink to="/dashboard">Dashboard</NavLink>,
    "dashboard",
    <ShopOutlined />
  ),

  getItem("Orders", "Orders", <ShoppingOutlined />, [
    getItem(<NavLink to="/dashboard/orders">Orders</NavLink>, "orders"),
    getItem(
      <NavLink to="/dashboard/create-order">Create craft order</NavLink>,
      "create-order"
    ),
  ]),
  getItem("Products", "Products", <TagOutlined />, [
    getItem(
      <NavLink to="/dashboard/create-new-product">Create Product</NavLink>,
      "create-new-product"
    ),
    getItem(<NavLink to="/dashboard/products">Products</NavLink>, "products"),
    getItem(
      <NavLink to="/dashboard/collections">Collections</NavLink>,
      "collections"
    ),
  ]),
  getItem(
    <NavLink to="/dashboard/users">Users</NavLink>,
    "users",
    <UserOutlined />
  ),
  getItem(
    <span
      style={{ paddingRight: "80px" }}
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        window.location.href = "/login";
      }}
    >
      Logout
    </span>,
    "logout",
    <PoweroffOutlined />
  ),
];

const DefaultLayoutAdmin = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const first =
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];

  const [key, setKey] = useState(first);
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[key]}
          items={items}
          onSelect={(item) => setKey(item.key)}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
        }}
      >
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              minHeight: "calc(100vh - 24px - 69px)",
            }}
          >
            {children}
          </div>
        </Content>
       
      </Layout>
    </Layout>
  );
};
export default DefaultLayoutAdmin;

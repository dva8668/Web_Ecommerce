import {
  PoweroffOutlined,
  ShopOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import "./UserSetting.scss";
import { AuthContext } from "../../../contexts/authContext";

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link to="/profile">Thông tin</Link>, "profile", <ShopOutlined />),
  getItem(<Link to="/orders">Đã mua</Link>, "orders", <PercentageOutlined />),
  getItem(
    <span
      style={{ paddingRight: "80px" }}
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        window.location.href = "/login";
      }}
    >
      Đăng xuất
    </span>,
    "logout",
    <PoweroffOutlined />
  ),
];

const DefaultUser = ({ children }) => {
  const { authState } = useContext(AuthContext);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const token = localStorage.getItem("token");
  const first =
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];

  const [key, setKey] = useState(first);
  if (authState.isAuthenticated || token) {
    return (
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "calc(100vh - 124px)",
            position: "fixed",
            left: 0,
            top: "124px",
            bottom: 0,
          }}
        >
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
  } else return <Navigate to="/login" replace />;
};

export default DefaultUser;

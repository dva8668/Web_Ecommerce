import React, { useEffect, useState } from "react";
import { Space, Table, Button, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ModalOrderAdmin from "../../../pages/Admin/Components/ModalOrderAdmin";
import apiPrivate from "../../../hooks/apiPrivate";
import DefaultUser from "./DefaultUser";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState();
  const [username, setUsername] = useState();

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: "60px",
    },
    {
      title: "Tên của bạn",
      dataIndex: "fullname",
      key: "fullname",
      ellipsis: true,
      sorter: { compare: (a, b) => a.fullname.length - b.fullname.length },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      width: "240px",
    },

    {
      title: "Thanh Toán",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: {
        compare: (a, b) => a.totalPrice - b.totalPrice,
        multiple: 2,
      },
      render: (text) => <>{text} VND</>,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      sorter: true,
      render: (text) => <>{text.toUpperCase()}</>,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      ellipsis: true,
      defaultSortOrder: "descend",
      sorter: {
        compare: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      },
      render: (text) => <>{text.split("T")[0]}</>,
    },
    {
      title: "Action",
      key: "action",
      width: "180px",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                setUsername(record.username);
                setOrderId(record.orderId);
                setOpen(true);
              }}
            >
              More
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    async function getAllOrders() {
      try {
        const data = await apiPrivate(
          "http://localhost:3001/order/getAllOrderByUsername"
        );
        if (data.success) {
          const newOrders = data.orders.map((order, index) => {
            return {
              key: index + 1,
              ...order,
            };
          });
          setOrders(newOrders);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAllOrders();
  }, []);

  return (
    <DefaultUser>
      <Table columns={columns} dataSource={orders} />
      <ModalOrderAdmin
        open={open}
        setOpen={setOpen}
        orderId={orderId}
        username={username}
      />
    </DefaultUser>
  );
};
export default UserOrder;

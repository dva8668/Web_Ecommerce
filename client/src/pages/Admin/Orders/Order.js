import React, { useEffect, useState, useRef } from "react";
import {
  Space,
  Table,
  Form,
  Button,
  Input,
  Popconfirm,
  Select,
  DatePicker,
} from "antd";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import Highlighter from "react-highlight-words";
import ModalOrderAdmin from "../Components/ModalOrderAdmin";
import apiPrivate from "../../../hooks/apiPrivate";

const { RangePicker } = DatePicker;
const Order = () => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState();
  const [username, setUsername] = useState();
  const [ordersPickerDate, setordersPickerDate] = useState([]);
  const [detailOrderPicker, setDetailOrderPicker] = useState([]);
  const [dataExport, setDataExport] = useState([]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const onChange = async (value) => {
    try {
      const data = await apiPrivate(
        `http://localhost:3001/order/editOrder/${value.orderId}`,
        "PUT",
        value
      );
      if (data.success) {
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            height: 32,
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              display: "flex",
              width: 90,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
              height: 32,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: "60px",
    },
    {
      title: "Email",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      ...getColumnSearchProps("username"),
      width: "240px",
    },
    {
      title: "Customer",
      dataIndex: "fullname",
      key: "fullname",
      ellipsis: true,
      sorter: { compare: (a, b) => a.fullname.length - b.fullname.length },
    },
    {
      title: "Cost",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: {
        compare: (a, b) => a.totalPrice - b.totalPrice,
        multiple: 2,
      },
      render: (text) => <>{text} VND</>,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      sorter: true,
      render: (_, record) => {
        return (
          <Select
            showSearch
            placeholder="Select status"
            optionFilterProp="children"
            onChange={(value) => onChange({ ...record, status: value })}
            defaultValue={[record.status]}
            width="120px"
            options={[
              {
                value: "pending",
                label: <p style={{ color: "grey" }}>PENDDING</p>,
              },
              {
                value: "shipping",
                label: <p style={{ color: "#ff4d4f" }}>SHIPPING</p>,
              },
              {
                value: "shiped",
                label: <p style={{ color: "green" }}>SHIPPED</p>,
              },
            ]}
          />
        );
      },
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

            <Popconfirm
              title="Delete this product"
              description="Are you sure to delete this product?"
              okText="Delete"
              onConfirm={() => handleConfirmDelete(record.orderId)}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                    padding: 0,
                  }}
                />
              }
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  async function handleConfirmDelete(id) {
    try {
      const data = await apiPrivate(
        `http://localhost:3001/order/delete/${id}`,
        "DELETE"
      );
      if (data.success) {
        setOrders(orders.filter((order) => order.orderId !== id));
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  useEffect(() => {
    async function getAllOrders() {
      try {
        const data = await apiPrivate(
          "http://localhost:3001/order/getAllOrder"
        );
        if (data.success) {
          const newOrders = data.orders.map((order, index) => {
            return {
              key: index + 1,
              ...order,
            };
          });
          setOrders(newOrders);
          setordersPickerDate(newOrders);

          try {
            const newData = await Promise.all(
              newOrders.map(async (order) => {
                const detail = await apiPrivate(
                  `order/getOrderById/${order.orderId}`
                );
                return detail.orders.map((detailOd) => {
                  return {
                    ID: detailOd.orderId,
                    Customer: detailOd.fullname,
                    Address: detailOd.address,
                    Product: detailOd.productName,
                    Color: detailOd.productColor,
                    Size: detailOd.productSize,
                    Quality: detailOd.quality,
                    Price: detailOd.price,
                    TotalPrice: detailOd.totalPrice,
                    Date: detailOd.orderDate,
                  };
                });
              })
            );

            const newDetail = Array.prototype.concat.apply([], newData);
            setDetailOrderPicker(newDetail);
            setDataExport(newDetail);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAllOrders();
  }, []);

  const onFinishDate = (fieldsValue) => {
    const rangeValue = fieldsValue["range-picker"];
    const values = [
      rangeValue[0].format("YYYY-MM-DD"),
      rangeValue[1].format("YYYY-MM-DD"),
    ];
    const newOrder = orders.filter((order) => {
      const newDate = order.orderDate.split("T")[0];
      if (values[0] <= newDate && newDate <= values[1]) {
        return order;
      }
    });
    setordersPickerDate(newOrder);

    setDataExport(
      detailOrderPicker.filter((order) =>
        newOrder.find(({ orderId }) => order.ID === orderId)
      )
    );
  };

  return (
    <>
      <Form
        name="time_related_controls"
        onFinish={onFinishDate}
        style={{
          maxWidth: 600,
          marginBottom: 20,
          display: "inline-flex",
          float: "left",
        }}
      >
        <Form.Item
          name="range-picker"
          label="Select time"
          rules={[
            {
              type: "array",
              required: true,
            },
          ]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item style={{ marginLeft: 20 }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 20 }}>
          <Button
            type="dashed"
            onClick={() => {
              setordersPickerDate(orders);
              setDataExport(detailOrderPicker);
            }}
          >
            Reset Filter
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 20 }}>
          <CSVLink
            data={dataExport}
            // asyncOnClick={true}
            // onClick={handleExport}
            style={{ color: "red" }}
          >
            {" "}
            Export
          </CSVLink>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={ordersPickerDate} />
      <ModalOrderAdmin
        open={open}
        setOpen={setOpen}
        orderId={orderId}
        username={username}
      />
    </>
  );
};
export default Order;

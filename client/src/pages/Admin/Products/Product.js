import React, { useEffect, useState, useRef } from "react";
import { Space, Table, Tag, Button, Input, Popconfirm } from "antd";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

import apiPrivate from "../../../hooks/apiPrivate";

const Product = ({ params }) => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      title: "Product",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      ...getColumnSearchProps("title"),
      render: (_, record) => (
        <Link to={`/product/${record.productId}`}>{record.title}</Link>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
        multiple: 2,
      },
      render: (text) => <>{text} VND</>,
    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      ellipsis: true,
      sorter: { compare: (a, b) => new Date(a.date) - new Date(b.date) },
      render: (text) => <>{new Date(text).toUTCString()}</>,
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (text) => {
        let color = text.length < 7 ? "geekblue" : "green";
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button>
              <Link to={`/dashboard/edit-product/${record.productId}`}>
                Edit
              </Link>
            </Button>

            <Popconfirm
              title="Delete this product"
              description="Are you sure to delete this product?"
              okText="Delete"
              onConfirm={() => handleConfirmDelete(record.productId)}
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

  useEffect(() => {
    async function getAllProduct() {
      try {
        setLoading(true);
        const data = params
          ? await apiPrivate(
              `http://localhost:3001/product/getProductByCategory/${params}`
            )
          : await apiPrivate("http://localhost:3001/product/getAllProduct");
        if (data) {
          const newProduct = data.products.map((product, index) => {
            return {
              key: index + 1,
              ...product,
            };
          });
          setProduct(newProduct);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getAllProduct();
  }, [params]);

  async function handleConfirmDelete(id) {
    try {
      setLoading(true);
      const data = await apiPrivate(
        `http://localhost:3001/product/delete/${id}`,
        "DELETE"
      );
      if (data.success) {
        const newProduct = product.filter((prod) => {
          return prod.productId !== id;
        });
        setProduct(newProduct);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Table
      columns={columns}
      dataSource={product}
      pagination={{
        pageSize: 10,
      }}
      // scroll={{
      //   y: 540,
      // }}
      loading={loading}
    />
  );
};
export default Product;

import React, { useEffect, useState, useRef } from "react";
import { Space, Table, Button, Input, Popconfirm } from "antd";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalOrderAdmin from "../Components/ModalOrderAdmin";

import apiPrivate from "../../../hooks/apiPrivate";

const User = () => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState();
  const [username, setUsername] = useState();

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
      title: "Email",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      ...getColumnSearchProps("username"),
      width: "240px",
    },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      ellipsis: true,
      sorter: { compare: (a, b) => a.fullname.length - b.fullname.length },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: {
        compare: (a, b) => a.phone - b.phone,
      },
      render: (text) => <>{text}</>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      sorter: {
        compare: (a, b) => a.gender.length - b.gender.length,
      },
      render: (text) => <>{text}</>,
    },

    {
      title: "Birthday",
      dataIndex: "dateofbirth",
      key: "dateofbirth",
      ellipsis: true,
      sorter: {
        compare: (a, b) => new Date(a.dateofbirth) - new Date(b.dateofbirth),
      },
      render: (text) => <>{new Intl.DateTimeFormat().format(new Date(text))}</>,
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
              title="Delete this user"
              description="Are you sure to delete this user?"
              okText="Delete"
              onConfirm={() => handleConfirmDelete(record.username)}
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

  async function handleConfirmDelete(username) {
    try {
      const data = await apiPrivate(
        `http://localhost:3001/delete/${username}`,
        "DELETE"
      );
      if (data.success) {
        setUsers(users.filter((user) => user.username !== username));
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  useEffect(() => {
    async function getAllProduct() {
      try {
        const data = await apiPrivate("http://localhost:3001/getAllUser");
        if (data.success) {
          const newusers = data.users.map((user, index) => {
            return {
              key: index + 1,
              ...user,
            };
          });
          setUsers(newusers);
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
    getAllProduct();
  }, []);

  console.log(users);

  return (
    <>
      <Table columns={columns} dataSource={users} />
      <ModalOrderAdmin
        open={open}
        setOpen={setOpen}
        orderId={orderId}
        username={username}
      />
    </>
  );
};
export default User;

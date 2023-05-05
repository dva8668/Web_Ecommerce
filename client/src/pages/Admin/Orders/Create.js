import React, { useEffect, useState } from "react";

import { Row, Col, Form, Button, DatePicker, List, Typography } from "antd";
import apiPrivate from "../../../hooks/apiPrivate";
const { RangePicker } = DatePicker;

const Create = () => {
  const [detailOrders, setDetailOrders] = useState([]);

  const [fetchedLoading, setFetchLoading] = useState(false);

  async function getDashBoard() {
    if (localStorage["token"]) {
      setFetchLoading(false);
      try {
        const data = await apiPrivate(
          "http://localhost:3001/order/getOrderQuality"
        );
        if (data.success) {
          setDetailOrders(data.orders);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetchLoading(true);
      }
    }
  }
  useEffect(() => {
    getDashBoard();
  }, []);

  setTimeout(() => {
    getDashBoard();
  }, 6000);

  const onFinishDate = (fieldsValue) => {
    const rangeValue = fieldsValue["range-picker"];
    const values = [
      rangeValue[0].format("YYYY-MM-DD"),
      rangeValue[1].format("YYYY-MM-DD"),
    ];
  };

  // HANDLE RESET
  const handleReset = () => {};

  return fetchedLoading ? (
    <>
      <Row>
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
            <Button type="dashed" onClick={handleReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Row>
        <Col xl={24} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Top order</h2>
          <List
            dataSource={detailOrders}
            bordered
            renderItem={(item) => (
              <List.Item
                style={{ display: "flex", float: "left", width: "100%" }}
              >
                {item.productName}{" "}
                <Typography.Text style={{ marginLeft: "200px" }} mark>
                  {item["COUNT(*)"]}
                </Typography.Text>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  ) : null;
};
export default Create;

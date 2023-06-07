import React, { useEffect, useState } from "react";
import { TinyArea } from "@ant-design/plots";
import { Row, Col, Form, Button, DatePicker, List, Typography } from "antd";
import apiPrivate from "../../../hooks/apiPrivate";
import { socket } from "../../../utils/socket";

const { RangePicker } = DatePicker;

const DemoTinyArea = ({ qualityOrders }) => {
  const result = qualityOrders.map((order) => order["COUNT(*)"]);
  const sumWithInitial = result.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const config = {
    height: 600,
    autoFit: false,
    data: result,
    smooth: true,
    tooltip: true,
    annotations: [
      {
        type: "line",
        start: ["min", sumWithInitial / result.length],
        end: ["max", sumWithInitial / result.length],
        text: {
          content: "Min",
          offsetY: -2,
          style: {
            textAlign: "left",
            fontSize: 10,
            fill: "rgba(44, 53, 66, 0.45)",
            textBaseline: "bottom",
          },
        },
        style: {
          stroke: "#fe4c50",
        },
      },
      {
        type: "line",
        start: ["min", sumWithInitial / result.length + 2],
        end: ["max", sumWithInitial / result.length + 2],
        text: {
          content: "Max",
          offsetY: -2,
          style: {
            textAlign: "left",
            fontSize: 10,
            fill: "rgba(44, 53, 66, 0.45)",
            textBaseline: "bottom",
          },
        },
        style: {
          stroke: "rgba(0, 0, 0, 0.55)",
        },
      },
    ],
  };
  return <TinyArea {...config} />;
};
const RealTime = () => {
  const [detailOrders, setDetailOrders] = useState([]);
  const [qualityOrders, setQualityOrders] = useState([]);

  const [fetchedLoading, setFetchLoading] = useState(false);

  useEffect(() => {
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

          const data2 = await apiPrivate(
            "http://localhost:3001/order/getQualityByDate"
          );
          if (data2.success) {
            const dataSort = data2.orders.sort((a, b) => {
              return (
                new Date(a["substring(orderDate,1,10)"]) -
                new Date(b["substring(orderDate,1,10)"])
              );
            });

            setQualityOrders(dataSort);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setFetchLoading(true);
        }
      }
    }
    getDashBoard();
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("sendDataServer", ({ newDate, cartSelect }) => {
      setQualityOrders((prev) => {
        if (prev[prev.length - 1]["substring(orderDate,1,10)"] === newDate) {
          return prev.map((order) => {
            if (order["substring(orderDate,1,10)"] === newDate) {
              return {
                ...order,
                "COUNT(*)": order["COUNT(*)"] + 1,
              };
            }
            return order;
          });
        } else {
          return [
            ...prev,
            {
              "COUNT(*)": 1,
              "substring(orderDate,1,10)": newDate,
            },
          ];
        }
      });

      setDetailOrders((prev) => {
        return prev.map((order) => {
          if (order.productName === cartSelect[0].title) {
            return {
              ...order,
              "COUNT(*)": order["COUNT(*)"] + cartSelect[0].quality,
            };
          }
          return order;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return fetchedLoading ? (
    <>
      <Row>
        <Form
          name="time_related_controls"
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
            <Button type="dashed">Reset</Button>
          </Form.Item>
        </Form>
      </Row>
      <Row>
        <Col xl={12} sx={12} sm={12} md={12} lg={12}>
          <DemoTinyArea qualityOrders={qualityOrders} />
        </Col>
        <Col xl={12} sx={12} sm={12} md={12} lg={12}>
          <h2 style={{ marginTop: "60px" }}>Order Realtime</h2>
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
export default RealTime;

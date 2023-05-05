import React, { useEffect, useState } from "react";

import { Pie, measureTextWidth, Line } from "@ant-design/plots";
import { Row, Col, Card, Form, Button, DatePicker } from "antd";
import apiPrivate from "../../hooks/apiPrivate";
const { RangePicker } = DatePicker;

const DemoPie = ({ shirt, sweater, hoodie }) => {
  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(
      text,
      style
    );
    const R = containerWidth / 2;

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
          )
        ),
        1
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : "inherit"
    };">${text}</div>`;
  }

  const data = [
    {
      type: "T-shirt",
      value: shirt > 0 ? shirt : null,
    },
    {
      type: "Sweater",
      value: sweater > 0 ? sweater : null,
    },
    {
      type: "Hoodie",
      value: hoodie > 0 ? hoodie : null,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (value) => `${value} VND`,
      },
    },
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        textAlign: "center",
      },
      autoRotate: false,
      content: "{value}",
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : "Orders";
          return renderStatistic(d, text, {
            fontSize: 28,
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: "32px",
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${datum.value} Pcs`
            : `${data.reduce((r, d) => r + d.value, 0)} Pcs`;
          return renderStatistic(width, text, {
            fontSize: 32,
          });
        },
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
      {
        type: "pie-statistic-active",
      },
    ],
  };
  return <Pie {...config} />;
};

const DemoLine = ({ countQuality }) => {
  countQuality = countQuality.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  const config = {
    data: countQuality,
    padding: "auto",
    xField: "date",
    yField: "quality",
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
  };
  return <Line {...config} />;
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [detailOrders, setDetailOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [users, setUsers] = useState([]);
  const [qualityCollection, setQualityCollection] = useState({
    "t-shirt": 0,
    sweater: 0,
    hoodie: 0,
  });
  const [countQuality, setCountQuality] = useState([]);

  const [fetchedLoading, setFetchLoading] = useState(false);
  const [ordersPickerDate, setordersPickerDate] = useState([]);
  const [detailOrdersPickerDate, setDetailOrdersPickerDate] = useState([]);

  useEffect(() => {
    async function getDashBoard() {
      if (localStorage["token"]) {
        setFetchLoading(false);
        try {
          const data = await apiPrivate(
            "http://localhost:3001/order/getAllOrder"
          );
          if (data.success) {
            // set new List Unit orders
            const newOrders = data.orders.map((order, index) => {
              return {
                key: index + 1,
                ...order,
              };
            });
            // set new Detail orders
            const newData = await Promise.all(
              newOrders.map(async (order) => {
                const detail = await apiPrivate(
                  `order/getOrderById/${order.orderId}`
                );
                return detail.orders.map((detailOd) => detailOd);
              })
            );
            const newDetail = Array.prototype.concat.apply([], newData);

            // set value

            setQualityCollection({
              "t-shirt": 0,
              sweater: 0,
              hoodie: 0,
            });
            newDetail.map((detail) => {
              setQualityCollection((prev) => {
                return {
                  ...prev,
                  [detail.category]: prev[detail.category] + 1,
                };
              });
            });

            // set quality sold

            const orderQuality = newDetail.map((order) => {
              return {
                date: order.orderDate.split("T")[0],
                quality: order.quality,
              };
            });
            let result = [];

            orderQuality.forEach(function (a) {
              if (!this[a.date]) {
                this[a.date] = { date: a.date, quality: 0 };
                result.push(this[a.date]);
              }
              this[a.date].quality += a.quality;
            }, Object.create(null));

            setCountQuality(result);

            // set Revennue
            const revenue = data.orders.reduce((a, b) => a + b.totalPrice, 0);

            setOrders(newOrders);
            setordersPickerDate(newOrders);

            setDetailOrders(newDetail);
            setDetailOrdersPickerDate(newDetail);

            setRevenue(revenue);
          }

          // get user
          const users = await apiPrivate("http://localhost:3001/getAllUser");
          if (data.success) {
            const newusers = users.users.map((user, index) => {
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
          setFetchLoading(true);
        }
      }
    }
    getDashBoard();
  }, []);

  const onFinishDate = (fieldsValue) => {
    setQualityCollection({
      "t-shirt": 0,
      sweater: 0,
      hoodie: 0,
    });
    const rangeValue = fieldsValue["range-picker"];
    const values = [
      rangeValue[0].format("YYYY-MM-DD"),
      rangeValue[1].format("YYYY-MM-DD"),
    ];

    // orderDatePicker
    const newOrder = orders.filter((order) => {
      const newDate = order.orderDate.split("T")[0];
      if (values[0] <= newDate && newDate <= values[1]) {
        return order;
      }
    });

    // detail order date Picker
    const newDetailOrder = detailOrders.filter((order) => {
      const newDate = order.orderDate.split("T")[0];
      if (values[0] <= newDate && newDate <= values[1]) {
        return order;
      }
    });
    // set category product
    newDetailOrder.map((detail) => {
      setQualityCollection((prev) => {
        return {
          ...prev,
          [detail.category]: prev[detail.category] + 1,
        };
      });
    });

    // set quality sold

    const orderQuality = newDetailOrder.map((order) => {
      return {
        date: order.orderDate.split("T")[0],
        quality: order.quality,
      };
    });
    let result = [];

    orderQuality.forEach(function (a) {
      if (!this[a.date]) {
        this[a.date] = { date: a.date, quality: 0 };
        result.push(this[a.date]);
      }
      this[a.date].quality += a.quality;
    }, Object.create(null));

    // set revenue
    const revenue = newOrder.reduce((a, b) => a + b.totalPrice, 0);
    setCountQuality(result);

    setRevenue(revenue);
    setordersPickerDate(newOrder);
    setDetailOrdersPickerDate(newDetailOrder);
  };

  // HANDLE RESET
  const handleReset = () => {
    setordersPickerDate(orders);
    setDetailOrdersPickerDate(detailOrders);
    const revenue = orders.reduce((a, b) => a + b.totalPrice, 0);
    setRevenue(revenue);

    const orderQuality = detailOrders.map((order) => {
      return {
        date: order.orderDate.split("T")[0],
        quality: order.quality,
      };
    });
    // set quality sold
    let result = [];

    orderQuality.forEach(function (a) {
      if (!this[a.date]) {
        this[a.date] = { date: a.date, quality: 0 };
        result.push(this[a.date]);
      }
      this[a.date].quality += a.quality;
    }, Object.create(null));
    setCountQuality(result);

    // set category product
    setQualityCollection({
      "t-shirt": 0,
      sweater: 0,
      hoodie: 0,
    });

    detailOrders.map((detail) => {
      setQualityCollection((prev) => {
        return {
          ...prev,
          [detail.category]: prev[detail.category] + 1,
        };
      });
    });
  };

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
      <Row gutter={16}>
        <Col span={6}>
          <Card
            title="ORDERS / UNITS"
            bordered={false}
            style={{ backgroundColor: "#75be6e" }}
          >
            <h2>{`${detailOrdersPickerDate.length} / ${ordersPickerDate.length}`}</h2>
            Orders
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="REVENUES"
            bordered={false}
            style={{ backgroundColor: "#00b398" }}
          >
            <h2>
              {(revenue * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h2>
            VND
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="BENEFITS"
            bordered={false}
            style={{ backgroundColor: "#5d9cd1" }}
          >
            <h2>
              {((revenue * 45) / 100)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h2>
            VND
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="CUSTOMERS"
            bordered={false}
            style={{ backgroundColor: "#526e83" }}
          >
            <h2>{users.length}</h2>
            Users
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={12} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Orders</h2>
          <DemoPie
            shirt={qualityCollection["t-shirt"]}
            sweater={qualityCollection.sweater}
            hoodie={qualityCollection.hoodie}
          />
        </Col>
        <Col xl={12} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Quality</h2>
          <DemoLine countQuality={countQuality} />
        </Col>
      </Row>
    </>
  ) : null;
};
export default Dashboard;

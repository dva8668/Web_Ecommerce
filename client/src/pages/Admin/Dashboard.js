import React, { useState, useEffect } from "react";
import {
  Column,
  Pie,
  measureTextWidth,
  Line,
  DualAxes,
} from "@ant-design/plots";
import { Row, Col, Card } from "antd";
const DemoColumn = () => {
  const data = [
    {
      type: "Jan",
      value: 125,
    },
    {
      type: "Feb",
      value: 68,
    },
    {
      type: "Mar",
      value: 79,
    },
    {
      type: "Apr",
      value: 86,
    },
  ];
  const paletteSemanticRed = "#F4664A";
  const brandColor = "#5B8FF9";
  const config = {
    data,
    xField: "type",
    yField: "value",
    seriesField: "",
    color: ({ type }) => {
      if (type === "Jan" || type === "Mar") {
        return paletteSemanticRed;
      }

      return brandColor;
    },
    label: {
      content: (originData) => {
        const val = parseFloat(originData.value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + "Pcs";
        }
      },
      offset: 10,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return <Column {...config} />;
};

const DemoPie = () => {
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
      value: 33,
    },
    {
      type: "Sweater",
      value: 25,
    },
    {
      type: "Hoodie",
      value: 28,
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
        formatter: (v) => `${v} VND`,
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

const DemoLine = () => {
  const data = [
    {
      month: "Jan",
      value: 32345689,
    },
    {
      month: "Feb",
      value: 26790822,
    },
    {
      month: "Mar",
      value: 35997000,
    },
    {
      month: "Apr",
      value: 54888999,
    },
  ];
  const config = {
    data,
    xField: "month",
    yField: "value",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };
  return <Line {...config} />;
};

const DemoDualAxes = () => {
  const data = [
    {
      month: "Jan",
      order: 89,
      count: 16000000,
    },
    {
      month: "Feb",
      order: 78,
      count: 12000000,
    },
    {
      month: "Mar",
      order: 99,
      count: 15000000,
    },
    {
      month: "Apr",
      order: 86,
      count: 13000000,
    },
  ];
  const config = {
    data: [data, data],
    xField: "month",
    yField: ["order", "count"],
    geometryOptions: [
      {
        geometry: "line",
        color: "#5B8FF9",
      },
      {
        geometry: "line",
        color: "#5AD8A6",
      },
    ],
  };
  return <DualAxes {...config} />;
};

const Dashboard = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="Products Sold" bordered={false}>
            <h2>567</h2>
            Orders
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Customer" bordered={false}>
            <h2>457</h2>
            VND
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Revenue" bordered={false}>
            <h2>123.456.790</h2>
            VND
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Benefit" bordered={false}>
            <h2>68.789.738</h2>
            VND
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={12} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Orders</h2>
          <DemoPie />
        </Col>
        <Col xl={12} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Orders by month</h2>
          <DemoColumn />
        </Col>
        <Col xl={12} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Revenue</h2>
          <DemoLine />
        </Col>
        <Col xl={12} sx={24} sm={24} md={24} lg={24}>
          <h2 style={{ marginTop: "60px" }}>Benefit</h2>
          <DemoDualAxes />
        </Col>
      </Row>
    </>
  );
};
export default Dashboard;

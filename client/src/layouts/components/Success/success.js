import React from "react";
import { Button, Result } from "antd";
const Success = () => (
  <Result
    status="success"
    title="Successfully Purchased"
    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    extra={[
      <Button type="primary" key="console" href="/">
        Go to Home
      </Button>,
      <Button key="buy">Buy Again</Button>,
    ]}
  />
);
export default Success;

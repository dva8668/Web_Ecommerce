import { Alert, Space } from "antd";
const AlertNotification = ({ message, description, type }) => (
  <Space
    direction="vertical"
    style={{
      width: "100%",
      zIndex: 10000,
    }}
  >
    <Alert message={message} description={description} type={type} showIcon />
  </Space>
);
export default AlertNotification;

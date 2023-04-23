import { Tabs } from "antd";
import Product from "./Product";
const onChange = (key) => {
  // console.log(key);
};
const items = [
  {
    key: "1",
    label: `T-shirt`,
    children: <Product params={"t-shirt"} />,
  },
  {
    key: "2",
    label: `Sweater`,
    children: <Product params={"sweater"} />,
  },
  {
    key: "3",
    label: `Hoodie`,
    children: <Product params={"hoodie"} />,
  },
];
const App = () => (
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);
export default App;

import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const PageNotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" className="red_button ">
        <Link to="/">Back Home</Link>
      </Button>
    }
  />
);
export default PageNotFound;

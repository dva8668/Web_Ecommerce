import { useState, useContext } from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { AuthContext } from "../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Login() {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const navigation = useNavigate();

  const onChangeLoginForm = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  async function Login(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(loginForm);
      if (data.success) {
        if (data.isAdmin === 1) {
          navigation("/dashboard");
        } else {
          navigation("/");
        }
      } else {
        alert("Username or Password is incorrect!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cx("limiter")}>
      <div className={cx("container-login100")}>
        <div className={cx("wrap-login100")}>
          <div className={cx("login100-pic js-tilt")} data-tilt>
            <img src="images/img-01.png" alt="IMG" />
          </div>

          <form className={cx("login100-form validate-form")}>
            <span className={cx("login100-form-title")}>Đăng nhập</span>

            <div className={cx("wrap-input100 validate-input")}>
              <input
                className={cx("input100")}
                type="text"
                name="username"
                placeholder="Username"
                required
                onChange={onChangeLoginForm}
              />
            </div>

            <div className={cx("wrap-input100 validate-input")}>
              <input
                className={cx("input100")}
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={onChangeLoginForm}
              />
            </div>

            <div className={cx("container-login100-form-btn")}>
              {loading ? (
                <button className={cx("login100-form-btn")} onClick={Login}>
                  Loading...
                </button>
              ) : (
                <button className={cx("login100-form-btn")} onClick={Login}>
                  Đăng nhập
                </button>
              )}
            </div>

            <div className={cx("text-center")}>
              <Link className={cx("txt2")} to="/register">
                Tạo tài khoản mới
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../hooks/api";

const cx = classNames.bind(styles);

function Register() {
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({});

  const navigation = useNavigate();

  const onChangeLoginForm = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  async function Resgister(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await apiRequest("/create", "POST", loginForm);
      if (data.success) {
        navigation("/login");
      } else {
        alert("Email already exists!");
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
            <span className={cx("login100-form-title")}>Đăng ký</span>

            <div className={cx("wrap-input100 validate-input")}>
              <input
                className={cx("input100")}
                type="text"
                name="fullname"
                placeholder="Your name"
                required
                onChange={onChangeLoginForm}
              />
            </div>

            <div className={cx("wrap-input100 validate-input")}>
              <input
                className={cx("input100")}
                type="email"
                name="email"
                placeholder="Your email"
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
            <div className={cx("wrap-input100 validate-input")}>
              <input
                className={cx("input100")}
                type="tel"
                pattern="[0-9]{3}[0-9]{2}[0-9]{5}"
                name="phone"
                placeholder="Your phone number"
                required
                onChange={onChangeLoginForm}
              />
            </div>

            <div className={cx("container-login100-form-btn")}>
              {loading ? (
                <button className={cx("login100-form-btn")}>Loading...</button>
              ) : (
                <button className={cx("login100-form-btn")} onClick={Resgister}>
                  Register
                </button>
              )}
            </div>

            <div className={cx("text-center")}>
              <Link className={cx("txt2")} to="/login">
                Login your account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

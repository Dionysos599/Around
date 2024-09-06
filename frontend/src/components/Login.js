import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../constants";

const Login = (props) => {
  const { handleLoggedIn } = props;

  const onFinish = (values) => {
    const { username, password } = values;
    const opt = {
      method: "POST",
      url: `${BASE_URL}/signin`,
      data: {
        username: username,
        password: password,
      },
      headers: { "Content-Type": "application/json" },
    };
    axios(opt)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res;
            handleLoggedIn(data);
            message.success("You've logged in.");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            message.error("Invalid username or password");
            return;
          }
          console.log("login failed: ", err.message);
          message.error("Login failed!");
        });
  };

  return (
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "This field should not be empty",
              },
            ]}
        >
          <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
          />
        </Form.Item>
        <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "This field should not be empty",
              },
            ]}
        >
          <Input
              prefix={<KeyOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <span style={{ marginLeft: "70px" }}></span>
          <Link to="/register">register</Link>
        </Form.Item>
      </Form>
  );
};

export default Login;
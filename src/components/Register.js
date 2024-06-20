import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom"; // Ensure Link is imported
import axios from "axios";

import { BASE_URL } from "../constants";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 16,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Register(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { username, password } = values;
    const opt = {
      method: "POST",
      url: `${BASE_URL}/signup`,
      data: {
        username: username,
        password: password,
      },
      headers: { "content-type": "application/json" },
    };

    axios(opt)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          message.success("Now you can login!");
          props.history.push("/login");
        }
      })
      .catch((error) => {
        console.log("register failed: ", error.message);
        message.error("Registration failed!");
      });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      className="register"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: "This field should not be empty",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "This field should not be empty",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "This field should not be empty",
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject("Passwords do not match");
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Link to="/login">Cancel</Link>
        <span style={{ marginLeft: "60px" }}></span>
        <Button type="primary" htmlType="submit" className="register-btn">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Register;

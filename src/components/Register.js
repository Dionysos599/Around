import React from "react";
import { Form, Input, Button, message, InputNumber, Select } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../constants";

const { Option } = Select;

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
    const { username, password, age, gender } = values;
    const opt = {
      method: "POST",
      url: `${BASE_URL}/signup`,
      data: {
        username: username,
        password: password,
        age: age || 0,
        gender: gender || "other",
      },
      headers: { "content-type": "application/json" },
    };

    axios(opt)
      .then((response) => {
        console.log(response);
        // case1: registered success
        if (response.status === 200) {
          message.success("Now you can log in!");
          props.history.push("/login");
        }
      })
      .catch((error) => {
        // case2: registered failed
        if (error.response.status === 400) {
          message.error("Username already exists");
        } else {
          message.error("Something went wrong");
        }
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
        name="age"
        label="Age"
        rules={[
          {
            type: "number",
            min: 0,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item name="gender" label="Gender">
        <Select>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
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
              if (!value || getFieldValue("password") === value) {
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

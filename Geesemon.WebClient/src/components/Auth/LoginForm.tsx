import { Form, Input, Button } from "antd";
import { LoginRequest } from "../../behavior/auth/types";

type Props = {
  onFinish: (values: LoginRequest) => void;
};

export const LoginForm = ({ onFinish }: Props) => {
  return (
    <Form name="register" onFinish={onFinish}>
      <Form.Item
        name="login"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

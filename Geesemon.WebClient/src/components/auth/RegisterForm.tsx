import {Button, Form, Input, Row} from "antd";
import {RegisterRequest} from "../../behavior/features/auth/types";

type Props = {
    onFinish: (values: RegisterRequest) => void;
};

export const RegisterForm = ({onFinish}: Props) => {
    return (
        <Form name="register" onFinish={onFinish}>
            <Row>
                <Form.Item
                    label="FirstName"
                    name="firstName"
                    rules={[{required: true, message: "Please input your firstName!"}]}
                >
                    <Input/>
                </Form.Item>
            </Row>
            <Row>
                <Form.Item
                    label="LastName"
                    name="lastName"
                    rules={[{required: true, message: "Please input your lastName!"}]}
                >
                    <Input/>
                </Form.Item>
            </Row>
            <Row>
                <Form.Item
                    label="Login"
                    name="login"
                    rules={[{required: true, message: "Please input your username!"}]}
                >
                    <Input/>
                </Form.Item>
            </Row>
            <Row>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Row>
            <Row>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Please input your password!"}]}
                >
                    <Input.Password/>
                </Form.Item>
            </Row>
            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

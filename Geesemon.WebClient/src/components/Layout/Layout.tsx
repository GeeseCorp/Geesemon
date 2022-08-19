import { Layout } from "antd";
import UserList from "../UserList/UserList";
import styles from "./Layout.module.scss";

const { Header, Footer, Sider, Content } = Layout;

type Props = {
  children: React.ReactNode;
};

export const AppLayout = (props: Props) => {
  return (
    <>
      <Layout className={styles.main}>
          <Sider className={styles.sider} width={250}>
            <UserList />
          </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>{props.children}</Content>
        </Layout>
      </Layout>
    </>
  );
};

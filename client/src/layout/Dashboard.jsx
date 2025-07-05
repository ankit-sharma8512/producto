import { Flex, Layout, Typography } from "antd";
import SideMenu from "./SideMenu";
import { Outlet } from "react-router";
import { UserOutlined } from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ height: '70px', padding: "0 30px" }}>
        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
          <Typography.Text style={{ color: "white", fontSize: '1.5rem' }}>Saatvik Traders</Typography.Text>
          <Flex gap={10}>
            <UserOutlined style={{ color: "white" }} />
            <Typography.Text style={{ color: "white" }}>Admin</Typography.Text>
          </Flex>
        </Flex>
      </Header>
      <Layout>
        <Sider collapsible width={220}>
          <SideMenu />
        </Sider>
        <Content style={{ margin: '10px', overflowY: 'auto', height: '90vh' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
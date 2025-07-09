import { theme, Layout, Space, Typography } from "antd";
import SideMenu from "./SideMenu";
import { Outlet } from "react-router";
import { UserOutlined } from "@ant-design/icons";

const { Sider, Header, Content } = Layout;
const { Title }                  = Typography;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
        <Sider width={220} style={siderStyle}>
          <div style={{padding:20}}>
            <Title level={3} style={{color:'white'}}>Producto</Title>
          </div>
          <SideMenu />
        </Sider>
        <Layout>
          <Header style={{textAlign:'end'}}>
            <Space style={{color:'black'}}>
              <UserOutlined/>
              <span>Saatvik Traders</span>
            </Space>
          </Header>
          <Content style={{ margin: '16px 12px 0' }}>
            <div style={{padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'auto', minHeight:'90vh'}}>
              <Outlet />
            </div>
          </Content>
        </Layout>
    </Layout>
  );
}

export default Dashboard;
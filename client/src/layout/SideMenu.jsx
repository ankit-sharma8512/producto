import { Menu }                     from "antd"
import {
	HomeOutlined,
	ProductOutlined,
	AuditOutlined,
	BarcodeOutlined,
	ShoppingOutlined,
	TeamOutlined,
	ShoppingCartOutlined,
	WalletOutlined,
	StockOutlined,
	BarChartOutlined,
  NumberOutlined,
  MenuOutlined,
  SettingOutlined
}                                   from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"

const items = [
	{
		key   : '/',
		label : 'Dashboard',
		icon  : <HomeOutlined />,
	},
  {
    key      : 'product',
    type     : 'group',
    label    : 'Inventory',
    children : [
      {
        key   : '/product',
        label : 'Products',
        icon  : <MenuOutlined />,
      },
      {
        key   : '/purchase',
        label : 'Purchase',
        icon  : <ShoppingOutlined />,
      },
      {
        key   : '/grn',
        label : 'GRN',
        icon  : <NumberOutlined />,
      },
      {
        key   : '/vendor',
        label : 'Vendors',
        icon  : <ShoppingCartOutlined />,
      }
    ]
  },
  {
    key      : 'order',
    type     : 'group',
    label    : 'Order',
    children : [
      {
        key   : '/order',
        label : 'Orders',
        icon  : <BarcodeOutlined />,
      },
      {
        key   : '/buyer',
        label : 'Buyers',
        icon  : <WalletOutlined />,
      }
    ]
  },
  {
    key      : 'report',
    type     : 'group',
    label    : 'Report',
    children : [
      {
        key   : '/report/sale',
        label : 'Sale',
        icon  : <AuditOutlined />,
      },
      {
        key   : '/report/stock',
        label : 'Stock',
        icon  : <BarChartOutlined />,
      }
    ]
  },
  {
    type:'divider'
  },
  {
    key   : '/settings',
    label : 'Settings',
    icon  : <SettingOutlined />,
  }

/*
  {
    key: '/billing',
    label: 'Billing',
    icon: <BarcodeOutlined />,
  },
  {
    key: '/purchase',
    label: 'Purchase',
    icon: <ShoppingOutlined />,
  },
  {
    key: 'traders',
    label: 'Traders',
    icon: <TeamOutlined />,
    children: [
      {
        key: '/buyer',
        label: 'Buyers',
        icon: <WalletOutlined />,
      },
      {
        key: '/vendor',
        label: 'Vendors',
        icon: <ShoppingCartOutlined />,
      },
    ]
  },
  {
    key: 'report',
    label: 'Reports',
    icon: <StockOutlined />,
    children: [
      {
        key: '/billing/report',
        label: 'Sale Report',
        icon: <AuditOutlined />,
      },
      {
        key: '/stock',
        label: 'Stock Report',
        icon: <BarChartOutlined />,
      }
    ]
  },
*/
]

function SideMenu() {
	const navigate = useNavigate();
	const location = useLocation();
	const base     = location.pathname;
	const first    = base?.split('/')[1];
  
	return (
    <Menu
      defaultOpenKeys = {['product', 'traders', 'report']}
      selectedKeys    = {[base || '/', first, '/'+first]}
      items           = {items}
      mode            = "inline"
      onClick         = {({ key }) => navigate(key)}
    />
	);
}

export default SideMenu;

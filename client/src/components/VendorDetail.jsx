import { Descriptions } from "antd"


function BuyerDetail({ vendor }) {

  const items = [
    {
      key: 'contact',
      label: 'Contact',
      children: vendor.contact
    },
    {
      key: 'gstin',
      label: 'GSTIN',
      children: vendor.gstin || '-',
      span: 2
    },
    {
      key: 'address',
      label: 'Address',
      children: vendor.address || '-',
      span: 3
    },
  ]
  return (
    <Descriptions items={items} bordered size="small" column={3} style={{ margin: '20px 0' }} />
  )
}

export default BuyerDetail
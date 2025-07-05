import { Descriptions } from "antd"


function BuyerDetail({ buyer }) {

  const items = [
    {
      key: 'name',
      label: 'Name',
      children: buyer.name
    },
    {
      key: 'contact',
      label: 'Contact',
      children: buyer.contact
    },
    {
      key: 'gstin',
      label: 'GSTIN',
      children: buyer.gstin || '-'
    },
    {
      key: 'address',
      label: 'Address',
      children: buyer.address || '-',
      span: 3
    },
    {
      key: 'placeOfSupply',
      label: 'Place Of Supply',
      children: buyer.placeOfSupply || '-'
    },
  ]
  return (
    <Descriptions title='Bill to' items={items} bordered size="small" column={3} style={{ margin: '20px 0' }} />
  )
}

export default BuyerDetail
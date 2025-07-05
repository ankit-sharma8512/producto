import { Col, Divider, Form, Input, Row } from "antd"
import { useBuyerList } from "../hooks/trader-api";
import { useState } from "react";
import DebouncedSelect from "./DebouncedSelect";

function BillBuyerForm({ initialBuyers }) {
  const [search, setSearch] = useState(null);
  const buyerId = Form.useWatch('buyerId')
  const { data, isFetching, isError } = useBuyerList({ search }, { enabled: Boolean(search), refetchOnWindowFocus: false, initialData: initialBuyers });

  const buyerDetail = data?.find(b => b._id === buyerId);

  return (
    <>
      <Form.Item
        label='Buyer'
        name='buyerId'
        required
        rules={[
          ({ getFieldValue }) => ({
            validator(_, val) {
              if (!val && !getFieldValue(['buyer', 'name']))
                return Promise.reject('Either select a buyer or add buyer details below')
              return Promise.resolve()
            }
          })
        ]}
      >
        <DebouncedSelect
          allowClear
          options={data?.map(b => ({ label: b.name + ` (${b.address})`, value: b._id }))}
          isFetching={isFetching}
          isError={isError}
          trigger={v => setSearch(v)}
          placeholder='Select Buyer'
        />
      </Form.Item>
      <Divider>OR</Divider>
      <Form.Item
        name={['buyer', 'name']}
        label='Name'
        dependencies={['buyerId']}
        required
        rules={[{
          validator(_, val) {
            if (!val && !buyerId)
              return Promise.reject('Either select a buyer above or add buyer details here')
            return Promise.resolve()
          }
        }]}
      >
        <Input placeholder={buyerId ? buyerDetail?.name : "Enter Name"} disabled={Boolean(buyerId)} />
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            name={['buyer', 'contact']}
            label='Contact'
            dependencies={['buyerId']}
            labelCol={{ span: 6 }}
            required
            rules={[{
              validator(_, val) {
                if (!val && !buyerId)
                  return Promise.reject('Add buyer contact')
                return Promise.resolve()
              }
            }]}
          >
            <Input placeholder={buyerId ? buyerDetail?.contact : "Enter contact"} disabled={Boolean(buyerId)} />
          </Form.Item>
        </Col>
        <Col span={12} style={{ paddingLeft: '20px' }}>
          <Form.Item
            name={['buyer', 'gstin']}
            label='GSTIN'
          >
            <Input placeholder={buyerId ? buyerDetail?.gstin : "Enter GSTIN"} disabled={Boolean(buyerId)} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name={['buyer', 'address']}
        label='Address'
      >
        <Input placeholder={buyerId ? buyerDetail?.address : "Enter address"} disabled={Boolean(buyerId)} />
      </Form.Item>
      <Form.Item
        name={['buyer', 'placeOfSupply']}
        label='Place of supply'
      >
        <Input placeholder={buyerId ? buyerDetail?.placeOfSupply : "Enter place of supply"} disabled={Boolean(buyerId)} />
      </Form.Item>
      {/* <Form.Item
        name={['buyer', 'addNew']}
        label='Save Buyer'
        valuePropName="checked"
      >
        <Checkbox disabled={Boolean(buyerId)} />
      </Form.Item> */}
    </>
  )
}

export default BillBuyerForm
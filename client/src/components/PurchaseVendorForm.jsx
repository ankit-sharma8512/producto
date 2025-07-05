import { Col, Divider, Form, Input, Row } from "antd"
import { useVendorList } from "../hooks/trader-api";
import { useState } from "react";
import DebouncedSelect from "./DebouncedSelect";

function PurchaseVendorForm({ initialVendors }) {
  const [search, setSearch] = useState(null);
  const vendorId = Form.useWatch('vendorId')
  const { data, isFetching, isError } = useVendorList({ search }, { enabled: Boolean(search), refetchOnWindowFocus: false, initialData: initialVendors });

  const vendorDetail = data?.find(b => b._id === vendorId);

  return (
    <>
      <Form.Item
        label='Vendor'
        name='vendorId'
        required
        rules={[
          ({ getFieldValue }) => ({
            validator(_, val) {
              if (!val && !getFieldValue(['vendor', 'name']))
                return Promise.reject('Either select a vendor or add vendor details below')
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
          placeholder='Select Vendor'
        />
      </Form.Item>
      <Divider>OR</Divider>
      <Form.Item
        name={['vendor', 'name']}
        label='Name'
        dependencies={['vendorId']}
        required
        rules={[{
          validator(_, val) {
            if (!val && !vendorId)
              return Promise.reject('Either select a vendor above or add vendor details here')
            return Promise.resolve()
          }
        }]}
      >
        <Input placeholder={vendorId ? vendorDetail?.name : "Enter Name"} disabled={Boolean(vendorId)} />
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            name={['vendor', 'contact']}
            label='Contact'
            dependencies={['vendorId']}
            labelCol={{ span: 6 }}
            required
            rules={[{
              validator(_, val) {
                if (!val && !vendorId)
                  return Promise.reject('Add vendor contact')
                return Promise.resolve()
              }
            }]}
          >
            <Input placeholder={vendorId ? vendorDetail?.contact : "Enter contact"} disabled={Boolean(vendorId)} />
          </Form.Item>
        </Col>
        <Col span={12} style={{ paddingLeft: '20px' }}>
          <Form.Item
            name={['vendor', 'gstin']}
            label='GSTIN'
          >
            <Input placeholder={vendorId ? vendorDetail?.gstin : "Enter GSTIN"} disabled={Boolean(vendorId)} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name={['vendor', 'address']}
        label='Address'
      >
        <Input placeholder={vendorId ? vendorDetail?.address : "Enter address"} disabled={Boolean(vendorId)} />
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

export default PurchaseVendorForm
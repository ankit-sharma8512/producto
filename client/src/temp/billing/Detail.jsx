import { Spin, Alert, Typography, Card, Flex, Space, Button, Popconfirm, App, InputNumber, Row } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom"
import { useBillDetail, useDeleteBill, useUpdateBillState } from "../../hooks/billing-api";
import BuyerDetail from '../../components/BuyerDetail';
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import OrderManager from '../../components/OrderManager';
import { useBillPDF, useDeliveryNote } from '../../hooks/pdf-api';
import { useSale, useSaleUpdate } from '../../hooks/sale-api';
import { useState } from 'react';

const { Title, Text } = Typography;

function Payment({ id }) {
  const [amt, setAmt] = useState(null);
  const { data, isLoading, isError } = useSale(id)
  const addPayment = useSaleUpdate(id);
  const { message } = App.useApp();

  async function add() {
    if (!amt)
      return

    try {
      await addPayment.mutateAsync({ payment: amt })
      setAmt(null)
      message.success('Payment Added successfully')
    }
    catch {
      message.error('Failed to add payment')
    }
  }

  if (isLoading)
    return <Spin />;

  if (isError)
    return <Alert type="error" title='Failed to load bill' message='Failed to load bill' />

  const money = data.sale.reduce((agg, curr) => ({ ...agg, cp: agg.cp + curr.cost, sp: agg.sp + curr.net }), { cp: 0, sp: 0 })
  const round = ((((money.sp * 100) % 100).toFixed(0)) / 100).toFixed(2)
  const pl = ((money.sp - round) - money.cp)

  return (
    <div style={{ marginBottom: 10 }}>
      <Title level={5}>Payment</Title>
      <Flex justify='space-between' align='start'>
        <Space direction='vertical'>
          <Text>Payment Received: {data.payment.received.toFixed(2)} INR | <strong>Payment Left: {((money.sp - round) - data.payment.received).toFixed(2)} INR</strong></Text>
          <Text>Cost Price: {money.cp.toFixed(2)} INR | Selling Price: {(money.sp - round).toFixed(2)} INR</Text>
          <Text type={(pl > 0) ? 'success' : 'danger'}><strong>{pl > 0 ? 'Profit' : 'Loss'}: {pl.toFixed(2)} INR</strong></Text>
        </Space>
        <Space>
          <InputNumber style={{ width: '100%' }} placeholder='Payment Amount' addonBefore={<PlusOutlined />} value={amt} onChange={v => setAmt(v)} />
          <Button type='primary' onClick={add} disabled={!amt}>Add Payment</Button>
        </Space>
      </Flex>
    </div>
  )
}

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useBillDetail(id);
  const { refetch: fetchBill, isFetching: isPdfFetching } = useBillPDF(id, { enabled: false })
  const { refetch: fetchNote, isFetching: isNoteFetching } = useDeliveryNote(id, { enabled: false })
  const updateState = useUpdateBillState(id)
  const { message } = App.useApp()
  const deleteBill = useDeleteBill()

  async function downloadBillPdf() {
    try {
      const { data: file } = await fetchBill()

      const href = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `Tax-Invoice-${data?.billNo}.pdf`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
    catch (err) {
      console.error(err)
      message.error('Failed to download bill pdf')
    }
  }

  async function downloadRecieveNote() {
    try {
      const { data: file } = await fetchNote()

      const href = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `Delivery-Note-${data?.billNo}.pdf`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
    catch (err) {
      console.error(err)
      message.error('Failed to download note pdf')
    }
  }

  async function updateBillState(s) {
    try {
      await updateState.mutateAsync(s);
      message.success('Bill state updated sucessfully');
    } catch (err) {
      if (err.response?.data?.code === 'ERR_NOT_ENOUGH_STOCK')
        return message.error('Not enough stock to deliver')
      message.error('Failed to update bill state')
    }
  }

  async function deleteB(id) {
    try {
      await deleteBill.mutateAsync(id);
      message.success('Bill deleted sucessfully');
      navigate('/billing')
    } catch {
      message.error('Failed to delete bill')
    }
  }

  if (isLoading)
    return <Spin />;

  if (isError)
    return <Alert type="error" title='Failed to load bill' message='Failed to load bill' />

  const buyer = data?.buyerId || data?.buyer;

  return (
    <Card>
      <Flex justify='space-between'>
        <Flex vertical>
          <Text style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{data.billNo}</Text>
          <Text>Bill Date: {moment(data.billDate).format('DD-MM-YYYY')}</Text>
        </Flex>
        <Space size='large'>
          <Text style={{ fontSize: '1.2rem' }}>{data.state.toUpperCase()} {data.returned && '| RETURNED'}</Text>
          <Link to={'/billing/update/' + id}>
            <Button icon={<EditOutlined />} />
          </Link>
          {
            data.state === 'draft' &&
            <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteB(id)}>
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          }
        </Space>
      </Flex>
      <BuyerDetail buyer={buyer} />
      {data.state !== 'draft' && <Payment id={id} />}
      <Flex justify='space-between' style={{ marginBottom: 10 }}>
        <Title level={5}>Orders</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={downloadBillPdf} loading={isPdfFetching}>Bill PDF</Button>
          <Button icon={<DownloadOutlined />} onClick={downloadRecieveNote} loading={isNoteFetching}>Delivery Note</Button>
          {
            data.state === 'draft' &&
            <Popconfirm onConfirm={() => updateBillState('delivered')} title="Are you sure" description='This will subtract order quantity from current stock'>
              <Button type='primary'>Mark Delivered</Button>
            </Popconfirm>
          }
        </Space>
      </Flex>
      <OrderManager billId={id} changeAllowed={data.state === 'draft'} returnAllowed={data.state === 'delivered' && !data.returned} />
      {
        data.state === 'delivered' && !data.returned &&
        <Row justify='end' style={{ margin: '10px 0' }}>
          <Popconfirm placement='leftTop' title='Caution: This is a one time action only' description='Make sure every return is filed before clicking this. Edit the price of the newly added lots from product section' okText='Execute' onConfirm={() => updateBillState('return')}>
            <Button type='primary'>Execute Return</Button>
          </Popconfirm>
        </Row>
      }
    </Card>
  )
}

export default Detail
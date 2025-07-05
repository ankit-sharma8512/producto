import { Spin, Alert, Typography, Card, Flex, Space, Button, Popconfirm, App } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom"
import VendorDetail from '../../components/VendorDetail';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import PurchaseManager from '../../components/PurchaseManager';
import { useCompletePurchase, useDeletePurchase, usePurchaseDetail } from '../../hooks/purchase-api';

const { Title, Text } = Typography;

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = usePurchaseDetail(id);
  const completePurchase = useCompletePurchase(id)
  const deletePurchase = useDeletePurchase()
  const { message } = App.useApp()

  async function completeP() {
    try {
      await completePurchase.mutateAsync('completed');
      message.success('Purchase completed sucessfully');
    } catch {
      message.error('Failed to complete purchase')
    }
  }

  async function deleteP(id) {
    try {
      await deletePurchase.mutateAsync(id);
      message.success('Purchase deleted sucessfully');
      navigate('/purchase')
    } catch {
      message.error('Failed to delete purchase')
    }
  }

  if (isLoading)
    return <Spin />;

  if (isError)
    return <Alert type="error" message='Failed to load purchase' />

  const vendor = data?.vendorId || data?.vendor;

  return (
    <Card>
      <Flex justify='space-between'>
        <Flex vertical>
          <Text style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{vendor.name}</Text>
          <Text>Purchase Date: {moment(data.purchaseDate).format('DD-MM-YYYY')}</Text>
        </Flex>
        <Space size='large'>
          <Text style={{ fontSize: '1.2rem' }}>{data.state.toUpperCase()}</Text>
          <Link to={'/purchase/update/' + id}>
            <Button icon={<EditOutlined />} disabled={data.state !== 'draft'} />
          </Link>
          {
            data.state === 'draft' &&
            <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteP(id)}>
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          }
        </Space>
      </Flex>
      <VendorDetail vendor={vendor} />
      <Flex justify='space-between' style={{ marginBottom: 10 }}>
        <Title level={5}>Purchase Orders</Title>
        {
          data.state === 'draft' &&
          <Popconfirm onConfirm={completeP} title="Are you sure" description='This will add purchase order quantity to current stock lot'>
            <Button type='primary'>Mark Complete</Button>
          </Popconfirm>
        }
      </Flex>
      <PurchaseManager purchaseId={id} changeAllowed={data.state === 'draft'} total={data.total} />
    </Card>
  )
}

export default Detail
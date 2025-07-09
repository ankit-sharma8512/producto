import { useParams, Link, useNavigate }         from "react-router-dom";
import { useCompletePurchase, useDeletePurchase, usePurchaseDetail } from '../../hooks/purchase-api';
import { Alert, Flex, Spin, Typography, Space, Button , Popconfirm, App} from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import VendorDetail from '../../components/VendorDetail';
import PurchaseManager from '../../components/PurchaseManager';

const { Text, Title } = Typography;

function PurchaseDetail() {
    const { id }                       = useParams();
    const { data, isLoading, isError } = usePurchaseDetail(id);
    const { message }                  = App.useApp()
    const deletePurchase               = useDeletePurchase()
    const navigate                     = useNavigate()
    const completePurchase             = useCompletePurchase(id)

    async function deleteP(id) {
        try {
            await deletePurchase.mutateAsync(id);
            message.success('Purchase deleted sucessfully');
            navigate('/purchase')
        } catch {
            message.error('Failed to delete purchase')
        }
    }

    async function completeP() {
        try {
            await completePurchase.mutateAsync();
            message.success('Purchase completed sucessfully');
        } catch {
            message.error('Failed to complete purchase')
        }
    }

    if (isLoading)
        return <Spin />;

    if (isError)
        return <Alert type="error" message='Failed to load purchase' />

    const vendor = data?.vendorId || data?.vendor;

    return (
        <>
            <Flex justify='space-between'>
                <Flex vertical>
                    <Text style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{vendor.name}</Text>
                    <Text>Purchase Date: {moment(data.date).format('DD-MM-YYYY')}</Text>
                </Flex>
                <Space size='large'>
                <Text style={{ fontSize: '1.2rem' }}>{data.state.toUpperCase()}</Text>
                <Link to={'/purchase/update/' + id}>
                    <Button icon={<EditOutlined />} disabled={data.state !== 'DRAFT'} />
                </Link>
                {
                    data.state === 'DRAFT' &&
                    <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteP(id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                }
                </Space>
            </Flex>
            <VendorDetail vendor={vendor} />
            <Flex justify='space-between' style={{ marginBottom: 10 }}>
                <Title level={4}>Purchase Items</Title>
                {
                    data?.state === 'DRAFT' &&
                    <Popconfirm title="Are you sure" description='This will add purchase order quantity to current stock lot' onConfirm={completeP}>
                        <Button type='primary'>Mark Complete</Button>
                    </Popconfirm>
                }
            </Flex>
            <PurchaseManager purchaseId={id} changeAllowed={data.state === 'DRAFT'} total={data.total} />
        </>
    );
}

export default PurchaseDetail;
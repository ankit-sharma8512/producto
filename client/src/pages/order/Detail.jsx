import { Link, useNavigate, useParams } from "react-router-dom";
import { useBillDetail, useDeleteBill } from "../../hooks/billing-api";
import { Alert, App, Button, Flex, Popconfirm, Space, Spin, Typography } from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import BuyerDetail from "../../components/BuyerDetail";
import OrderManager from "../../components/OrderManager";

const { Title, Text } = Typography;

function OrderDetail() {
    const { id }                       = useParams();
    const navigate                     = useNavigate();
    const { data, isLoading, isError } = useBillDetail(id);
    const deleteBill                   = useDeleteBill()
    const { message }                  = App.useApp()

    async function deleteB(id) {
        try {
            await deleteBill.mutateAsync(id);
            message.success('Order deleted sucessfully');
            navigate('/order')
        } catch {
            message.error('Failed to delete bill')
        }
    }

    if (isLoading)
        return <Spin />;

    if (isError)
        return <Alert type="error" title='Failed to load order' message='Failed to load order' />

    const buyer = data?.buyerId || data?.buyer;

    return (
        <>
            <Flex justify='space-between'>
                <Flex vertical>
                    <Text style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{data.billNo}</Text>
                    <Text>Bill Date: {moment(data.date).format('DD-MM-YYYY')}</Text>
                </Flex>
                <Space size='large'>
                    <Text style={{ fontSize: '1.2rem' }}>{data.state.toUpperCase()} {data.return && '| RETURNED'}</Text>
                    <Link to={'/order/update/' + id}>
                        <Button icon={<EditOutlined />} />
                    </Link>
                    {
                        data.state === 'DRAFT' &&
                        <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteB(id)}>
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    }
                </Space>
            </Flex>
            <BuyerDetail buyer={buyer} />
            <Flex justify='space-between' style={{ marginBottom: 10 }}>
                <Title level={4}>Orders</Title>
                <Space>
                {/* <Button icon={<DownloadOutlined />} onClick={downloadBillPdf} loading={isPdfFetching}>Bill PDF</Button>
                <Button icon={<DownloadOutlined />} onClick={downloadRecieveNote} loading={isNoteFetching}>Delivery Note</Button> */}
                    {
                        data.state === 'DRAFT' &&
                        <Popconfirm onConfirm={() => updateBillState('delivered')} title="Are you sure" description='This will subtract order quantity from current stock'>
                            <Button type='primary'>Mark Delivered</Button>
                        </Popconfirm>
                    }
                </Space>
            </Flex>
            <OrderManager billId={id} changeAllowed={data.state === 'DRAFT'} returnAllowed={data.state === 'DELIVERED' && !data.return} />
        </>
    )
}

export default OrderDetail;
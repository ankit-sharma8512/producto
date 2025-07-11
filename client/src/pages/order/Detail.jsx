import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddPayment, useBillDetail, useDeleteBill, useProcessBill, useReturnBill } from "../../hooks/billing-api";
import { Alert, App, Button, Card, Flex, InputNumber, Popconfirm, Space, Spin, Typography } from "antd";
import moment from "moment";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import BuyerDetail from "../../components/BuyerDetail";
import OrderManager from "../../components/OrderManager";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

function Payment({ payment, id }) {
    const [amt, setAmt] = useState(null);
    const { message }   = App.useApp();
    const addPayment    = useAddPayment(id)

    async function add() {
        if (!amt)
            return

        try {
            await addPayment.mutateAsync({amount: amt});
            setAmt(null)
            message.success('Payment Added successfully')
        }
        catch {
            message.error('Failed to add payment')
        }
    }

    return (
        <Card title={<Title level={5}>Payment</Title>} style={{ marginBottom: 10 }} size='small'>
            <Flex justify='space-between' align='start'>
                <Space direction='vertical'>
                    <Text>Payment Received: {payment.received.toFixed(2)} INR</Text>
                    <strong>Payment Left: {(payment.total - payment.received).toFixed(2)} INR</strong>
                </Space>
                <Space>
                    <InputNumber style={{ width: '100%' }} placeholder='Payment Amount' addonBefore={<PlusOutlined />} value={amt} onChange={v => setAmt(v)} />
                    <Button type='primary' onClick={add} disabled={!amt}>Add Payment</Button>
                </Space>
            </Flex>
        </Card>
    )
}

function OrderDetail() {
    const { id }                       = useParams();
    const navigate                     = useNavigate();
    const [ poll, setPoll ]            = useState(false)
    const { data, isLoading, isError } = useBillDetail(id, { refetchInterval : (poll ?? false)});
    const deleteBill                   = useDeleteBill()
    const { message }                  = App.useApp()
    const processBill                  = useProcessBill(id);
    const returnBill                   = useReturnBill(id);

    useEffect(() => {
        if(data?.state === 'PROCESSING')
            setPoll(3000);
        else
            setPoll(null);
    }, [data?.state])

    async function deleteB(id) {
        try {
            await deleteBill.mutateAsync(id);
            message.success('Order deleted sucessfully');
            navigate('/order')
        } catch {
            message.error('Failed to delete order')
        }
    }

    async function processB() {
        try {
            await processBill.mutateAsync(id);
            message.success('Order processed sucessfully');
            // navigate('/order')
        } catch {
            message.error('Failed to process order')
        }
    }

    async function returnB() {
        try {
            await returnBill.mutateAsync(id);
            message.success('Order returns processed sucessfully');
            // navigate('/order')
        } catch {
            message.error('Failed to process order returns')
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
                        <Button icon={<EditOutlined />} disabled={!(data.state === 'DRAFT' || data.state === 'REJECTED')}/>
                    </Link>
                    <Popconfirm title='Are you sure?' placement='bottomLeft' onConfirm={() => deleteB(id)}>
                        <Button icon={<DeleteOutlined />} danger disabled={!(data.state === 'DRAFT' || data.state === 'REJECTED')} />
                    </Popconfirm>
                </Space>
            </Flex>
            <BuyerDetail buyer={buyer} />
            {!(data.state === 'DRAFT' || data.state === 'REJECTED') && <Payment payment={data?.payment} id={id} />}
            <Flex justify='space-between' style={{ marginBottom: 10 }}>
                {/* <Title level={4}>Orders</Title> */}
                <Space>
                {/* <Button icon={<DownloadOutlined />} onClick={downloadBillPdf} loading={isPdfFetching}>Bill PDF</Button>
                <Button icon={<DownloadOutlined />} onClick={downloadRecieveNote} loading={isNoteFetching}>Delivery Note</Button> */}
                    {
                        (data.state === 'DRAFT' || data.state === 'REJECTED') &&
                        <Popconfirm onConfirm={processB} title="Are you sure" description='This will subtract order quantity from current stock'>
                            <Button type='primary'>Process Order</Button>
                        </Popconfirm>
                    }
                    {
                        (data.state === 'PROCESSED' && !data.return) &&
                        <Popconfirm onConfirm={returnB} title="Are you sure" description='This will re-add order quantity to current stock'>
                            <Button type='primary'>Execute Return</Button>
                        </Popconfirm>
                    }
                </Space>
            </Flex>
            <OrderManager billId={id} changeAllowed={(data.state === 'DRAFT' || data.state === 'REJECTED')} returnAllowed={data.state === 'PROCESSED' && !data.return} />
        </>
    )
}

export default OrderDetail;
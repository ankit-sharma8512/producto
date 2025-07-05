import { App, Button, Card, Form, Typography, DatePicker, Space, InputNumber } from 'antd';
import { useStockPDF } from '../../hooks/pdf-api';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function ListPDF() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutateAsync: fetchPdf, isLoading } = useStockPDF()

  async function downloadStockPdf(filter) {
    try {
      const f = {};
      if (filter.range) {
        f.from = filter.range[0].toISOString()
        f.to = filter.range[1].toISOString()
      }
      if (filter.less)
        f.less = filter.less
      if (filter.more)
        f.more = filter.more;

      const file = await fetchPdf(f)

      const href = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `Stock-${moment().format('DD-MM-YYYY')}.pdf`);
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
  return (
    <Card>
      <Title level={3}>Download Stock Report</Title>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        labelAlign='left'
        onFinish={downloadStockPdf}
      >
        <Form.Item name='range' label='Date Range' help='This will filter purchase quantity for products made in this range'>
          <RangePicker />
        </Form.Item>
        <Form.Item name='less' label='Minimum Quantity Limit' help='This will filter available quantity less than specified value'>
          <InputNumber style={{ width: '10%' }} placeholder='Less than' />
        </Form.Item>
        <Form.Item name='more' label='Maximum Quantity Limit' help='This will filter available quantity more than specified value'>
          <InputNumber style={{ width: '10%' }} placeholder='More than' />
        </Form.Item>
        <Space style={{ marginTop: 16 }}>
          <Button disabled={isLoading} danger onClick={() => form.resetFields()}>Reset</Button>
          <Button icon={<DownloadOutlined />} loading={isLoading} type='primary' htmlType='submit'>Stock PDF</Button>
        </Space>
      </Form>
    </Card>
  )
}

export default ListPDF
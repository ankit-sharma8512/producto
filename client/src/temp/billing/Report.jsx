import { App, Button, Card, Form, Typography, DatePicker, Space } from 'antd';
import { useSalePDF } from '../../hooks/pdf-api';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function BillReport() {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutateAsync: fetchPdf, isLoading } = useSalePDF()

  async function downloadSalePdf(filter) {
    try {
      const f = {};
      f.from = filter.range[0].toISOString()
      f.to = filter.range[1].toISOString()

      const file = await fetchPdf(f)

      const href = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `Sale-${moment().format('DD-MM-YYYY')}.pdf`);
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
      <Title level={3}>Download Sale Report</Title>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        labelAlign='left'
        onFinish={downloadSalePdf}
      >
        <Form.Item rules={[{ required: true }]} name='range' label='Date Range' help='This will filter sales made during this period'>
          <RangePicker />
        </Form.Item>
        <Space style={{ marginTop: 16 }}>
          <Button disabled={isLoading} danger onClick={() => form.resetFields()}>Reset</Button>
          <Button icon={<DownloadOutlined />} loading={isLoading} type='primary' htmlType='submit'>Sale Report</Button>
        </Space>
      </Form>
    </Card>
  )
}

export default BillReport
import { Form, Select, Input, InputNumber, Flex, Typography, App, Button, Divider, Spin, Alert } from "antd";
import { useAddProduct, useUpdateProduct, useProductDetail } from "../../hooks/product-api"
import { useNavigate, useParams } from "react-router-dom";

const rule   = [{ required: true, message: 'Please enter this field' }]
const brands = [{ label: 'VLCC', value: 'VLCC' }, { label:'Ustraa', value:'Ustraa' }, { label: 'Vega', value: 'Vega' }, {label:'Lotus', value:'Lotus'}];

function ProductCreate() {
    const addProduct                   = useAddProduct()
    const updateProduct                = useUpdateProduct()
    const { id }                       = useParams()
    const { data, isLoading, isError } = useProductDetail(id, { enabled: Boolean(id) });
    const navigate                     = useNavigate()
    
    const { message } = App.useApp()

    async function onFinish(values) {
        try {
            let result
            if(id)
                result = await updateProduct.mutateAsync({ id, ...values });
            else
                result = await addProduct.mutateAsync(values);

            message.success(`Product ${id ? 'updated' : 'added'} successfully`)

            const resultid = (result?.['id'] || result?.[0].id);
            if(resultid)
                navigate('/product/' + resultid)
            else
                navigate('/product')
        }
        catch(err) {
            console.log(err)
            message.error(`Failed to ${id ? 'update' : 'add'} product`)
        }
    }

    if(id && isLoading) return <Spin/>;
    if(id && isError)   return <Alert type="error" message="Failed to load product detail" />

    return (
        <>
            <Typography.Title level={3}>{id ? 'Update' : 'Add'} Product</Typography.Title>
            <Divider/>
            <Form
                name          = 'add-upd-prod'
                onFinish      = {onFinish}
                layout        = "horizontal"
                labelCol      = {{ span: 5 }}
                labelAlign    = "left"
                preserve      = {false}
                initialValues = {data ? data : {}}
            >
                <Form.Item name='brand' label='Brand' rules={rule}>
                    <Select options={brands} placeholder='Enter brand' />
                </Form.Item>
                <Form.Item name='name' label='Name' rules={rule}>
                    <Input placeholder="Enter Name" />
                </Form.Item>
                <Form.Item name='hsn' label='HSN Code' rules={rule}>
                    <Input placeholder="Enter HSN Code" />
                </Form.Item>
                <Form.Item name='mrp' label='MRP' rules={rule}>
                    <InputNumber placeholder="Enter Product MRP" style={{ width: '40%' }} addonAfter={<span>INR</span>}/>
                </Form.Item>
                <Flex justify='end' gap={10}>
                    <Button disabled={addProduct.isLoading || updateProduct.isLoading} danger onClick={() => navigate(-1)}>Cancel</Button>
                    <Button loading={addProduct.isLoading || updateProduct.isLoading} htmlType="submit" type="primary">{id ? 'Update' : 'Add'}</Button>
                </Flex>
            </Form>
        </>
    )
}

export default ProductCreate;
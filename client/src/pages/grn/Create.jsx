import { App, Button, Flex, Form, InputNumber, Select, Space, Typography } from "antd";
import DebouncedSelect from "../../components/DebouncedSelect";
import { useProductList } from "../../hooks/product-api";
import { useState } from "react";
import { useCreateGRN } from "../../hooks/grn-api";

function CreateGRN() {
    const [form ]             = Form.useForm()
    const [search, setSearch] = useState(null);
    const createGRN           = useCreateGRN();
    const { message }         = App.useApp()
    const { data: prods, isFetching: isLoadingProd, isError: isErrorProd } = useProductList({ search, page: 1, size: 20 }, { enabled: Boolean(search), refetchOnWindowFocus: false })

    async function onFinish(values) {
        try {
            await createGRN.mutateAsync(values);
            message.success("GRN created successfully");
            form.resetFields()
        }
        catch {
            message.error("Failed to create GRN")
        }
    } 

    return (
        <Flex>
            <Form
                form = {form}
                style={{width:'100%'}}
                onFinish={onFinish}
            >
                <Flex gap={10} justify="space-between" style={{width:'100%'}}>
                    <Flex gap={20}>
                        <Typography.Title level={5} style={{width:'40%'}}>Create GRN</Typography.Title>
                        <Form.Item name='pid' rules={[{ required: true, message: 'Select a product to add' }]}>
                            <DebouncedSelect
                                allowClear
                                options     = {prods?.results.map(b => ({ label: b.name + ` (MRP:Rs.${b.mrp}) (Brand:${b.brand})`, value: b.id }))}
                                isFetching  = {isLoadingProd}
                                isError     = {isErrorProd}
                                trigger     = {v => setSearch(v)}
                                placeholder = 'Search Products'
                                style       = {{ width: '30vw' }}
                                />
                        </Form.Item>
                        <Form.Item rules={[{ required: true }]} name='quantity' style={{ width: '45%' }}>
                            <InputNumber placeholder="Quantity" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true }]} name='type' style={{ width: '63%' }}>
                            <Select placeholder="Type"  options={[
                                { label: "Positive (Add)", value: 'positive' },
                                { label: "Negative (Deduct)", value: 'negative' }
                            ]} style={{ width: '100%' }} />
                        </Form.Item>
                    </Flex>
                    <Space style={{ alignItems:'flex-start'}}>
                        <Button danger onClick={form.resetFields}>Reset</Button>
                        <Button type='primary' htmlType="submit">Create</Button>
                    </Space>
                </Flex>
            </Form>
        </Flex>
    );
}

export default CreateGRN;
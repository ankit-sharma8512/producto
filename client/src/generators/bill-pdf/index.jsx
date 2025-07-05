import { useMemo } from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import styles from './styles';
import Header from './Header';
import Footer from './Footer';
import Total from './Total';
import { calculate } from '../../utils/bill';

const W = [4, 29, 8, 7, 4, 7, 9, 5, 8, 8, 11].map(e => e / 100)

function BillPDF({ bill }) {
  const productMap = useMemo(() => bill?.productDetails?.reduce((agg, curr) => ({ ...agg, [curr.uid]: curr }), {}) || {}, [bill?.productDetails]);
  const productAmts = useMemo(() => bill?.products.map((p, i) => calculate(p, i, productMap)), [bill?.products])

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text fixed style={{ fontSize: 10, textAlign: 'center', marginBottom: 12, textDecoration: 'underline' }}>TAX INVOICE</Text>
        <Header bill={bill} />
        <BillTable products={productAmts} />
        <Total products={productAmts} />
        <Footer />
        <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8 }} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
      </Page>
    </Document>
  )
}

function BillTable({ products }) {
  return (
    <>
      <View fixed style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.cellH, { flex: W[0] }]}>S.No</Text>
        <Text style={[styles.cellH, { flex: W[1] }]}>Product Name</Text>
        <Text style={[styles.cellH, { flex: W[2] }]}>HSN Code</Text>
        <Text style={[styles.cellH, { flex: W[3] }]}>MRP</Text>
        <Text style={[styles.cellH, { flex: W[4] }]}>Qty</Text>
        <Text style={[styles.cellH, { flex: W[5] }]}>Rate</Text>
        <Text style={[styles.cellH, { flex: W[6] }]}>Amount</Text>
        <Text style={[styles.cellH, { flex: W[7] }]}>Disc%</Text>
        <Text style={[styles.cellH, { flex: W[8] }]}>Disc Amt</Text>
        <Text style={[styles.cellH, { flex: W[9] }]}>GST(18%)</Text>
        <Text style={[styles.cellHLast, { flex: W[10] }]}>Net Amt</Text>
      </View>
      {products.map(prod => (
        <View wrap={false} key={prod.i} style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.cellD, { flex: W[0], textAlign: 'right' }]}>{prod.i + 1}</Text>
          <Text style={[styles.cellD, { flex: W[1] }]}>{prod.product.name}</Text>
          <Text style={[styles.cellD, { flex: W[2], textAlign: 'center' }]}>{prod.product.hsn}</Text>
          <Text style={[styles.cellD, { flex: W[3], textAlign: 'right' }]}>{prod.product.mrp.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[4], textAlign: 'right' }]}>{prod.order.quantity}</Text>
          <Text style={[styles.cellD, { flex: W[5], textAlign: 'right' }]}>{prod.calc.gstExcludedRate.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[6], textAlign: 'right' }]}>{prod.calc.amount.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[7], textAlign: 'center' }]}>{prod.order.discount}</Text>
          <Text style={[styles.cellD, { flex: W[8], textAlign: 'right' }]}>{prod.calc.disc.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[9], textAlign: 'right' }]}>{prod.calc.tgst.toFixed(2)}</Text>
          <Text style={[styles.cellDLast, { flex: W[10], textAlign: 'right' }]}>{prod.calc.net.toFixed(2)}</Text>
        </View>
      ))}
    </>
  );
}



export default BillPDF;

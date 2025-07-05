import { useMemo } from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import styles from './styles';
import Header from './Header';
import { calculate } from '../../utils/bill';
import moment from 'moment';

const W = [5, 15, 35, 12, 12, 10, 11].map(e => e / 100)

function BillPDF({ bills, productMap }) {
  const amts = useMemo(() => {
    return bills.map(b => {
      const each = b?.products.map((p, i) => calculate(p, i, productMap));
      return {
        ...b,
        total: each.reduce((agg, curr) => agg + curr.calc.net, 0)
      }
    })
  }, [bills])
  console.log(amts)

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text fixed style={{ fontSize: 10, textAlign: 'center', marginBottom: 12, textDecoration: 'underline' }}>Bill List</Text>
        <Header />
        <BillTable amts={amts} />
        <Text style={{ fontSize: 10, marginTop: 12 }}>Total Sale: {amts?.reduce((agg, curr) => agg + curr.total, 0).toFixed(2)}</Text>
        {/* <Total products={productAmts} /> */}
        {/* <Footer /> */}
        <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8 }} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
      </Page>
    </Document>
  )
}

function BillTable({ amts }) {
  return (
    <>
      <View fixed style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.cellH, { flex: W[0] }]}>S.No</Text>
        <Text style={[styles.cellH, { flex: W[1] }]}>Bill No</Text>
        <Text style={[styles.cellH, { flex: W[2] }]}>Buyer Name</Text>
        <Text style={[styles.cellH, { flex: W[3] }]}>Buyer GSTIN</Text>
        <Text style={[styles.cellH, { flex: W[4] }]}>Buyer Contact</Text>
        <Text style={[styles.cellH, { flex: W[5] }]}>Date</Text>
        <Text style={[styles.cellHLast, { flex: W[6] }]}>Amount</Text>
      </View>
      {amts.map((b, i) => (
        <View wrap={false} key={b.billNo} style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.cellD, { flex: W[0], textAlign: 'right' }]}>{i + 1}</Text>
          <Text style={[styles.cellD, { flex: W[1], textAlign: 'center' }]}>{b.billNo}</Text>
          <Text style={[styles.cellD, { flex: W[2], textAlign: 'left' }]}>{b.buyer.name}</Text>
          <Text style={[styles.cellD, { flex: W[3], textAlign: 'center' }]}>{b.buyer.gst}</Text>
          <Text style={[styles.cellD, { flex: W[4], textAlign: 'center' }]}>{b.buyer.contact}</Text>
          <Text style={[styles.cellD, { flex: W[5], textAlign: 'center' }]}>{moment(b.createdAt).format('DD/MM/YYYY')}</Text>
          <Text style={[styles.cellDLast, { flex: W[6], textAlign: 'right' }]}>{b.total.toFixed(2)}</Text>
        </View>
      ))}
    </>
  );
}



export default BillPDF;

// const { Document, Page } = lazy(() => import('@react-pdf/renderer'))
import { Document, Page, Text, View } from '@react-pdf/renderer'
import styles from './styles';
import moment from 'moment';
import { useMemo } from 'react';

const W = [3, 11, 24, 8, 8, 8, 7, 8, 4, 10, 10].map(e => e / 100);

function InventoryPDF({ products }) {

  const tval = useMemo(() => products?.reduce((agg, curr) => agg + curr.quantity * curr.price, 0), [products]);
  const tmrp = useMemo(() => products?.reduce((agg, curr) => agg + curr.quantity * curr.mrp, 0), [products]);
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={{ fontSize: 10, textAlign: 'center', textDecoration: 'underline' }}>INVENTORY LIST</Text>
        <View style={[styles.rowsb, styles.header, { alignItems: 'flex-end' }]}>
          <View>
            <Text style={[styles.heading1, styles.bold, { marginBottom: 5 }]}>SAATVIK TRADERS</Text>
            <Text style={{ fontSize: 10 }}>14/A Kachari Bari Road, Manicktalla</Text>
            <Text style={{ fontSize: 10 }}>Kanchrapara, Dist.- North 24 PGS, PIN-743145</Text>
            <Text style={{ fontSize: 10 }}>West Bengal, India</Text>
            <Text style={{ fontSize: 10 }}>GSTIN: 19BPYPS9484J1ZD</Text>
            <Text style={{ fontSize: 10 }}>Mob: 9331237271 / 9748896633, Email: saatviktraders.kpa@gmail.com</Text>
          </View>
        </View>
        <View style={[styles.rowsb, { marginVertical: 5 }]}>
          <Text style={[styles.bold, { fontSize: 10 }]}>Inventory as on: {moment().format('DD/MM/YYYY hh:mm a')}</Text>
          <Text style={{ fontSize: 10 }}>Date: {moment().format('DD/MM/YYYY')}</Text>
        </View>
        <InventoryTable products={products} />
        <View style={{ borderTop: '1 solid black', marginTop: 10, paddingTop: 10, textAlign: 'right' }}>
          <Text style={{ fontSize: 10 }}>Total Value: {tval.toFixed(2)} INR</Text>
          <Text style={{ fontSize: 10 }}>Total MRP: {tmrp.toFixed(2)} INR</Text>
        </View>
        <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8 }} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
      </Page>
    </Document>
  )
}

function InventoryTable({ products }) {
  return (
    <>
      <View fixed style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.cellH, { flex: W[0] }]}>S.No</Text>
        <Text style={[styles.cellH, { flex: W[1] }]}>Prod ID (ST/)</Text>
        <Text style={[styles.cellH, { flex: W[2] }]}>Product Name</Text>
        <Text style={[styles.cellH, { flex: W[3] }]}>HSN Code</Text>
        <Text style={[styles.cellH, { flex: W[4] }]}>Mfg Date</Text>
        <Text style={[styles.cellH, { flex: W[5] }]}>Exp Date</Text>
        <Text style={[styles.cellH, { flex: W[6] }]}>Price</Text>
        <Text style={[styles.cellH, { flex: W[7] }]}>MRP</Text>
        <Text style={[styles.cellH, { flex: W[8] }]}>Qty</Text>
        <Text style={[styles.cellH, { flex: W[9] }]}>Total Value</Text>
        <Text style={[styles.cellHLast, { flex: W[10] }]}>Total MRP</Text>
      </View>
      {products.map((prod, i) => (
        <View wrap={false} key={prod.uid} style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.cellD, { flex: W[0], textAlign: 'right' }]}>{i + 1}</Text>
          <Text style={[styles.cellD, { flex: W[1], textAlign: 'center' }]}>{prod.uid.slice(3)}</Text>
          <Text style={[styles.cellD, { flex: W[2] }]}>{prod.name}</Text>
          <Text style={[styles.cellD, { flex: W[3], textAlign: 'center' }]}>{prod.hsn}</Text>
          <Text style={[styles.cellD, { flex: W[4], textAlign: 'center' }]}>{prod.mfgDate ? moment(prod.mfgDate).format('DD/MM/YYYY') : '-'}</Text>
          <Text style={[styles.cellD, { flex: W[5], textAlign: 'center' }]}>{prod.expDate ? moment(prod.expDate).format('DD/MM/YYYY') : '-'}</Text>
          <Text style={[styles.cellD, { flex: W[6], textAlign: 'right' }]}>{prod.price.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[7], textAlign: 'right' }]}>{prod.mrp.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[8], textAlign: 'right' }]}>{prod.quantity}</Text>
          <Text style={[styles.cellD, { flex: W[9], textAlign: 'right' }]}>{(prod.quantity * prod.price).toFixed(2)}</Text>
          <Text style={[styles.cellDLast, { flex: W[10], textAlign: 'right' }]}>{(prod.quantity * prod.mrp).toFixed(2)}</Text>
        </View>
      ))}
    </>
  );
}

export default InventoryPDF;
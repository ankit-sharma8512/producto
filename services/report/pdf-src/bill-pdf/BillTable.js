import { Text, View } from '@react-pdf/renderer'
import { calculateTableEntries } from '../../utils/bill.js';
import styles from './styles.js';
import Total from './Total.js'
const W = [4, 29, 8, 7, 4, 7, 9, 5, 8, 8, 11].map(e => e / 100)


function BillTable({ order }) {
  const products = calculateTableEntries(order);

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
      {products.map((prod, i) => (
        <View wrap={false} key={prod._id} style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.cellD, { flex: W[0], textAlign: 'right' }]}>{i + 1}</Text>
          <Text style={[styles.cellD, { flex: W[1] }]}>{prod.name}</Text>
          <Text style={[styles.cellD, { flex: W[2], textAlign: 'center' }]}>{prod.hsn}</Text>
          <Text style={[styles.cellD, { flex: W[3], textAlign: 'right' }]}>{prod.mrp.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[4], textAlign: 'right' }]}>{prod.quantity}</Text>
          <Text style={[styles.cellD, { flex: W[5], textAlign: 'right' }]}>{prod.rate.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[6], textAlign: 'right' }]}>{prod.gross.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[7], textAlign: 'center' }]}>{prod.discount}</Text>
          <Text style={[styles.cellD, { flex: W[8], textAlign: 'right' }]}>{prod.discountAmt.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[9], textAlign: 'right' }]}>{(prod.sgst + prod.cgst).toFixed(2)}</Text>
          <Text style={[styles.cellDLast, { flex: W[10], textAlign: 'right' }]}>{prod.net.toFixed(2)}</Text>
        </View>
      ))}
      <Total products={products} />
    </>
  );
}

export default BillTable;
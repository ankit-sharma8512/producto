import { Text, View } from '@react-pdf/renderer'
import styles from './styles.js';
const W = [4, 38, 10, 8, 10, 10, 10, 10].map(e => e / 100)

function StockTable({ products }) {
  const totalMRP = products.reduce((agg, curr) => agg + curr.available * curr.mrp, 0);
  const totalCost = products.reduce((agg, curr) => agg + curr.cost, 0);
  return (
    <>
      <View fixed style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.cellH, { flex: W[0] }]}>S.No</Text>
        <Text style={[styles.cellH, { flex: W[1] }]}>Product Name</Text>
        <Text style={[styles.cellH, { flex: W[2] }]}>HSN Code</Text>
        <Text style={[styles.cellH, { flex: W[3] }]}>MRP</Text>
        <Text style={[styles.cellH, { flex: W[4] }]}>Opening</Text>
        <Text style={[styles.cellH, { flex: W[5] }]}>Received</Text>
        <Text style={[styles.cellH, { flex: W[6] }]}>Consumed</Text>
        <Text style={[styles.cellHLast, { flex: W[7] }]}>Closing</Text>
      </View>
      {products.map((prod, i) => (
        <View wrap={false} key={prod._id} style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.cellD, { flex: W[0], textAlign: 'right' }]}>{i + 1}</Text>
          <Text style={[styles.cellD, { flex: W[1] }]}>{prod.name}</Text>
          <Text style={[styles.cellD, { flex: W[2], textAlign: 'center' }]}>{prod.hsn}</Text>
          <Text style={[styles.cellD, { flex: W[3], textAlign: 'right' }]}>{prod.mrp.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[4], textAlign: 'right' }]}>{(prod.available + prod.consumed) - prod.bought}</Text>
          <Text style={[styles.cellD, { flex: W[5], textAlign: 'right' }]}>{prod.bought}</Text>
          <Text style={[styles.cellD, { flex: W[6], textAlign: 'right' }]}>{prod.consumed}</Text>
          <Text style={[styles.cellDLast, { flex: W[7], textAlign: 'right' }]}>{prod.available}</Text>
        </View>
      ))}
      <Text style={{ fontSize: 10, marginTop: 12 }}>Total MRP: {totalMRP.toFixed(2)} INR</Text>
      <Text style={{ fontSize: 10, marginTop: 12 }}>Total Cost: {totalCost.toFixed(2)} INR</Text>
    </>
  );
}

export default StockTable;
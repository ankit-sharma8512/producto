import { Text, View } from '@react-pdf/renderer'
import styles from './styles.js';
const W = [4, 18, 37, 5, 9, 9, 9, 9].map(e => e / 100)

function StockTable({ sales }) {
  let totalSale = 0;
  let totalCost = 0;
  let totalReceived = 0;

  return (
    <>
      <View fixed style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.cellH, { flex: W[0] }]}>S.No</Text>
        <Text style={[styles.cellH, { flex: W[1] }]}>Bill No</Text>
        <Text style={[styles.cellH, { flex: W[2] }]}>Name</Text>
        <Text style={[styles.cellH, { flex: W[3] }]}>Qty</Text>
        <Text style={[styles.cellH, { flex: W[4] }]}>Cost</Text>
        <Text style={[styles.cellH, { flex: W[5] }]}>Sale</Text>
        <Text style={[styles.cellH, { flex: W[6] }]}>P/L</Text>
        <Text style={[styles.cellHLast, { flex: W[7] }]}>Received</Text>
      </View>
      {sales.map((s, i) => {
        const amounts = s.sale.reduce((agg, curr) => ({
          ...agg,
          qty: agg.qty + curr.quantity,
          cost: agg.cost + curr.cost,
          sale: agg.sale + curr.net,
        }), { qty: 0, cost: 0, sale: 0 })
        totalSale += amounts.sale;
        totalCost += amounts.cost
        totalReceived += s.payment.received;

        return <View wrap={false} key={i} style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.cellD, { flex: W[0], textAlign: 'right' }]}>{i + 1}</Text>
          <Text style={[styles.cellD, { flex: W[1], textAlign: 'center' }]}>{s.billId.billNo}</Text>
          <Text style={[styles.cellD, { flex: W[2], textAlign: 'left' }]}>{s.billId.buyerId.name || s.billId.buyer.name}</Text>
          <Text style={[styles.cellD, { flex: W[3], textAlign: 'right' }]}>{amounts.qty}</Text>
          <Text style={[styles.cellD, { flex: W[4], textAlign: 'right' }]}>{amounts.cost.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[5], textAlign: 'right' }]}>{amounts.sale.toFixed(2)}</Text>
          <Text style={[styles.cellD, { flex: W[6], textAlign: 'right' }]}>{(amounts.sale - amounts.cost).toFixed(2)}</Text>
          <Text style={[styles.cellDLast, { flex: W[7], textAlign: 'right' }]}>{s.payment.received.toFixed(2)}</Text>
        </View>
      })}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 10 }}>Total Sale: {totalSale.toFixed(2)} INR</Text>
        <Text style={{ fontSize: 10 }}>Total Cost: {totalCost.toFixed(2)} INR</Text>
        <Text style={{ fontSize: 10 }}>Total Received: {totalReceived.toFixed(2)} INR</Text>
        <Text style={{ fontSize: 10 }}>Total Profit/Loss: {(totalSale - totalCost).toFixed(2)} INR</Text>
        <Text style={{ fontSize: 10 }}>Total Pending: {(totalSale - totalReceived).toFixed(2)} INR</Text>
      </View>
    </>
  );
}

export default StockTable;
import { View, Text } from "@react-pdf/renderer"
import styles from "./styles"
import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});

function Total({ products }) {
  const tqty = products.reduce((agg, curr) => agg + curr.order.quantity, 0).toFixed(0);
  const gross = products.reduce((agg, curr) => agg + curr.calc.amount, 0).toFixed(2);
  const disc = products.reduce((agg, curr) => agg + curr.calc.disc, 0).toFixed(2);
  const sgst = products.reduce((agg, curr) => agg + curr.calc.tsgst, 0).toFixed(2);
  const cgst = products.reduce((agg, curr) => agg + curr.calc.tcgst, 0).toFixed(2);
  const net = products.reduce((agg, curr) => agg + curr.calc.net, 0).toFixed(2);
  const round = ((((net * 100) % 100).toFixed(0)) / 100).toFixed(2);
  const pay = (net - round).toFixed(2);

  return (
    <View wrap={false} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, marginTop: 10, padding: 4, borderBottom: '1 solid #bbb', borderTop: '1 solid #bbb' }}>
      <Text style={{ fontSize: 10 }}>Total Quantity: {tqty}</Text>
      <Text style={{ fontSize: 10 }}>Total Gross Amount: {gross}</Text>
      <Text style={{ fontSize: 10 }}>Total Discount Amount: {disc}</Text>
      <Text style={{ fontSize: 10 }}>Total SGST (@ 9%): {sgst}</Text>
      <Text style={{ fontSize: 10 }}>Total CGST (@ 9%): {cgst}</Text>
      <Text style={{ fontSize: 10 }}>Total Net Amount: {net}</Text>
      <Text style={{ fontSize: 10 }}>Round off: {round}</Text>
      <Text style={{ fontSize: 10, ...styles.bold }}>Total Payable: {pay} INR</Text>
      <Text style={{ fontSize: 10, alignSelf: 'flex-start' }}>Total in words: {toWords.convert(pay, { currency: true })}</Text>
    </View>
  )
}

export default Total

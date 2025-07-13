import { Document, Page, Text, View } from '@react-pdf/renderer'
import styles from './styles.js';
import Header from './Header.js';
import Footer from './Footer.js';
import Total from './Total.js';

function DeliveryNote({ data }) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text fixed style={{ fontSize: 10, textAlign: 'center', marginBottom: 12, textDecoration: 'underline' }}>DELIVERY NOTE</Text>
        <Header bill={data} />
        <View>
          <Text style={{ fontSize: 10, fontWeight: 700 }}>Description of Items</Text>
          <Text style={{ fontSize: 10 }}>Total Items: {data.order.length}</Text>
          <Text style={{ fontSize: 10 }}>Total Quantity: {data.order.reduce((agg, curr) => agg + curr.quantity, 0)}</Text>
        </View>
        <Total order={data.order} />
        <Footer data={data} />
        <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8 }} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
      </Page>
    </Document>
  )
}

export default DeliveryNote;
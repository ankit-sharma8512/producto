import { Document, Page, Text, View } from '@react-pdf/renderer'
import styles from './styles.js';
import Header from './Header.js';
import SaleTable from './SaleTable.js'
import moment from 'moment';

function StockReport({ data }) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text fixed style={{ fontSize: 10, textAlign: 'center', marginBottom: 12, textDecoration: 'underline' }}>SALE REPORT</Text>
        <Header />
        <View style={{ marginVertical: 10 }}>
          {data.during && <Text style={{ fontSize: 10 }}>Sale Duration: {moment(data.during.from).format('DD-MM-YYYY')} to {moment(data.during.to).format('DD-MM-YYYY')}</Text>}
        </View>
        <SaleTable sales={data.sales} />
        <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8 }} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
      </Page>
    </Document>
  )
}

export default StockReport;
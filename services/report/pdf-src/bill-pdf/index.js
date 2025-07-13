import { Document, Page, Text } from '@react-pdf/renderer'
import styles from './styles.js';
import Header from './Header.js';
import BillTable from './BillTable.js';
import Footer from './Footer.js';


function BillPDF({ data }) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text fixed style={{ fontSize: 10, textAlign: 'center', marginBottom: 12, textDecoration: 'underline' }}>TAX INVOICE</Text>
        <Header bill={data} />
        <BillTable order={data.order} />
        <Footer />
        <Text style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 8 }} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
      </Page>
    </Document>
  )
}

export default BillPDF;
import { renderToStream } from '@react-pdf/renderer';
import BillPDF from './bill-pdf/index.js';
import HelloWorldPDF from './hello-world.js';
import DeliveryNote from './delivery-note/index.js';
import StockReport from './product-stock/index.js';
import SaleReport from './sale-report/index.js';

const typeMap = {
  'hello-world': HelloWorldPDF,
  'bill': BillPDF,
  'delivery-note': DeliveryNote,
  'product-stock': StockReport,
  'sale-report': SaleReport
}

class PDFEngine {
  static async generatePDFStream(type, data = {}) {
    const PDFDoc = typeMap[type] || HelloWorldPDF;
    const stream = await renderToStream(<PDFDoc data={data} />);
    return stream
  }
}

export default PDFEngine
import { Document, Page, Text } from "@react-pdf/renderer";

function HelloWorldPDF() {
  return (
    <Document>
      <Page>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 450 }}>Hello World</Text>
      </Page>
    </Document>
  )
}

export default HelloWorldPDF
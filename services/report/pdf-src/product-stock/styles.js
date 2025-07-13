import { StyleSheet } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontFamily: 'Helvetica'
  },
  rowsb: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    borderBottom: '1 solid #000',
    paddingBottom: 6
  },
  heading1: {
    fontSize: 20
  },
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  cellH: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    borderTop: 0.8,
    borderBottom: 0.8,
    borderLeft: 0.8,
    borderColor: 'black',
    padding: 2
  },
  cellHLast: {
    fontSize: 8,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    borderTop: 0.8,
    borderBottom: 0.8,
    borderLeft: 0.8,
    borderRight: 0.8,
    borderColor: 'black',
    padding: 2
  },
  cellD: {
    fontSize: 8,
    borderBottom: 0.8,
    borderLeft: 0.8,
    borderColor: 'black',
    padding: 2
  },
  cellDLast: {
    fontSize: 8,
    borderBottom: 0.8,
    borderLeft: 0.8,
    borderRight: 0.8,
    borderColor: 'black',
    padding: 2
  },
})

export default styles;
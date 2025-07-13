import { Text, View } from '@react-pdf/renderer'
import styles from './styles.js';
import moment from 'moment';

function Header({ bill }) {
  const buyer = bill.buyerId || bill.buyer;

  return (
    <View fixed>
      <View style={[styles.rowsb, styles.header, { alignItems: 'flex-end' }]}>
        <View>
          <Text style={[styles.heading1, styles.bold, { marginBottom: 5 }]}>SAATVIK TRADERS</Text>
          <Text style={{ fontSize: 10 }}>14/A Kachari Bari Road, Manicktalla</Text>
          <Text style={{ fontSize: 10 }}>Kanchrapara, Dist.- North 24 PGS, PIN-743145</Text>
          <Text style={{ fontSize: 10 }}>West Bengal, India</Text>
          <Text style={{ fontSize: 10 }}>GSTIN: 19BPYPS9484J1ZD</Text>
          <Text style={{ fontSize: 10 }}>Mob: 9331237271 / 9748896633, Email: saatviktraders.kpa@gmail.com</Text>
        </View>
        <Text style={{ ...styles.bold, fontSize: 10 }}>Bill No.: {bill.billNo}</Text>
      </View>
      <View style={[styles.rowsb, { marginTop: 5 }]}>
        <Text style={[styles.bold, { fontSize: 10 }]}>Bill to</Text>
        <Text style={{ fontSize: 10 }}>Date: {moment(bill.billDate).format('DD/MM/YYYY')}</Text>
      </View>
      <View style={{ marginBottom: 10, marginTop: 4 }}>
        <Text style={{ fontSize: 12, ...styles.bold }}>{buyer.name}</Text>
        {buyer.gstin && <Text style={{ fontSize: 10 }}>GSTIN: {buyer.gstin}</Text>}
        {buyer.address && <Text style={{ fontSize: 10 }}>Address: {buyer.address}</Text>}
        {buyer.contact && <Text style={{ fontSize: 10 }}>Contact: {buyer.contact}</Text>}
        {buyer.placeOfSupply && <Text style={{ fontSize: 10 }}>Place Of Supply: {buyer.placeOfSupply}</Text>}
      </View>
    </View>
  )
}

export default Header

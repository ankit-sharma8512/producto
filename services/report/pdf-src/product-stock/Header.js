import { Text, View } from '@react-pdf/renderer'
import styles from './styles.js';
import moment from 'moment';

function Header({ }) {
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
      </View>
      <View style={[styles.rowsb, { marginTop: 5 }]}>
        <Text style={{ fontSize: 10 }}>Report Date: {moment().format('DD/MM/YYYY hh:mm a')}</Text>
      </View>
    </View>
  )
}

export default Header

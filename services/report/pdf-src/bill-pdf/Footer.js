import { Text, View } from '@react-pdf/renderer'

function Footer() {
  return (
    <>
      <View wrap={false} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, marginTop: 8, borderTop: '1px solid black' }}>
        <View style={{ border: '1 solid black', width: '50%', padding: 2 }}>
          <Text style={{ fontSize: 8 }}>Note:</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'flex-end' }}>
          <View style={{ height: 60, borderBottom: '1 solid #999' }}>
          </View>
          <Text style={{ fontSize: 10, marginTop: 6, textAlign: 'right' }}>Saatvik Traders</Text>
        </View>
      </View>
    </>
  )
}

export default Footer
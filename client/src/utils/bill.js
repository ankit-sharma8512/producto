export function calculate(prod, i, map) {
  // Per Product Calculation
  const gst = prod.cgst + prod.sgst;
  const gstExcludedRate = prod.rate / ((100 + gst) / 100);
  const discount = gstExcludedRate * (prod.discount / 100);
  const effectiveRate = gstExcludedRate - discount;
  const cgst = effectiveRate * (prod.cgst / 100);
  const sgst = effectiveRate * (prod.sgst / 100);

  const amount = (gstExcludedRate * prod.quantity);
  const disc = (discount * prod.quantity);
  const tcgst = cgst * prod.quantity;
  const tsgst = sgst * prod.quantity;
  const tgst = tcgst + tsgst;

  const net = (amount - disc) + tgst;

  return {
    i,
    order: { ...prod, gst },
    product: map[prod.uid],
    calc: { gstExcludedRate, amount, disc, tgst, net, tsgst, tcgst }
  }
}
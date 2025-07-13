function calculateTableEntries(order, idOnly = false) {
  return order?.map(curr => {
    const gst             = curr.sgst + curr.cgst;
    const gstExcludedRate = curr.rate / ((100 + gst) / 100);
    const discount        = gstExcludedRate * (curr.discount / 100);
    const effectiveRate   = gstExcludedRate - discount;
    const cgst            = effectiveRate * (curr.cgst / 100);
    const sgst            = effectiveRate * (curr.sgst / 100);
    const qty             = curr.quantity - curr.return;

    return {
      ...(idOnly ? curr : curr.pid),
      quantity    : qty,
      rate        : gstExcludedRate,
      discount    : curr.discount,
      gross       : gstExcludedRate * qty,
      sgst        : sgst * qty,
      cgst        : cgst * qty,
      discountAmt : discount * qty,
      net         : (effectiveRate + cgst + sgst) * qty
    }
  })
}

module.exports = {calculateTableEntries}
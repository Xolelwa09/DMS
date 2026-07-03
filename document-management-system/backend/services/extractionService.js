const extractInvoiceData = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Vendor
  let vendor = null;

  for (const line of lines.slice(0, 10)) {
    if (line.length < 4) continue;
    if (/\d/.test(line)) continue;
    if (line.includes("@")) continue;
    if (/invoice|tax invoice|bill|statement/i.test(line))
      continue;

    vendor = line;
    break;
  }

  // Invoice Number
  const invoiceNumber =
    text.match(
      /(invoice\s*(number|no|#)|inv\s*(number|no|#))[:\s]*([A-Za-z0-9-]+)/i
    )?.[4] || null;

  // Amount
  const amountMatch =
    text.match(
      /(total amount due|total due|grand total|invoice total|total)[:\sR$]*([\d,.]+)/i
    ) ||
    text.match(/R\s*([\d,.]+)/i);

  const amount = amountMatch
    ? parseFloat(amountMatch[2] || amountMatch[1].replace(/,/g, ""))
    : null;

  // VAT
  const vatMatch =
    text.match(
      /(vat|tax)[:\sR$]*([\d,.]+)/i
    );

  const vat = vatMatch
    ? parseFloat(vatMatch[2].replace(/,/g, ""))
    : null;

  return {
    vendor,
    invoiceNumber,
    amount,
    vat,
  };
};
module.exports = {
  extractInvoiceData,
};
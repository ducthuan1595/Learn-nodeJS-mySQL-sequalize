const fs = require("fs");
const pdfkit = require("pdfkit");

exports.deleteFile = (filePath) => {
  console.log("path", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("errpr");
      throw err;
    }
  });
};

exports.sendFile = (res, order, invoicePath) => {
  const pdfDoc = new pdfkit();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);
  
  pdfDoc.fontSize(30).text("Invoice", { underline: true });
  pdfDoc.text("------------------------------------");
  let total = 0;
  console.log('order-file', order, invoicePath);
  order.products.forEach((prod) => {
    total += prod.productData.price * prod.quantity;
    pdfDoc
    .fontSize(14)
    .text(
      prod.productData.title +
          " - " +
          prod.quantity +
          " x " +
          " $ " +
          prod.productData.price
      );
  });
  pdfDoc.text("----");
  pdfDoc.fontSize(22).text(total.toFixed(2));
  pdfDoc.end();
};

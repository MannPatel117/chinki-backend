import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as escpos from 'escpos';
import escposUsb from 'escpos-usb';
const print = asyncHandler(async (req, res) => {
    const device  = new escposUsb()
    const options = { encoding: "GB18030" /* default */ }
    const printer = new escpos.Printer(device, options);
     
      printer.on('ready', () => {
        printer.initialize(); // Initialize printer communication
     
        // Format and print the bill using escpos commands based on billData
        printer.encode('ISO-8859-1'); // Set character encoding (adjust if needed)
        printer.size(2, 2); // Set font size (adjust if needed)
        printer.align('center'); // Center alignment
        printer.text('Your Shop Name\n');
        printer.text('-----------------------------\n');
     
        // Loop through bill items and print details
        for (const item of billData.items) {
          printer.text(`<span class="math-inline">\{item\.name\} x</span>{item.quantity}\n`);
          printer.text(`${item.price.toFixed(2)}\n`);
        }
     
        printer.text('-----------------------------\n');
        printer.text(`Subtotal: $${billData.subtotal.toFixed(2)}\n`);
        printer.text(`Tax: $${billData.tax.toFixed(2)}\n`);
        printer.text(`Total: $${billData.total.toFixed(2)}\n`);
     
        // (Optional) Generate QR code on the server (if applicable)
        // const qrData = 'https://yourwebsite.com/receipt'; // Replace with your data
        // const qrMatrix = qrcode.create(qrData, { type: 'png' }); // Create QR code
     
        // printer.image(qrMatrix, function(err) {
        //   if (err) {
        //     console.error('Error printing QR code:', err);
        //   }
        // });
     
        printer.cut(); // Cut paper after printing
        printer.close(); // Close printer connection
      });
      res.status(200).send('Bill printed successfully');
      printer.on('error', (err) => {
        console.error('Printing error:', err);
        res.status(500).send('Printing failed');
      });
  });

  export { print };
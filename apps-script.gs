// This is the Google Apps Script that should be deployed as a Web App
// Deploy this to your Google Apps Script project and replace the URL in script.js

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Orders');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Orders');
      
      // Add headers
      const headers = [
        'التاريخ والوقت',
        'الاسم الكامل',
        'رقم الهاتف',
        'البريد الإلكتروني',
        'المدينة',
        'العنوان التفصيلي',
        'الكمية',
        'السعر الإجمالي',
        'ملاحظات'
      ];
      sheet.appendRow(headers);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#1e40af');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // Add the order data
    const newRow = [
      data.timestamp,
      data.name,
      data.phone,
      data.email,
      data.city,
      data.address,
      data.quantity,
      data.totalPrice,
      data.notes
    ];
    
    sheet.appendRow(newRow);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 9);
    
    // Send confirmation email (optional)
    sendConfirmationEmail(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'تم استقبال طلبك بنجاح'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirmationEmail(data) {
  try {
    // Get the user's email or your email
    const recipientEmail = data.email || 'your-email@gmail.com';
    
    const subject = 'تأكيد استقبال طلبك - Taifi Shop';
    
    const message = `
      <h2>شكراً لك على طلبك!</h2>
      <p>لقد استقبلنا طلبك بنجاح.</p>
      <hr>
      <h3>تفاصيل الطلب:</h3>
      <p><strong>الاسم:</strong> ${data.name}</p>
      <p><strong>رقم الهاتف:</strong> ${data.phone}</p>
      <p><strong>المدينة:</strong> ${data.city}</p>
      <p><strong>العنوان:</strong> ${data.address}</p>
      <p><strong>الكمية:</strong> ${data.quantity}</p>
      <p><strong>الإجمالي:</strong> ${data.totalPrice} د.إ</p>
      ${data.notes ? `<p><strong>ملاحظات:</strong> ${data.notes}</p>` : ''}
      <hr>
      <p>سيتصل بك فريقنا قريباً للتأكد من الطلب والتوصيل.</p>
      <p>شكراً لاختيارك Taifi Shop</p>
    `;
    
    MailApp.sendEmail(recipientEmail, subject, message, {
      htmlBody: message,
      name: 'Taifi Shop'
    });
    
  } catch (error) {
    Logger.log('Error sending email: ' + error);
  }
}

// Test function to verify setup
function testWebApp() {
  Logger.log('Web App is working correctly');
}
import QRCode from 'qrcode';

export async function generateQRCode(content) {
   try {
      return await QRCode.toDataURL(content, {
         width: 200,
         margin: 1,
         color: {
            dark: '#000000',
            light: '#FFFFFF'
         }
      });
   } catch (err) {
      console.error('Error when QR Code generating: ', err);
      return '';
   }
}

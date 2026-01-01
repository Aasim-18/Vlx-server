// 1. Import the default package
import pkg from 'whatsapp-web.js';
// 2. Destructure the parts you need from it
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('------------------------------------------------');
    console.log('🚀 SCAN THIS QR CODE WITH YOUR WHATSAPP TO LOGIN');
    console.log('------------------------------------------------');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Client is Ready!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp Authentication Failed:', msg);
});

client.initialize();

// Export the helper function
export const sendMessage = async (to, message) => {
    try {
        // Ensure format is correct (remove +, spaces, dashes)
        const sanitizedNumber = to.replace(/[- )(]/g, "").replace("+", ""); 
        const finalId = `${sanitizedNumber}@c.us`; 

        await client.sendMessage(finalId, message);
        console.log(`📩 Message sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send to ${to}:`, error);
        return false;
    }
};
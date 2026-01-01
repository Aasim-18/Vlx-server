import { Resend } from 'resend';

// Initialize the Resend Client
// Make sure RESEND_API_KEY is in your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using Resend
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject line
 * @param {string} htmlContent - The HTML body of the email
 */
export const sendEmail = async (to, subject, htmlContent) => {
    try {
        const data = await resend.emails.send({
            
            from: 'onboarding@resend.dev', 
            to: to,
            subject: subject,
            html: htmlContent,
        });

        if (data.error) {
            console.error(`❌ Resend API Error for ${to}:`, data.error);
            return false;
        }

        console.log(`📩 Email sent successfully to ${to}. ID: ${data.data?.id}`);
        return true;

    } catch (error) {
        console.error(`❌ Unexpected Error sending to ${to}:`, error);
        return false;
    }
};
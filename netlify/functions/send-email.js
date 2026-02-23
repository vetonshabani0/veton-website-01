const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Email service not configured',
          message: 'RESEND_API_KEY environment variable is missing'
        })
      };
    }

    const data = JSON.parse(event.body);
    const { name, email, phone, service, message } = data;

    console.log('Received form data:', { name, email, phone, service, message: message?.substring(0, 50) });

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Get recipient email from environment variable or use default
    // Note: In Resend testing mode, you can only send to your verified email address
    // Set CONTACT_EMAIL environment variable in Netlify to your verified email for testing
    // Or verify your domain at https://resend.com/domains to send to any email
    const recipientEmail = process.env.CONTACT_EMAIL || 'info@helveticdynamics.com';
    console.log('Sending email to:', recipientEmail);
    
    // If in testing mode and sending to non-verified email, provide helpful error
    if (!process.env.CONTACT_EMAIL && recipientEmail !== 'vetonshabani0@gmail.com') {
      console.warn('Warning: Resend may be in testing mode. Consider setting CONTACT_EMAIL to your verified email address.');
    }

    // Prepare email content
    const serviceName = service || 'Nicht angegeben';
    const phoneText = phone ? `\nTelefon: ${phone}` : '';
    
    // Service name mapping for better display
    const serviceNames = {
      'transport': 'Gütertransport',
      'logistics': 'Logistik',
      'autoparts': 'Autoersatzteile',
      'vehicles': 'Fahrzeugverkauf & Reparatur',
      'importexport': 'Import & Export',
      'courier': 'Kurierdienste',
      'bauschtelle': 'Baustelle',
      'realestate': 'Immobilien',
      'personnel': 'Vermittlung Personal',
      'temporaryoffice': 'Temporäres Büro',
      'drivers': 'Chauffeur Kategorie B & C',
      'other': 'Sonstiges'
    };
    const displayServiceName = serviceNames[service] || serviceName;
    
    const emailHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kontaktanfrage</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E30613 0%, #B3050F 100%); padding: 40px 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="https://helveticadynamics.netlify.app/assets/icons/hd-just-logo-red.jpeg" alt="Helvetic Dynamics AG" style="width: 120px; height: auto; display: block; margin: 0 auto;">
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Neue Kontaktanfrage</h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Von Ihrer Website erhalten</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Info Card -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #E30613; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 20px; font-weight: 700;">Kontaktinformationen</h2>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">Name:</td>
                          <td style="color: #1a1a1a; font-size: 15px; font-weight: 500;">${name}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">E-Mail:</td>
                          <td style="color: #1a1a1a; font-size: 15px;">
                            <a href="mailto:${email}" style="color: #E30613; text-decoration: none; font-weight: 500;">${email}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">Telefon:</td>
                          <td style="color: #1a1a1a; font-size: 15px; font-weight: 500;">
                            <a href="tel:${phone}" style="color: #E30613; text-decoration: none;">${phone}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td width="140" style="color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">Dienstleistung:</td>
                          <td style="color: #1a1a1a; font-size: 15px; font-weight: 500;">${displayServiceName}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message Card -->
              <div style="background-color: #ffffff; border: 2px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 20px; font-weight: 700;">Nachricht</h2>
                <div style="color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
              </div>

              <!-- Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="mailto:${email}?subject=Re: Ihre Anfrage bei Helvetic Dynamics AG" style="display: inline-block; background: linear-gradient(135deg, #E30613 0%, #B3050F 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(227, 6, 19, 0.3);">Antworten</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; color: #1a1a1a; font-size: 16px; font-weight: 700;">Helvetic Dynamics AG</p>
              <p style="margin: 0 0 12px; color: #666666; font-size: 13px; line-height: 1.5;">
                Mülibachstrasse 42<br>
                8107 Buchs ZH, Schweiz
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Diese E-Mail wurde automatisch über das Kontaktformular auf 
                <a href="https://helveticdynamics.com" style="color: #E30613; text-decoration: none;">helveticdynamics.com</a> gesendet.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailText = `
Neue Kontaktanfrage von der Website

Name: ${name}
E-Mail: ${email}
${phone ? `Telefon: ${phone}` : ''}
Dienstleistung: ${serviceName}

Nachricht:
${message}

---
Diese E-Mail wurde über das Kontaktformular auf helveticdynamics.com gesendet.
    `;

    // Get sender email from environment variable or use default
    // To use your own domain, verify it in Resend and set RESEND_FROM_EMAIL env variable
    // Example: RESEND_FROM_EMAIL="Website Kontaktformular <noreply@helveticdynamics.com>"
    // If domain is not verified, use onboarding@resend.dev (verified by default)
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    console.log('Sending from:', senderEmail);

    // Send email using Resend
    console.log('Attempting to send email via Resend...');
    const emailData = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      replyTo: email,
      subject: `Neue Kontaktanfrage: ${name} - ${serviceName}`,
      html: emailHtml,
      text: emailText
    });

    console.log('Resend API response:', { 
      id: emailData?.id, 
      data: emailData?.data,
      error: emailData?.error 
    });

    // Check if Resend returned an error
    if (emailData.error) {
      console.error('Resend API error:', emailData.error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to send email',
          message: emailData.error.message || 'Resend API error',
          details: emailData.error
        })
      };
    }

    if (!emailData.data || !emailData.data.id) {
      console.error('Unexpected Resend response:', emailData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to send email',
          message: 'Unexpected response from Resend API',
          details: emailData
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        id: emailData.data.id 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        message: error.message 
      })
    };
  }
};

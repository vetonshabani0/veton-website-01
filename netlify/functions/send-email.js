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
    const data = JSON.parse(event.body);
    const { name, email, phone, service, message } = data;

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
    const recipientEmail = process.env.CONTACT_EMAIL || 'info@helveticdynamics.ch';

    // Prepare email content
    const serviceName = service || 'Nicht angegeben';
    const phoneText = phone ? `\nTelefon: ${phone}` : '';
    
    const emailHtml = `
      <h2>Neue Kontaktanfrage von der Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
      <p><strong>Dienstleistung:</strong> ${serviceName}</p>
      <p><strong>Nachricht:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Diese E-Mail wurde über das Kontaktformular auf helveticdynamics.ch gesendet.</p>
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
Diese E-Mail wurde über das Kontaktformular auf helveticdynamics.ch gesendet.
    `;

    // Get sender email from environment variable or use default
    // To use your own domain, verify it in Resend and set RESEND_FROM_EMAIL env variable
    // Example: RESEND_FROM_EMAIL="Website Kontaktformular <noreply@helveticdynamics.ch>"
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Website Kontaktformular <info@helveticdynamics.ch>';

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      replyTo: email,
      subject: `Neue Kontaktanfrage: ${name} - ${serviceName}`,
      html: emailHtml,
      text: emailText
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        id: emailData.id 
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

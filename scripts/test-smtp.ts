import './load-env';

import { getContactToEmail, sendEmail, verifySmtpConnection } from '../src/lib/email';

async function main(): Promise<void> {
  const to = getContactToEmail();

  console.log('Verifying SMTP connection…');
  await verifySmtpConnection();
  console.log('SMTP connection OK');

  console.log(`Sending test email to ${to}…`);
  await sendEmail({
    to,
    subject: 'Fusion Fuel SMTP test',
    text: 'SMTP is configured correctly. Catering form submissions will be delivered to this inbox.',
    html: '<p><strong>SMTP test successful.</strong></p><p>Catering form submissions will be delivered to this inbox.</p>',
  });

  console.log('Test email sent successfully.');
}

main().catch((error: unknown) => {
  console.error('SMTP test failed:', error);
  process.exitCode = 1;
});

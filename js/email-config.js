/* js/email-config.js
 * Sostech Systems — EmailJS configuration
 *
 * HOW TO GET THESE VALUES (free account):
 *   1. Create an account at https://www.emailjs.com/
 *   2. Add an Email Service (Gmail, Outlook, Yahoo...) → copy its "Service ID"
 *   3. Create an Email Template → copy its "Template ID"
 *      In the template, use these variables: {{name}} {{email}} {{phone}} {{message}}
 *      Set the template "To email" to: sostechgh@aol.com
 *   4. In Account → API Keys, copy your "Public Key"
 *   5. Paste the three values below (keep the quotes).
 *
 * These keys are public by design (client-side). Restrict allowed
 * domains in your EmailJS dashboard (Account → Security) for protection.
 */
window.EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID"
};

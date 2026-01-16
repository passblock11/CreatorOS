import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Creator OS',
  description: 'Privacy Policy for Creator OS',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body prose max-w-none">
            <h1 className="text-4xl font-bold mb-2 text-base-content">Privacy Policy</h1>
            <p className="text-sm text-base-content/70 mb-6">
              Last Updated: January 14, 2026
            </p>

            <div className="divider"></div>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Creator OS ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and password when you register</li>
              <li><strong>Profile Information:</strong> Any additional information you choose to add to your profile</li>
              <li><strong>Content:</strong> Posts, captions, media files, and other content you create through our platform</li>
              <li><strong>Payment Information:</strong> Billing details processed through Stripe (we do not store full credit card numbers)</li>
            </ul>

            <h3>2.2 Information from Third-Party Services</h3>
            <ul>
              <li><strong>Snapchat:</strong> When you connect your Snapchat account, we receive your Snapchat profile ID, display name, and access tokens</li>
              <li><strong>Instagram:</strong> When you connect your Instagram account, we receive your Instagram Business/Creator account ID, username, account type, connected Facebook Page information, and access tokens</li>
              <li><strong>Meta/Facebook:</strong> Page information necessary to publish content to Instagram</li>
            </ul>

            <h3>2.3 Automatically Collected Information</h3>
            <ul>
              <li><strong>Usage Data:</strong> Information about how you use our service, including posts created, publish times, and feature usage</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, and pages viewed</li>
              <li><strong>Cookies:</strong> We use cookies to maintain your session and improve user experience</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our services</li>
              <li><strong>Content Publishing:</strong> To publish your content to Snapchat and Instagram on your behalf</li>
              <li><strong>Authentication:</strong> To verify your identity and manage your account</li>
              <li><strong>Communication:</strong> To send you service-related notifications and updates</li>
              <li><strong>Payment Processing:</strong> To process subscription payments through Stripe</li>
              <li><strong>Analytics:</strong> To understand how our service is used and improve functionality</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activities</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            
            <h3>4.1 Third-Party Services</h3>
            <ul>
              <li><strong>Snapchat:</strong> We share your content with Snapchat when you choose to publish to the platform</li>
              <li><strong>Instagram/Meta:</strong> We share your content with Instagram when you choose to publish to the platform</li>
              <li><strong>Stripe:</strong> We share necessary billing information with Stripe to process payments</li>
            </ul>

            <h3>4.2 Service Providers</h3>
            <p>
              We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
            </p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
            </p>

            <h3>4.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will provide notice before your information is transferred and becomes subject to a different privacy policy.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul>
              <li><strong>Encryption:</strong> We use HTTPS/SSL encryption for data transmission</li>
              <li><strong>Password Protection:</strong> Passwords are hashed using bcrypt</li>
              <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
              <li><strong>Secure Storage:</strong> Data is stored in secure databases with access controls</li>
              <li><strong>Token Security:</strong> OAuth tokens are stored securely and refreshed automatically</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 30 days, unless we are required to retain it for legal purposes.
            </p>

            <h2>7. Your Rights and Choices</h2>
            
            <h3>7.1 Access and Update</h3>
            <p>
              You can access and update your account information at any time through your account settings.
            </p>

            <h3>7.2 Account Deletion</h3>
            <p>
              You can request deletion of your account by contacting us. Upon deletion, we will remove your personal information from our active databases.
            </p>

            <h3>7.3 Disconnect Social Accounts</h3>
            <p>
              You can disconnect your Snapchat and Instagram accounts at any time through the Settings page. This will revoke our access to your social media accounts.
            </p>

            <h3>7.4 Opt-Out of Communications</h3>
            <p>
              You can opt out of receiving promotional emails by following the unsubscribe link in the email. You cannot opt out of service-related communications.
            </p>

            <h3>7.5 Data Portability</h3>
            <p>
              You can request a copy of your data in a portable format by contacting us.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our service, you consent to such transfers.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
            </p>

            <h2>11. Instagram Specific Information</h2>
            <p>
              When you connect your Instagram Business or Creator account:
            </p>
            <ul>
              <li>We use the Instagram Graph API to publish content on your behalf</li>
              <li>We store your Instagram Business Account ID, username, and access tokens</li>
              <li>We access your connected Facebook Page information</li>
              <li>Access tokens are valid for 60 days and are automatically refreshed</li>
              <li>You can revoke our access at any time through Instagram settings or our Settings page</li>
              <li>We only access the permissions you explicitly grant during the OAuth process</li>
            </ul>

            <h2>12. Snapchat Specific Information</h2>
            <p>
              When you connect your Snapchat account:
            </p>
            <ul>
              <li>We use the Snapchat Public Profile API to publish content on your behalf</li>
              <li>We store your Snapchat profile ID, display name, and access tokens</li>
              <li>You can revoke our access at any time through Snapchat settings or our Settings page</li>
              <li>We only access the permissions you explicitly grant during the OAuth process</li>
            </ul>

            <h2>13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@creatoros.com</li>
              <li><strong>Website:</strong> <Link href="/" className="link">creatoros.com</Link></li>
            </ul>

            <div className="divider"></div>

            <div className="alert alert-info mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-semibold">Questions?</p>
                <p>If you have any questions about how we handle your data, please don't hesitate to contact us.</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Link href="/terms" className="btn btn-outline">
                Terms of Service
              </Link>
              <Link href="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

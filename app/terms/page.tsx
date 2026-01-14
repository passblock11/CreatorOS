import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Creator OS',
  description: 'Terms of Service for Creator OS',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body prose max-w-none">
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-sm opacity-70 mb-6">
              Last Updated: January 14, 2026
            </p>

            <div className="divider"></div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to Creator OS. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Creator OS is a SaaS platform that enables content creators to manage and publish content to multiple social media platforms, including Snapchat and Instagram. Our service includes:
            </p>
            <ul>
              <li>Content creation and management tools</li>
              <li>Integration with Snapchat and Instagram</li>
              <li>Multi-platform publishing capabilities</li>
              <li>Post scheduling and management</li>
              <li>Analytics and usage tracking</li>
              <li>Subscription-based access to premium features</li>
            </ul>

            <h2>3. Eligibility</h2>
            <p>
              You must be at least 13 years old to use Creator OS. If you are under 18, you must have permission from a parent or guardian. By using our service, you represent and warrant that you meet these requirements.
            </p>

            <h2>4. Account Registration</h2>
            
            <h3>4.1 Account Creation</h3>
            <p>
              To use certain features of Creator OS, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3>4.2 Account Security</h3>
            <p>
              You are responsible for maintaining the security of your account credentials. Creator OS will not be liable for any loss or damage arising from your failure to protect your account information.
            </p>

            <h2>5. Social Media Integrations</h2>
            
            <h3>5.1 Third-Party Platforms</h3>
            <p>
              Creator OS integrates with third-party platforms (Snapchat, Instagram/Meta). By connecting these accounts:
            </p>
            <ul>
              <li>You authorize us to access and use your accounts according to the granted permissions</li>
              <li>You must comply with the terms of service of each connected platform</li>
              <li>You are responsible for maintaining active accounts on these platforms</li>
              <li>You acknowledge that we are not responsible for changes to third-party APIs or policies</li>
            </ul>

            <h3>5.2 Instagram Requirements</h3>
            <p>
              To use Instagram features, you must:
            </p>
            <ul>
              <li>Have an Instagram Business or Creator account (personal accounts are not supported)</li>
              <li>Have a Facebook Page connected to your Instagram account</li>
              <li>Comply with Instagram's Platform Policy and Terms of Use</li>
              <li>Grant necessary permissions during the OAuth process</li>
            </ul>

            <h3>5.3 Snapchat Requirements</h3>
            <p>
              To use Snapchat features, you must:
            </p>
            <ul>
              <li>Have an active Snapchat account</li>
              <li>Comply with Snapchat's Terms of Service and Community Guidelines</li>
              <li>Grant necessary permissions during the OAuth process</li>
            </ul>

            <h2>6. Subscription and Payment</h2>
            
            <h3>6.1 Subscription Plans</h3>
            <p>
              Creator OS offers multiple subscription tiers:
            </p>
            <ul>
              <li><strong>Free Plan:</strong> Limited features with usage restrictions</li>
              <li><strong>Pro Plan:</strong> Enhanced features and higher limits</li>
              <li><strong>Business Plan:</strong> Unlimited access to all features</li>
            </ul>

            <h3>6.2 Payment Processing</h3>
            <p>
              Payments are processed through Stripe. By subscribing to a paid plan, you agree to:
            </p>
            <ul>
              <li>Provide valid payment information</li>
              <li>Authorize recurring charges for your subscription</li>
              <li>Pay all fees associated with your subscription</li>
              <li>Comply with Stripe's Terms of Service</li>
            </ul>

            <h3>6.3 Billing and Renewal</h3>
            <ul>
              <li>Subscriptions are billed monthly or annually based on your selection</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>All fees are non-refundable except as required by law</li>
            </ul>

            <h3>6.4 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through the Settings page or Stripe Customer Portal. Cancellation will take effect at the end of the current billing period.
            </p>

            <h2>7. Usage Limits and Restrictions</h2>
            
            <h3>7.1 Plan Limits</h3>
            <p>
              Each subscription plan has specific usage limits:
            </p>
            <ul>
              <li>Free: 10 posts per month</li>
              <li>Pro: 100 posts per month</li>
              <li>Business: Unlimited posts</li>
            </ul>

            <h3>7.2 Acceptable Use</h3>
            <p>
              You agree NOT to use Creator OS to:
            </p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Post spam, malicious content, or misleading information</li>
              <li>Harass, abuse, or harm others</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Interfere with or disrupt our service or servers</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to access our service without permission</li>
              <li>Resell or redistribute our service without authorization</li>
              <li>Post content that violates platform policies of Snapchat or Instagram</li>
            </ul>

            <h2>8. Content and Intellectual Property</h2>
            
            <h3>8.1 Your Content</h3>
            <p>
              You retain all rights to the content you create and publish through Creator OS. By using our service, you grant us a limited license to:
            </p>
            <ul>
              <li>Store and process your content</li>
              <li>Publish your content to connected platforms on your behalf</li>
              <li>Display your content within our service for your use</li>
            </ul>

            <h3>8.2 Content Responsibility</h3>
            <p>
              You are solely responsible for your content. You warrant that:
            </p>
            <ul>
              <li>You own or have the rights to all content you publish</li>
              <li>Your content does not violate any laws or third-party rights</li>
              <li>Your content complies with platform policies</li>
            </ul>

            <h3>8.3 Our Intellectual Property</h3>
            <p>
              Creator OS, including its design, features, and code, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.
            </p>

            <h2>9. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our <Link href="/privacy" className="link">Privacy Policy</Link> to understand how we collect, use, and protect your information.
            </p>

            <h2>10. Disclaimers and Limitations</h2>
            
            <h3>10.1 Service Availability</h3>
            <p>
              We strive to provide reliable service but do not guarantee:
            </p>
            <ul>
              <li>Uninterrupted or error-free service</li>
              <li>Compatibility with third-party platforms at all times</li>
              <li>That our service will meet all your requirements</li>
              <li>That content will be successfully published to all platforms</li>
            </ul>

            <h3>10.2 Third-Party Services</h3>
            <p>
              We are not responsible for:
            </p>
            <ul>
              <li>Changes to third-party APIs (Snapchat, Instagram, Meta, Stripe)</li>
              <li>Service disruptions caused by third-party platforms</li>
              <li>Actions taken by third-party platforms (account suspensions, policy changes, etc.)</li>
              <li>Content of third-party websites linked from our service</li>
            </ul>

            <h3>10.3 Warranty Disclaimer</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CREATOR OS SHALL NOT BE LIABLE FOR:
            </p>
            <ul>
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, or goodwill</li>
              <li>Service interruptions or errors</li>
              <li>Actions or inactions of third-party platforms</li>
              <li>Unauthorized access to or alteration of your content</li>
            </ul>
            <p>
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS OR $100, WHICHEVER IS GREATER.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Creator OS, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Your use of our service</li>
              <li>Your content</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
            </ul>

            <h2>13. Termination</h2>
            
            <h3>13.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting us or through the Settings page.
            </p>

            <h3>13.2 Termination by Us</h3>
            <p>
              We may suspend or terminate your account if:
            </p>
            <ul>
              <li>You violate these Terms</li>
              <li>You engage in fraudulent activity</li>
              <li>Your account remains inactive for an extended period</li>
              <li>Required by law or court order</li>
              <li>We discontinue the service (with 30 days notice)</li>
            </ul>

            <h3>13.3 Effect of Termination</h3>
            <p>
              Upon termination:
            </p>
            <ul>
              <li>Your access to the service will be revoked</li>
              <li>Your content may be deleted after 30 days</li>
              <li>Outstanding fees remain due</li>
              <li>Certain provisions of these Terms will survive termination</li>
            </ul>

            <h2>14. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of material changes by:
            </p>
            <ul>
              <li>Posting the updated Terms on our website</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for significant changes)</li>
            </ul>
            <p>
              Your continued use of the service after changes constitutes acceptance of the new Terms.
            </p>

            <h2>15. Dispute Resolution</h2>
            
            <h3>15.1 Informal Resolution</h3>
            <p>
              If you have a dispute, please contact us first to attempt an informal resolution.
            </p>

            <h3>15.2 Arbitration</h3>
            <p>
              Any disputes not resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h3>15.3 Class Action Waiver</h3>
            <p>
              You agree to resolve disputes on an individual basis only, not as a class action or representative proceeding.
            </p>

            <h2>16. General Provisions</h2>
            
            <h3>16.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to conflict of law principles.
            </p>

            <h3>16.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>

            <h3>16.3 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Creator OS regarding the service.
            </p>

            <h3>16.4 Assignment</h3>
            <p>
              You may not assign these Terms without our consent. We may assign these Terms to any affiliate or in connection with a merger or sale.
            </p>

            <h3>16.5 No Waiver</h3>
            <p>
              Our failure to enforce any provision of these Terms does not constitute a waiver of that provision.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> legal@creatoros.com</li>
              <li><strong>Support:</strong> support@creatoros.com</li>
              <li><strong>Website:</strong> <Link href="/" className="link">creatoros.com</Link></li>
            </ul>

            <div className="divider"></div>

            <div className="alert alert-warning mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold">Important</p>
                <p>By using Creator OS, you agree to comply with these Terms of Service and all applicable laws and regulations.</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Link href="/privacy" className="btn btn-outline">
                Privacy Policy
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

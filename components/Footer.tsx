import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div className="grid grid-flow-col gap-4">
        <Link href="/privacy" className="link link-hover">
          Privacy Policy
        </Link>
        <Link href="/terms" className="link link-hover">
          Terms of Service
        </Link>
        <Link href="mailto:support@creatoros.com" className="link link-hover">
          Contact
        </Link>
        <Link href="/pricing" className="link link-hover">
          Pricing
        </Link>
      </div>
      
      <div className="grid grid-flow-col gap-4">
        <a 
          href="https://developers.facebook.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link link-hover text-sm opacity-70"
        >
          Meta for Developers
        </a>
        <a 
          href="https://developers.snap.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link link-hover text-sm opacity-70"
        >
          Snapchat Developers
        </a>
      </div>

      <div>
        <p className="font-semibold text-lg mb-2">Creator OS</p>
        <p className="opacity-70">Multi-platform content publishing for creators</p>
      </div>
      
      <div className="opacity-60">
        <p>© {currentYear} Creator OS. All rights reserved.</p>
      </div>
    </footer>
  );
}

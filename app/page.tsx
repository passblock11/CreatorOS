'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiZap, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi';
import { isAuthenticated } from '@/lib/auth';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <span className="text-2xl font-bold">
            <span className="text-primary">Creator</span>OS
          </span>
        </div>
        <div className="navbar-end gap-2">
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>

      <div className="hero min-h-[80vh]">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Manage Your Content,
              <br />
              <span className="text-primary">Amplify Your Reach</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-80">
              The all-in-one platform for creators to manage, schedule, and publish content to
              Snapchat and Instagram with powerful analytics.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="btn btn-primary btn-lg">
                Start Free Trial
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-lg">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Creator OS?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiZap className="text-5xl text-primary mb-4" />
              <h3 className="card-title">Multi-Platform</h3>
              <p>Publish to Snapchat and Instagram simultaneously with one click.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiTrendingUp className="text-5xl text-primary mb-4" />
              <h3 className="card-title">Advanced Analytics</h3>
              <p>Track your performance with detailed insights and metrics.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiShield className="text-5xl text-primary mb-4" />
              <h3 className="card-title">Secure & Reliable</h3>
              <p>Enterprise-grade security with 99.9% uptime guarantee.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiClock className="text-5xl text-primary mb-4" />
              <h3 className="card-title">Smart Scheduling</h3>
              <p>Schedule posts in advance and never miss the perfect timing.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

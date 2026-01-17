'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { stripeAPI, authAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { FiCheck } from 'react-icons/fi';

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const authenticated = isAuthenticated();

  useEffect(() => {
    fetchPlans();
    if (authenticated) {
      fetchUserPlan();
    }
  }, [authenticated]);

  const fetchPlans = async () => {
    try {
      const response = await stripeAPI.getPlans();
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const response = await authAPI.getMe();
      setCurrentPlan(response.data.user.subscription.plan || 'free');
    } catch (error) {
      console.error('Error fetching user plan:', error);
      setCurrentPlan('free');
    }
  };

  const getPlanTier = (planId: string): number => {
    const tiers: { [key: string]: number } = {
      free: 0,
      pro: 1,
      business: 2,
    };
    return tiers[planId] || 0;
  };

  const getButtonText = (planId: string): string => {
    if (!authenticated) {
      return planId === 'free' ? 'Get Started' : 'Subscribe';
    }

    if (currentPlan === planId) {
      return 'Current Plan';
    }

    const currentTier = getPlanTier(currentPlan);
    const targetTier = getPlanTier(planId);

    if (targetTier < currentTier) {
      return 'Downgrade';
    } else if (targetTier > currentTier) {
      return 'Upgrade';
    }

    return 'Subscribe';
  };

  const handleSubscribe = async (planId: string) => {
    if (!authenticated) {
      router.push('/register');
      return;
    }

    // If trying to downgrade, show confirmation
    const currentTier = getPlanTier(currentPlan);
    const targetTier = getPlanTier(planId);

    if (targetTier < currentTier) {
      const confirmDowngrade = window.confirm(
        `Are you sure you want to downgrade from ${currentPlan.toUpperCase()} to ${planId.toUpperCase()}?\n\n` +
        `You will lose access to premium features. To downgrade, please cancel your subscription in Settings.`
      );
      if (!confirmDowngrade) {
        return;
      }
      // Redirect to settings to manage subscription
      router.push('/settings');
      return;
    }

    if (planId === 'free') {
      return;
    }

    setSubscribing(planId);

    try {
      const response = await stripeAPI.createCheckout(planId);
      window.location.href = response.data.url;
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating checkout');
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {authenticated && <Navbar />}

      <div className="container mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-base-content">Choose Your Plan</h1>
          <p className="text-xl text-base-content/70">
            Select the perfect plan for your content creation needs
          </p>
          <p className="text-sm opacity-60 mt-2">
            All prices are in Indian Rupees (₹ INR)
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card bg-base-100 shadow-xl relative ${
                authenticated && currentPlan === plan.id
                  ? 'border-4 border-success'
                  : plan.id === 'pro'
                  ? 'border-2 border-primary'
                  : ''
              }`}
            >
              {authenticated && currentPlan === plan.id && (
                <div className="badge badge-success absolute left-4 top-4">Current Plan</div>
              )}
              {plan.id === 'pro' && (
                <div className="badge badge-primary absolute right-4 top-4">Most Popular</div>
              )}
              <div className="card-body">
                <h2 className="card-title text-2xl">{plan.name}</h2>
                <div className="my-4">
                  {plan.priceINR ? (
                    <>
                      <span className="text-5xl font-bold">₹{plan.priceINR.toLocaleString('en-IN')}</span>
                      <span className="text-base-content/70">/{plan.interval}</span>
                      <div className="text-sm opacity-60 mt-1">(≈ ${plan.price} USD)</div>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl font-bold">Free</span>
                      <span className="text-base-content/70">/{plan.interval}</span>
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <FiCheck className="text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${
                    authenticated && currentPlan === plan.id
                      ? 'btn-disabled'
                      : getPlanTier(plan.id) < getPlanTier(currentPlan)
                      ? 'btn-outline btn-warning'
                      : plan.id === 'pro'
                      ? 'btn-primary'
                      : 'btn-outline'
                  } ${subscribing === plan.id ? 'btn-disabled' : ''}`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id || (authenticated && currentPlan === plan.id)}
                >
                  {subscribing === plan.id ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    getButtonText(plan.id)
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Need a custom solution?</h3>
              <p>Contact us for enterprise pricing and custom features tailored to your needs.</p>
              <div className="card-actions justify-center">
                <button className="btn btn-outline">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

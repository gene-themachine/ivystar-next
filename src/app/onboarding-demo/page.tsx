'use client';

import OnboardingExample from '@/components/onboarding/OnboardingExample';

export default function OnboardingDemoPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Onboarding Demo</h1>
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-xl">
          <OnboardingExample />
        </div>
      </div>
    </div>
  );
} 
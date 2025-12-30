'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-white font-bold text-xl">AI Visibility</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition">
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-block mb-6">
            <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
              🚀 The Future of AI Analytics
            </span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Measure Your Brand's
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"> Visibility </span>
            Across AI Platforms
          </h1>

          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Probabilistic LLM Analytics Platform - Run Monte Carlo simulations to analyze
            brand visibility across OpenAI, Anthropic, and Perplexity with statistical significance.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition transform"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition border border-white/20"
            >
              Watch Demo
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100 free iterations</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 max-w-6xl mx-auto animate-slide-up">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-1 rounded-2xl border border-purple-500/30 shadow-2xl">
            <div className="bg-slate-900 rounded-xl p-8">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
                      <div>
                        <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-slate-700/50 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-slate-700/50 rounded"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                      <div className="h-8 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                    </div>
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                      <div className="h-8 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
                    </div>
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                      <div className="h-8 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Generative Risk Analytics
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎯',
              title: 'Probabilistic Analysis',
              description: 'Run N iterations of prompts to calculate statistical variance and measure brand visibility with confidence intervals.',
            },
            {
              icon: '📊',
              title: 'Multi-Provider Support',
              description: 'Test across OpenAI GPT-4, Anthropic Claude, and Perplexity Sonar for comprehensive brand analysis.',
            },
            {
              icon: '🔍',
              title: 'Statistical Metrics',
              description: 'Visibility Rate, Share of Voice, Consistency Scores, and Hallucination Detection with fuzzy matching.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-400 text-center mb-16">
          Start free, scale as you grow
        </p>
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              name: 'Free',
              price: '$0',
              iterations: '100',
              features: ['Basic analytics', '1 provider', '7-day retention'],
            },
            {
              name: 'Starter',
              price: '$49',
              iterations: '5,000',
              features: ['All providers', 'All metrics', '30-day retention', 'Email support'],
              popular: true,
            },
            {
              name: 'Pro',
              price: '$199',
              iterations: '50,000',
              features: ['Scheduled experiments', 'API access', '90-day retention', 'Priority support'],
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              iterations: 'Unlimited',
              features: ['White-label', 'SSO', 'Dedicated support', 'Custom SLA'],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-2 border-purple-500 scale-105'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-gray-400">/mo</span>}
              </div>
              <div className="text-gray-300 mb-6">
                <span className="font-semibold">{plan.iterations}</span> iterations/month
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center text-gray-300 text-sm">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center py-3 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 AI Visibility. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/docs" className="hover:text-white transition">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

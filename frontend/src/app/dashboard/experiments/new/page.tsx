'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI (ChatGPT)', icon: '🤖' },
  { id: 'anthropic', name: 'Anthropic (Claude)', icon: '🧠' },
  { id: 'perplexity', name: 'Perplexity', icon: '🔍' },
];

export default function NewExperimentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    query: '',
    providers: ['openai', 'anthropic', 'perplexity'],
    num_iterations: 100,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create experiment');
      }

      const experiment = await res.json();
      router.push(`/dashboard/experiments/${experiment.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleProvider = (providerId: string) => {
    setFormData(prev => ({
      ...prev,
      providers: prev.providers.includes(providerId)
        ? prev.providers.filter(p => p !== providerId)
        : [...prev.providers, providerId],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Experiment</h1>
        <p className="text-gray-600 mt-1">Set up a new AI visibility measurement experiment</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
        {/* Query Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Search Query *
          </label>
          <input
            type="text"
            required
            value={formData.query}
            onChange={(e) => setFormData({ ...formData, query: e.target.value })}
            placeholder="e.g., What are the best project management tools?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-1">
            The question you want to ask AI platforms to measure brand visibility
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add notes about this experiment..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Providers */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            AI Providers *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => toggleProvider(provider.id)}
                className={`p-4 border-2 rounded-lg transition text-left ${
                  formData.providers.includes(provider.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{provider.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{provider.name}</div>
                  </div>
                  {formData.providers.includes(provider.id) && (
                    <span className="text-purple-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Select at least one provider to query
          </p>
        </div>

        {/* Number of Iterations */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Number of Iterations
          </label>
          <input
            type="number"
            min="10"
            max="1000"
            step="10"
            value={formData.num_iterations}
            onChange={(e) => setFormData({ ...formData, num_iterations: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-1">
            Higher iterations provide more statistical confidence (10-1000 recommended)
          </p>
        </div>

        {/* Cost Estimate */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-1">Estimated Cost</h4>
          <p className="text-sm text-gray-600">
            ~${((formData.num_iterations * formData.providers.length * 0.002)).toFixed(2)} USD
            ({formData.num_iterations} iterations × {formData.providers.length} providers)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Actual cost may vary based on response length
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || formData.providers.length === 0}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Experiment'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span>1️⃣</span>
            <span>Your query is sent to selected AI platforms multiple times</span>
          </li>
          <li className="flex gap-2">
            <span>2️⃣</span>
            <span>We analyze responses using Monte Carlo simulation for statistical significance</span>
          </li>
          <li className="flex gap-2">
            <span>3️⃣</span>
            <span>Results show brand visibility percentages with confidence intervals</span>
          </li>
          <li className="flex gap-2">
            <span>4️⃣</span>
            <span>Track changes over time to measure your AI SEO performance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

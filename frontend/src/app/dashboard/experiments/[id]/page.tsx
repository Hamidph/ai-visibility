'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ExperimentDetail {
  id: string;
  query: string;
  providers: string[];
  num_iterations: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  total_iterations: number;
  description?: string;
}

interface BrandResult {
  brand_name: string;
  visibility_percentage: number;
  mention_count: number;
  confidence_interval: [number, number];
}

interface ProviderResult {
  provider: string;
  top_brands: BrandResult[];
  total_iterations: number;
}

export default function ExperimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [experiment, setExperiment] = useState<ExperimentDetail | null>(null);
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('results');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch experiment details
        const expRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments/${params.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const expData = await expRes.json();
        setExperiment(expData);

        // Fetch results if completed
        if (expData.status === 'completed') {
          const reportRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments/${params.id}/report`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          const reportData = await reportRes.json();
          setResults(reportData.provider_results || []);
        }
      } catch (error) {
        console.error('Failed to fetch experiment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();

      // Poll for updates if running
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Experiment not found</h2>
      </div>
    );
  }

  const statusConfig = {
    completed: { color: 'green', icon: '✓', text: 'Completed' },
    running: { color: 'blue', icon: '⟳', text: 'Running' },
    failed: { color: 'red', icon: '✗', text: 'Failed' },
    pending: { color: 'gray', icon: '○', text: 'Pending' },
  };

  const config = statusConfig[experiment.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push('/dashboard/experiments')}
          className="text-purple-600 hover:text-purple-700 font-medium mb-4 flex items-center gap-1"
        >
          ← Back to experiments
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{experiment.query}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                config.color === 'green' ? 'bg-green-100 text-green-700' :
                config.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                config.color === 'red' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                <span className={config.color === 'blue' ? 'animate-spin' : ''}>{config.icon}</span>
                {config.text}
              </span>
              <span className="text-sm text-gray-600">
                Created {new Date(experiment.created_at).toLocaleDateString()}
              </span>
              {experiment.completed_at && (
                <span className="text-sm text-gray-600">
                  • Completed {new Date(experiment.completed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {['results', 'details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {experiment.status === 'running' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <h3 className="font-semibold text-blue-900 mb-1">Experiment Running</h3>
              <p className="text-sm text-blue-700">
                Processing {experiment.total_iterations} of {experiment.num_iterations} iterations...
              </p>
            </div>
          )}

          {experiment.status === 'completed' && results.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results available</h3>
              <p className="text-gray-600">The experiment completed but no brand mentions were found</p>
            </div>
          )}

          {results.map((providerResult) => (
            <div key={providerResult.provider} className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="capitalize">{providerResult.provider}</span>
                <span className="text-sm font-normal text-gray-600">
                  ({providerResult.total_iterations} iterations)
                </span>
              </h2>

              {providerResult.top_brands.length === 0 ? (
                <p className="text-gray-600">No brands mentioned</p>
              ) : (
                <div className="space-y-3">
                  {providerResult.top_brands.map((brand, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{brand.brand_name}</span>
                          <span className="text-sm text-gray-600">
                            {brand.mention_count} mentions
                          </span>
                        </div>
                        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end px-3"
                            style={{ width: `${brand.visibility_percentage}%` }}
                          >
                            <span className="text-white font-semibold text-sm">
                              {brand.visibility_percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        {brand.confidence_interval && (
                          <p className="text-xs text-gray-500 mt-1">
                            95% CI: [{brand.confidence_interval[0].toFixed(1)}%, {brand.confidence_interval[1].toFixed(1)}%]
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <DetailRow label="Query" value={experiment.query} />
          <DetailRow label="Status" value={experiment.status} />
          <DetailRow label="Providers" value={experiment.providers.join(', ')} />
          <DetailRow label="Total Iterations" value={experiment.total_iterations.toString()} />
          <DetailRow label="Target Iterations" value={experiment.num_iterations.toString()} />
          <DetailRow label="Created" value={new Date(experiment.created_at).toLocaleString()} />
          {experiment.completed_at && (
            <DetailRow label="Completed" value={new Date(experiment.completed_at).toLocaleString()} />
          )}
          {experiment.description && (
            <DetailRow label="Description" value={experiment.description} />
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="w-40 font-semibold text-gray-700">{label}</span>
      <span className="flex-1 text-gray-900">{value}</span>
    </div>
  );
}

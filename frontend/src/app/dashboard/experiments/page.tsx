'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Experiment {
  id: string;
  query: string;
  providers: string[];
  num_iterations: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  total_iterations: number;
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'running' | 'failed'>('all');

  useEffect(() => {
    const fetchExperiments = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setExperiments(data);
      } catch (error) {
        console.error('Failed to fetch experiments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const filteredExperiments = experiments.filter(exp => {
    if (filter === 'all') return true;
    return exp.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
          <p className="text-gray-600 mt-1">Track and analyze your AI visibility experiments</p>
        </div>
        <Link
          href="/dashboard/experiments/new"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
        >
          <span>+</span>
          <span>New Experiment</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'completed', 'running', 'failed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-sm opacity-75">
                ({experiments.filter(e => e.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Experiments Grid */}
      {filteredExperiments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No experiments yet' : `No ${filter} experiments`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Create your first experiment to start measuring AI visibility'
              : `You don't have any ${filter} experiments yet`}
          </p>
          <Link
            href="/dashboard/experiments/new"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Create Experiment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredExperiments.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const statusConfig = {
    completed: { color: 'green', icon: '✓', text: 'Completed' },
    running: { color: 'blue', icon: '⟳', text: 'Running' },
    failed: { color: 'red', icon: '✗', text: 'Failed' },
    pending: { color: 'gray', icon: '○', text: 'Pending' },
  };

  const config = statusConfig[experiment.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Link
      href={`/dashboard/experiments/${experiment.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              config.color === 'green' ? 'bg-green-100 text-green-700' :
              config.color === 'blue' ? 'bg-blue-100 text-blue-700' :
              config.color === 'red' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              <span className={config.color === 'blue' ? 'animate-spin' : ''}>{config.icon}</span>
              {config.text}
            </span>
            {experiment.providers && (
              <div className="flex gap-1">
                {experiment.providers.map((provider) => (
                  <span
                    key={provider}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium"
                  >
                    {provider}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Query */}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition mb-2">
            {experiment.query}
          </h3>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span>🔄</span>
              <span>{experiment.total_iterations || experiment.num_iterations} iterations</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>Created {new Date(experiment.created_at).toLocaleDateString()}</span>
            </span>
            {experiment.completed_at && (
              <span className="flex items-center gap-1">
                <span>✓</span>
                <span>Completed {new Date(experiment.completed_at).toLocaleDateString()}</span>
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="text-purple-600 text-xl opacity-0 group-hover:opacity-100 transition">
          →
        </div>
      </div>
    </Link>
  );
}

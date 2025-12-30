'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  total_experiments: number;
  total_iterations: number;
  this_month_iterations: number;
  quota_remaining: number;
}

interface RecentExperiment {
  id: string;
  query: string;
  status: string;
  created_at: string;
  total_iterations: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentExperiments, setRecentExperiments] = useState<RecentExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // Fetch experiments
        const expRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/experiments?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const experiments = await expRes.json();
        setRecentExperiments(experiments);

        // Calculate stats
        const totalIterations = experiments.reduce((sum: number, exp: any) =>
          sum + (exp.total_iterations || 0), 0
        );

        setStats({
          total_experiments: experiments.length,
          total_iterations: totalIterations,
          this_month_iterations: totalIterations, // Could be filtered by date
          quota_remaining: userData.monthly_iteration_quota - totalIterations,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.full_name || user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Experiments"
          value={stats?.total_experiments || 0}
          icon="🧪"
          color="purple"
        />
        <StatCard
          title="Total Iterations"
          value={stats?.total_iterations || 0}
          icon="🔄"
          color="blue"
        />
        <StatCard
          title="This Month"
          value={stats?.this_month_iterations || 0}
          icon="📅"
          color="green"
        />
        <StatCard
          title="Quota Remaining"
          value={stats?.quota_remaining || 0}
          icon="📊"
          color="pink"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to measure visibility?</h2>
            <p className="text-purple-100">Create a new experiment to start tracking your brand across AI platforms</p>
          </div>
          <Link
            href="/dashboard/experiments/new"
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition whitespace-nowrap"
          >
            + New Experiment
          </Link>
        </div>
      </div>

      {/* Recent Experiments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Experiments</h2>
          <Link href="/dashboard/experiments" className="text-purple-600 hover:text-purple-700 font-medium">
            View all →
          </Link>
        </div>

        {recentExperiments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiments yet</h3>
            <p className="text-gray-600 mb-6">Create your first experiment to start measuring AI visibility</p>
            <Link
              href="/dashboard/experiments/new"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Create Experiment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentExperiments.map((exp) => (
              <Link
                key={exp.id}
                href={`/dashboard/experiments/${exp.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition">
                      {exp.query}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          exp.status === 'completed' ? 'bg-green-500' :
                          exp.status === 'running' ? 'bg-blue-500 animate-pulse' :
                          exp.status === 'failed' ? 'bg-red-500' :
                          'bg-gray-400'
                        }`}></span>
                        {exp.status}
                      </span>
                      <span>🔄 {exp.total_iterations || 0} iterations</span>
                      <span>📅 {new Date(exp.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Banner (if on free tier) */}
      {user?.pricing_tier === 'FREE' && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Upgrade for more experiments</h3>
              <p className="text-gray-600">Get unlimited iterations, priority support, and advanced analytics</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition whitespace-nowrap"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-white font-bold text-xl`}>
          {value > 999 ? '999+' : value}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
    </div>
  );
}

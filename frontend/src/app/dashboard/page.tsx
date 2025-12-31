"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { experimentsApi, billingApi } from "@/lib/api";
import { useState } from "react";

// Mock data for visualization
const mockTrendData = [35, 42, 38, 55, 48, 62, 58, 72, 68, 75, 72, 78];
const mockCompetitors = [
  { name: "Your Brand", visibility: 72, sentiment: 94, position: 2, color: "cyan" },
  { name: "Competitor A", visibility: 65, sentiment: 78, position: 3, color: "gray" },
  { name: "Competitor B", visibility: 58, sentiment: 82, position: 4, color: "gray" },
  { name: "Competitor C", visibility: 45, sentiment: 71, position: 6, color: "gray" },
];

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeMetric, setActiveMetric] = useState<"visibility" | "sentiment" | "position">("visibility");

  const { data: experiments, isLoading: experimentsLoading } = useQuery({
    queryKey: ["experiments"],
    queryFn: () => experimentsApi.list(5, 0),
    enabled: !!user,
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: billingApi.getUsage,
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
              {getGreeting()}, {user?.full_name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-gray-500">
              Your brand visibility is trending up <span className="text-emerald-400">+12.4%</span> this month
            </p>
          </div>
          <Link
            href="/experiments/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg hover:scale-105 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </Link>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Visibility */}
          <button
            onClick={() => setActiveMetric("visibility")}
            className={`relative bg-[#0a0f1a] border rounded-xl p-6 text-left transition-all ${
              activeMetric === "visibility" ? "border-cyan-500/50 bg-cyan-500/5" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Visibility</p>
            <p className="text-3xl font-bold text-white">72%</p>
          </button>

          {/* Sentiment */}
          <button
            onClick={() => setActiveMetric("sentiment")}
            className={`relative bg-[#0a0f1a] border rounded-xl p-6 text-left transition-all ${
              activeMetric === "sentiment" ? "border-violet-500/50 bg-violet-500/5" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+5%</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Sentiment</p>
            <p className="text-3xl font-bold text-white">94</p>
          </button>

          {/* Position */}
          <button
            onClick={() => setActiveMetric("position")}
            className={`relative bg-[#0a0f1a] border rounded-xl p-6 text-left transition-all ${
              activeMetric === "position" ? "border-fuchsia-500/50 bg-fuchsia-500/5" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">↑2</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Position</p>
            <p className="text-3xl font-bold text-white">#2</p>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Chart & Competitors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trend Chart */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Visibility Trend</h3>
                  <p className="text-sm text-gray-500">Last 12 months</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">7D</button>
                  <button className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">30D</button>
                  <button className="text-xs text-white bg-white/10 px-3 py-1.5 rounded-lg">12M</button>
                </div>
              </div>
              
              {/* Simple bar chart visualization */}
              <div className="flex items-end gap-2 h-40">
                {mockTrendData.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500/50 to-cyan-500 rounded-t-sm transition-all hover:from-cyan-400/50 hover:to-cyan-400"
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-[10px] text-gray-600">
                      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Competitor Comparison</h3>
                  <p className="text-sm text-gray-500">All AI Models</p>
                </div>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Add competitor
                </button>
              </div>
              
              <div className="space-y-4">
                {mockCompetitors.map((comp, i) => (
                  <div key={comp.name} className="flex items-center gap-4">
                    <div className="w-32 truncate">
                      <span className={`text-sm ${i === 0 ? "text-white font-medium" : "text-gray-400"}`}>
                        {comp.name}
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          i === 0 ? "bg-gradient-to-r from-cyan-500 to-violet-500" : "bg-white/20"
                        }`}
                        style={{ width: `${comp.visibility}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={i === 0 ? "text-cyan-400 font-medium" : "text-gray-500"}>
                        {comp.visibility}%
                      </span>
                      <span className="text-gray-600 w-8">#{comp.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Usage</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Analyses Run</span>
                  <span className="text-white font-medium">
                    {experimentsLoading ? "..." : experiments?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Iterations Used</span>
                  <span className="text-white font-medium">
                    {usageLoading ? "..." : usage?.iterations_used || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Remaining</span>
                  <span className="text-emerald-400 font-medium">
                    {usageLoading ? "..." : usage?.remaining || 0}
                  </span>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Plan</span>
                    <span className="text-white font-medium capitalize">
                      {usageLoading ? "..." : usage?.pricing_tier || "Free"}
                    </span>
                  </div>
                  <Link 
                    href="/billing" 
                    className="block w-full text-center text-sm text-cyan-400 hover:text-cyan-300 py-2 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/5 transition-all"
                  >
                    Upgrade Plan
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/experiments/new"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">New Analysis</p>
                    <p className="text-xs text-gray-500">Run visibility check</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/experiments"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">View History</p>
                    <p className="text-xs text-gray-500">Browse all analyses</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent</h3>
                <Link href="/experiments" className="text-xs text-cyan-400 hover:text-cyan-300">
                  View all
                </Link>
              </div>
              
              {experimentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
              ) : experiments?.experiments?.length > 0 ? (
                <div className="space-y-3">
                  {experiments.experiments.slice(0, 3).map((exp: {
                    experiment_id: string;
                    prompt: string;
                    target_brand: string;
                    status: string;
                    created_at: string;
                  }) => (
                    <Link
                      key={exp.experiment_id}
                      href={`/experiments/${exp.experiment_id}`}
                      className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-sm text-white truncate mb-1">{exp.prompt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{exp.target_brand}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          exp.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                          exp.status === "running" ? "bg-cyan-500/10 text-cyan-400" :
                          exp.status === "failed" ? "bg-rose-500/10 text-rose-400" :
                          "bg-amber-500/10 text-amber-400"
                        }`}>
                          {exp.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">No analyses yet</p>
                  <Link
                    href="/experiments/new"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    Create your first →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

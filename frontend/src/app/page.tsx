"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Mock dashboard data for hero preview
const mockCompetitors = [
  { name: "Your Brand", visibility: 72, sentiment: 94, position: 2, trend: "+12%" },
  { name: "Competitor A", visibility: 65, sentiment: 78, position: 3, trend: "+5%" },
  { name: "Competitor B", visibility: 58, sentiment: 82, position: 4, trend: "-3%" },
  { name: "Competitor C", visibility: 45, sentiment: 71, position: 6, trend: "+2%" },
];

const mockPrompts = [
  { prompt: "Best CRM for startups", visibility: 78, mentions: 8 },
  { prompt: "Top project management tools", visibility: 65, mentions: 6 },
  { prompt: "Enterprise software solutions", visibility: 52, mentions: 4 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"visibility" | "sentiment" | "position">("visibility");

  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-gray-300">Trusted by 1,500+ marketing teams</span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up tracking-tight">
              <span className="text-white">AI search analytics</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">for marketing teams</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Track, analyze, and improve your brand performance on AI search platforms through key metrics like <span className="text-cyan-400 font-medium">Visibility</span>, <span className="text-violet-400 font-medium">Position</span>, and <span className="text-fuchsia-400 font-medium">Sentiment</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/register" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.4)]">
                <span className="relative z-10">Start Free Trial</span>
              </Link>
              <Link href="#demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                Talk to Sales
              </Link>
            </div>
          </div>

          {/* Dashboard Preview - Hero Visual */}
          <div className="relative max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {/* Glow effect behind dashboard */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl" />
            
            {/* Dashboard container */}
            <div className="relative bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Dashboard header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>brandwise.app/dashboard</span>
                </div>
                <div className="w-20" />
              </div>

              {/* Dashboard content */}
              <div className="p-6">
                {/* Top metrics row */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Your Brand&apos;s Performance</h3>
                    <p className="text-sm text-gray-500">Visibility trending up by <span className="text-emerald-400">+12.4%</span> this month</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Last 30 days</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Metric tabs */}
                <div className="flex gap-2 mb-6">
                  {[
                    { id: "visibility", label: "Visibility", value: "72%", color: "cyan" },
                    { id: "sentiment", label: "Sentiment", value: "94", color: "violet" },
                    { id: "position", label: "Position", value: "#2", color: "fuchsia" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 p-4 rounded-xl border transition-all ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-500/10 border-${tab.color}-500/30`
                          : "bg-white/5 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">{tab.label}</p>
                      <p className={`text-2xl font-bold ${
                        activeTab === tab.id ? `text-${tab.color}-400` : "text-white"
                      }`}>{tab.value}</p>
                    </button>
                  ))}
                </div>

                {/* Competitor comparison */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Chart area */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-white">Competitor Comparison</h4>
                      <span className="text-xs text-gray-500">All AI Models</span>
                    </div>
                    <div className="space-y-3">
                      {mockCompetitors.map((comp, i) => (
                        <div key={comp.name} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-24 truncate">{comp.name}</span>
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                i === 0 ? "bg-gradient-to-r from-cyan-500 to-violet-500" : "bg-white/20"
                              }`}
                              style={{ width: `${comp.visibility}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${i === 0 ? "text-cyan-400" : "text-gray-400"}`}>
                            {comp.visibility}%
                          </span>
                          <span className={`text-xs ${comp.trend.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                            {comp.trend}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prompts tracking */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-white">Top Prompts</h4>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300">View all</button>
                    </div>
                    <div className="space-y-3">
                      {mockPrompts.map((prompt) => (
                        <div key={prompt.prompt} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{prompt.prompt}</p>
                            <p className="text-xs text-gray-500">{prompt.mentions} mentions</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                                style={{ width: `${prompt.visibility}%` }}
                              />
                            </div>
                            <span className="text-xs text-cyan-400 font-medium">{prompt.visibility}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8">Trusted by 1,500+ marketing teams worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {["Attio", "Notion", "Linear", "Vercel", "Stripe", "Figma"].map((brand) => (
              <span key={brand} className="text-xl font-semibold text-gray-400">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Understand how AI </span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">sees your brand</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We&apos;ve set up tracking for the most important metrics within AI search.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Visibility */}
            <div className="group relative bg-[#0a0f1a] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Visibility</h3>
                <p className="text-gray-400 leading-relaxed">
                  See the share of chats where your brand is mentioned and understand how often you show up in conversations.
                </p>
              </div>
            </div>

            {/* Position */}
            <div className="group relative bg-[#0a0f1a] border border-white/10 rounded-2xl p-8 hover:border-violet-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Position</h3>
                <p className="text-gray-400 leading-relaxed">
                  Understand your brand&apos;s position within AI search results and uncover opportunities to improve your ranking.
                </p>
              </div>
            </div>

            {/* Sentiment */}
            <div className="group relative bg-[#0a0f1a] border border-white/10 rounded-2xl p-8 hover:border-fuchsia-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Sentiment</h3>
                <p className="text-gray-400 leading-relaxed">
                  Find out how your brand is perceived by AI, what&apos;s going well, and what requires improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Turn AI search insights </span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">into customers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Identify the prompts that matter, monitor your rankings, and act before your competitors do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Set up Prompts",
                description: "Prompts are the foundation of your AI search strategy. Uncover and organize the prompts that matter most.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Use Data to Pick Winners",
                description: "Leverage AI-suggested prompts and search volumes to focus on the biggest opportunities.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Add Competitors",
                description: "See how you rank against the players that matter in your market.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Choose AI Models",
                description: "Track rankings across the models that drive the most traffic and visibility.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                ),
                title: "Find Key Sources",
                description: "Spot the citations shaping your visibility and refine your GEO strategy.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Act on Insights",
                description: "Use recommendations to capture high-impact opportunities and boost your ranking.",
              },
            ].map((feature, i) => (
              <div key={feature.title} className="bg-[#0a0f1a] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 text-cyan-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter end={50} suffix="K+" />
              </div>
              <div className="text-gray-500">Prompts Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter end={1500} suffix="+" />
              </div>
              <div className="text-gray-500">Marketing Teams</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter end={5} suffix="" />
              </div>
              <div className="text-gray-500">AI Models</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter end={99} suffix="%" />
              </div>
              <div className="text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
              What marketers say
            </h2>
            <p className="text-xl text-gray-400">
              See how teams are using Brandwise to improve their AI visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Brandwise offers key insights on AI visibility, helping brands stay at the forefront of discovery in the age of AI and generative search.",
                author: "Sarah Chen",
                role: "Head of SEO",
                company: "TechCorp",
              },
              {
                quote: "With Brandwise insights, our blog posts started ranking for targeted ChatGPT and Perplexity prompts within 24 hours. Impressive results.",
                author: "Michael Park",
                role: "Marketing Director",
                company: "StartupXYZ",
              },
              {
                quote: "The platform helps us identify what's being cited, adjust our strategy in real-time, and stay ahead of a rapidly evolving search landscape.",
                author: "Emma Wilson",
                role: "SEO Manager",
                company: "Enterprise Inc",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0a0f1a] to-[#0f172a] border border-white/10 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
                Find out what AI says about your brand
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                Start your free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl hover:scale-105 transition-all hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.4)]">
                  Start Free Trial
                </Link>
                <Link href="#demo" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BW</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Brandwise</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Docs</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 Brandwise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

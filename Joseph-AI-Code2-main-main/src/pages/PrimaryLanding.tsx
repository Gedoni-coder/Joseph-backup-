import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowRight,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Globe,
  Shield,
  DollarSign,
  Truck,
  TrendingDown,
  Lock,
  Check,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function PrimaryLanding() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEmailSignup = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsLoading(true);
    setTimeout(() => {
      if (email) {
        localStorage.setItem("joseph:signupEmail", email);
      }
      navigate("/signup");
    }, 300);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
      alert("Thank you! We'll get back to you within 1 business day.");
    }, 500);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a1449] via-[#1a2555] to-[#0a1449]"
    >
      {/* Animated Liquidmetal Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1449] via-[#1a2555] to-[#0a1449]" />

        {/* Animated liquid metal blobs - responsive sizes */}
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#4d7fd9] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 sm:w-96 sm:h-96 bg-[#3d6dc4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-44 h-44 sm:w-96 sm:h-96 bg-[#2d5db9] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" />

        {/* Glowing Bubble Animations - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-1/4 left-10 w-16 h-16 bg-[#4d7fd9]/40 rounded-full border-2 border-[#4d7fd9]/80 opacity-80 animate-bubble-float shadow-lg shadow-[#4d7fd9]/50 backdrop-blur-sm" />
        <div className="hidden sm:block absolute top-1/3 right-20 w-12 h-12 bg-[#3d6dc4]/40 rounded-full border-2 border-[#3d6dc4]/80 opacity-75 animate-bubble-float-delayed-1 shadow-lg shadow-[#3d6dc4]/50 backdrop-blur-sm" />
        <div className="hidden md:block absolute bottom-1/3 left-1/4 w-20 h-20 bg-[#4d7fd9]/35 rounded-full border-2 border-[#4d7fd9]/70 opacity-70 animate-bubble-float-delayed-2 shadow-lg shadow-[#4d7fd9]/40 backdrop-blur-sm" />
        <div className="hidden md:block absolute top-2/3 right-1/3 w-14 h-14 bg-[#2d5db9]/40 rounded-full border-2 border-[#2d5db9]/80 opacity-75 animate-bubble-float-delayed-3 shadow-lg shadow-[#2d5db9]/50 backdrop-blur-sm" />
        <div className="hidden lg:block absolute bottom-1/4 right-10 w-24 h-24 bg-[#3d6dc4]/30 rounded-full border-2 border-[#3d6dc4]/60 opacity-60 animate-bubble-float-delayed-4 shadow-lg shadow-[#3d6dc4]/40 backdrop-blur-sm" />
        <div className="hidden lg:block absolute top-1/2 left-1/3 w-10 h-10 bg-[#4d7fd9]/40 rounded-full border-2 border-[#4d7fd9]/80 opacity-80 animate-bubble-float-delayed-5 shadow-lg shadow-[#4d7fd9]/50 backdrop-blur-sm" />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1449] via-transparent to-transparent" />

        {/* Radial light effect following mouse */}
        <div
          className="absolute pointer-events-none w-96 h-96 bg-gradient-radial from-[#4d7fd9]/15 to-transparent rounded-full blur-3xl transition-all duration-100"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-40 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-6 backdrop-blur-sm border-b border-[#4d7fd9]/10">
        <div className="text-lg sm:text-2xl font-bold text-white truncate">
          Joseph AI
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-300 hover:text-[#4d7fd9] transition-colors font-medium text-sm"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-gray-300 hover:text-[#4d7fd9] transition-colors font-medium text-sm"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-300 hover:text-[#4d7fd9] transition-colors font-medium text-sm"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-300 hover:text-[#4d7fd9] transition-colors font-medium text-sm"
          >
            Contact
          </button>
        </div>

        <Button
          className="bg-transparent border border-[#4d7fd9]/30 text-[#4d7fd9] hover:bg-[#4d7fd9]/10 hover:border-[#4d7fd9]/60 transition-all duration-300 text-xs sm:text-sm px-3 sm:px-6 h-9 sm:h-10"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20 lg:py-32">
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Main Tagline */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
              <span className="font-bold">Plan.</span>
              <span className="italic text-[#4d7fd9] ml-2 sm:ml-3">
                Decide.
              </span>
              <span className="font-bold text-white ml-2 sm:ml-3">Grow.</span>
            </h1>

            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 max-w-5xl mx-auto">
              <div className="flex-1">
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                  Agentic Economic Intelligence System built to guide
                  businesses, policymakers, and enterprises toward smarter
                  financial, market, and operational decisions. From micro to
                  macro, Joseph helps you grow sustainably — and drive real
                  economic growth.
                </p>
              </div>

              {/* Floating Metrics Cards */}
              <div className="hidden sm:flex gap-4 lg:gap-6 flex-shrink-0 lg:ml-4">
                {/* Card 1 */}
                <div
                  className="relative animate-float-card"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4d7fd9] to-[#3d6dc4] rounded-2xl blur-lg opacity-30 animate-pulse" />
                  <div className="relative w-28 sm:w-32 h-36 sm:h-40 px-3 sm:px-4 py-5 sm:py-6 rounded-2xl bg-gradient-to-br from-[#4d7fd9]/25 to-[#3d6dc4]/15 border border-[#4d7fd9]/50 backdrop-blur-md flex flex-col items-center justify-center text-center">
                    <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                      Top 10 in competitive market
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  className="relative animate-float-card"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4d7fd9] to-[#3d6dc4] rounded-2xl blur-lg opacity-30 animate-pulse" />
                  <div className="relative w-28 sm:w-32 h-36 sm:h-40 px-3 sm:px-4 py-5 sm:py-6 rounded-2xl bg-gradient-to-br from-[#4d7fd9]/25 to-[#3d6dc4]/15 border border-[#4d7fd9]/50 backdrop-blur-md flex flex-col items-center justify-center text-center">
                    <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                      +100% Revenue growth
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Signup with Pricing Button */}
          <div className="space-y-3">
            <p className="text-center text-xs sm:text-sm text-gray-400 font-medium px-2">
              Enter your email in the email box
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto px-2">
              <form onSubmit={handleEmailSignup} className="w-full sm:flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4d7fd9]/40 via-[#3d6dc4]/20 to-[#4d7fd9]/40 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center bg-[#0a1449]/80 border border-[#4d7fd9]/20 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3.5 backdrop-blur-md hover:border-[#4d7fd9]/50 hover:bg-[#0a1449]/90 transition-all duration-300 shadow-lg hover:shadow-lg hover:shadow-[#4d7fd9]/10">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-0 text-white placeholder:text-gray-500/70 focus:outline-none text-xs sm:text-base w-full"
                      required
                    />
                  </div>
                </div>
              </form>

              <Button
                className="bg-transparent border border-[#4d7fd9]/30 text-white hover:bg-[#4d7fd9]/10 hover:border-[#4d7fd9]/60 rounded-lg px-4 sm:px-6 h-10 sm:h-12 font-semibold w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap transition-all duration-300"
                onClick={() => scrollToSection("pricing")}
              >
                View Pricing
              </Button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="px-2">
            <Button
              onClick={() => handleEmailSignup()}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#4d7fd9] to-[#3d6dc4] hover:from-[#5d8fe9] hover:to-[#4d7dd4] text-white rounded-lg px-6 sm:px-8 h-10 sm:h-12 font-semibold inline-flex items-center gap-2 text-sm sm:text-lg"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Get Started</span>{" "}
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 hidden sm:inline" />
                </>
              )}
            </Button>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
              14-day free trial • No credit card required
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20"
      >
        <div className="space-y-12 sm:space-y-16">
          {/* Intro */}
          <div className="text-center space-y-4">
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Joseph AI connects data, insight, and action to help businesses
              grow smarter. Powered by Agentic AI.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <DollarSign className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Real-time Financial Insights",
                description:
                  "Analyze finance in real time with AI-powered analytics.",
              },
              {
                icon: <Target className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Smart Pricing Optimization",
                description:
                  "Optimize revenue and pricing strategies intelligently.",
              },
              {
                icon: <TrendingDown className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Loan & Funding Advisory",
                description:
                  "Access tools to help secure funding and manage loans.",
              },
              {
                icon: <Truck className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Predictive Supply Chain",
                description:
                  "AI-driven supply chain forecasting and optimization.",
              },
              {
                icon: <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Policy & Market Forecasting",
                description:
                  "Predict market and policy trends with intelligence.",
              },
              {
                icon: <Lock className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Secure Data Management",
                description:
                  "Enterprise-grade security with continuous updates.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#4d7fd9]/15 to-[#3d6dc4]/10 border border-[#4d7fd9]/20 hover:border-[#4d7fd9]/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#4d7fd9]/20"
              >
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-lg bg-gradient-to-br from-[#4d7fd9] to-[#3d6dc4] flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:shadow-lg group-hover:shadow-[#4d7fd9]/50 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div
        id="pricing"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20"
      >
        <div className="space-y-10 sm:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Plans and Pricing
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Choose the perfect plan for your needs. From individual creators
              to enterprise teams, we have flexible pricing options to help you
              succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* FREE Plan */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#4d7fd9]/10 to-[#3d6dc4]/5 border border-[#4d7fd9]/20 hover:border-[#4d7fd9]/50 backdrop-blur-sm transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                FREE
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
                Get Started
              </p>
              <div className="mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  $0
                </span>
                <span className="text-gray-400 text-xs sm:text-sm ml-2">
                  /month
                </span>
              </div>
              <Button className="w-full bg-[#4d7fd9]/20 border border-[#4d7fd9]/50 text-white hover:bg-[#4d7fd9]/30 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm h-9 sm:h-10">
                Get Started
              </Button>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    $5 monthly AI credits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Access basic economic insights
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Smart market recommendations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Interactive dashboards
                  </span>
                </li>
              </ul>
            </div>

            {/* PREMIUM Plan */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#4d7fd9]/20 to-[#3d6dc4]/10 border border-[#4d7fd9]/50 backdrop-blur-sm transition-all duration-300 ring-2 ring-[#4d7fd9]/50">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                PREMIUM
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
                Subscribe
              </p>
              <div className="mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  $6
                </span>
                <span className="text-gray-400 text-xs sm:text-sm ml-2">
                  /month
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-4 sm:mb-6">or $60/year</p>
              <Button className="w-full bg-[#4d7fd9] hover:bg-[#5d8fe9] text-white rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm h-9 sm:h-10">
                Subscribe
              </Button>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    $20 monthly AI credits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Advanced module access
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Custom business insights
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Higher data upload limits
                  </span>
                </li>
              </ul>
            </div>

            {/* TEAM Plan */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#4d7fd9]/15 to-[#3d6dc4]/8 border border-[#4d7fd9]/30 hover:border-[#4d7fd9]/50 backdrop-blur-sm transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                TEAM
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
                Subscribe
              </p>
              <div className="mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  $60
                </span>
                <span className="text-gray-400 text-xs sm:text-sm ml-2">
                  /user/mo
                </span>
              </div>
              <Button className="w-full bg-[#4d7fd9]/20 border border-[#4d7fd9]/50 text-white hover:bg-[#4d7fd9]/30 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm h-9 sm:h-10">
                Subscribe
              </Button>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    $60 monthly AI credits per user
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Centralized dashboards
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Collaborative analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Shared project data
                  </span>
                </li>
              </ul>
            </div>

            {/* BUSINESS Plan */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#4d7fd9]/15 to-[#3d6dc4]/8 border border-[#4d7fd9]/30 hover:border-[#4d7fd9]/50 backdrop-blur-sm transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                BUSINESS
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
                Subscribe
              </p>
              <div className="mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  $200
                </span>
                <span className="text-gray-400 text-xs sm:text-sm ml-2">
                  /user/mo
                </span>
              </div>
              <Button className="w-full bg-[#4d7fd9]/20 border border-[#4d7fd9]/50 text-white hover:bg-[#4d7fd9]/30 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm h-9 sm:h-10">
                Subscribe
              </Button>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    $60 monthly AI credits per user
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Custom API access
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Private model tuning
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Dedicated support
                  </span>
                </li>
              </ul>
            </div>

            {/* ENTERPRISE Plan */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#4d7fd9]/15 to-[#3d6dc4]/8 border border-[#4d7fd9]/30 hover:border-[#4d7fd9]/50 backdrop-blur-sm transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                ENTERPRISE
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
                Contact Sales
              </p>
              <Button className="w-full bg-[#4d7fd9]/20 border border-[#4d7fd9]/50 text-white hover:bg-[#4d7fd9]/30 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm h-9 sm:h-10">
                Contact Us
              </Button>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Custom Agentic automation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    SAML SSO security
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#4d7fd9] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Priority infrastructure
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20"
      >
        <div className="space-y-10 sm:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              About Us
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Learn more about our mission, vision, and the values that drive us
              forward.
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-12 rounded-2xl bg-gradient-to-br from-[#4d7fd9]/20 to-[#3d6dc4]/10 border border-[#4d7fd9]/30 backdrop-blur-sm space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                <span className="font-semibold text-[#4d7fd9]">
                  Driving Global Economic Revival and Building the Connected
                  Economy Using Agentic AI
                </span>
              </p>
              <p className="text-sm sm:text-base text-gray-300 mt-3 sm:mt-4 leading-relaxed">
                At Joseph AI, we empower MSMEs, entrepreneurs, and enterprises
                across Africa to make smarter financial, policy, and market
                choices using Agentic AI. By combining economic intelligence,
                predictive analytics, and AI-powered automation, we help
                businesses cut losses, access funding, optimize pricing, and
                grow sustainably.
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Core Values
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {["Innovation", "Integrity", "Revival", "Satisfaction"].map(
                  (value, index) => (
                    <div
                      key={index}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#4d7fd9]/20 border border-[#4d7fd9]/50 text-white text-xs sm:text-sm font-semibold"
                    >
                      {value}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id="contact"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Get in touch
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl text-gray-300">
                If you have any questions or need help, please fill out the form
                here. We respond within 1 business day.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-[#4d7fd9] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Email
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    support@josephai.site
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Phone className="w-5 sm:w-6 h-5 sm:h-6 text-[#4d7fd9] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Phone
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    +234 708 811 4692
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-[#4d7fd9] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Address
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form
              onSubmit={handleContactSubmit}
              className="space-y-4 sm:space-y-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#4d7fd9]/15 to-[#3d6dc4]/8 border border-[#4d7fd9]/30 backdrop-blur-sm"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-[#0a1449] border-[#4d7fd9]/30 text-white placeholder:text-gray-500 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#0a1449] border-[#4d7fd9]/30 text-white placeholder:text-gray-500 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-[#0a1449] border-[#4d7fd9]/30 text-white placeholder:text-gray-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="bg-[#0a1449] border border-[#4d7fd9]/30 text-white placeholder:text-gray-500 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#4d7fd9] text-xs sm:text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={contactLoading}
                className="w-full bg-[#4d7fd9] hover:bg-[#5d8fe9] text-white rounded-lg py-2.5 sm:py-3 font-semibold text-xs sm:text-sm"
              >
                {contactLoading ? "Sending..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#4d7fd9]/10 mt-12 sm:mt-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 Joseph AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bubble-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-40px) translateX(20px);
            opacity: 0.75;
          }
          50% {
            transform: translateY(-80px) translateX(-15px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-40px) translateX(-30px);
            opacity: 0.75;
          }
        }

        @keyframes bubble-float-delayed-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.75;
          }
          25% {
            transform: translateY(30px) translateX(-25px);
            opacity: 0.7;
          }
          50% {
            transform: translateY(60px) translateX(20px);
            opacity: 0.75;
          }
          75% {
            transform: translateY(30px) translateX(35px);
            opacity: 0.7;
          }
        }

        @keyframes bubble-float-delayed-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-50px) translateX(-30px);
            opacity: 0.65;
          }
          50% {
            transform: translateY(-100px) translateX(25px);
            opacity: 0.7;
          }
          75% {
            transform: translateY(-50px) translateX(40px);
            opacity: 0.65;
          }
        }

        @keyframes bubble-float-delayed-3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.75;
          }
          25% {
            transform: translateY(35px) translateX(30px);
            opacity: 0.7;
          }
          50% {
            transform: translateY(70px) translateX(-20px);
            opacity: 0.75;
          }
          75% {
            transform: translateY(35px) translateX(-40px);
            opacity: 0.7;
          }
        }

        @keyframes bubble-float-delayed-4 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-60px) translateX(35px);
            opacity: 0.55;
          }
          50% {
            transform: translateY(-120px) translateX(-30px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-60px) translateX(-45px);
            opacity: 0.55;
          }
        }

        @keyframes bubble-float-delayed-5 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-45px) translateX(-25px);
            opacity: 0.75;
          }
          50% {
            transform: translateY(-90px) translateX(30px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-45px) translateX(20px);
            opacity: 0.75;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bubble-float {
          animation: bubble-float 8s ease-in-out infinite;
        }

        .animate-bubble-float-delayed-1 {
          animation: bubble-float-delayed-1 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-bubble-float-delayed-2 {
          animation: bubble-float-delayed-2 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-bubble-float-delayed-3 {
          animation: bubble-float-delayed-3 8s ease-in-out infinite;
          animation-delay: 3s;
        }

        .animate-bubble-float-delayed-4 {
          animation: bubble-float-delayed-4 8s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-bubble-float-delayed-5 {
          animation: bubble-float-delayed-5 8s ease-in-out infinite;
          animation-delay: 5s;
        }

        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float-card {
          animation: float-card 3s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%);
        }
      `}</style>
    </div>
  );
}

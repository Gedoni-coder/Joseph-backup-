import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  Calculator,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  Activity,
  Star,
  Users,
  Shield,
  Lightbulb,
  AlertTriangle,
  FileText,
  Upload,
  Target,
  DollarSign,
  Package,
  CreditCard,
  MessageSquare,
} from "lucide-react";

const Landing = () => {
  const navigateRef = React.useRef<any>(null);
  // Inline lazy check to gate Landing behind SignUp once per browser
  React.useEffect(() => {
    try {
      const done = localStorage.getItem("joseph:signedUp");
      if (!done) {
        // Defer navigation to avoid interfering with first render
        navigateRef.current = setTimeout(() => {
          window.location.replace("/signup");
        }, 0);
      }
    } catch {}
    return () => {
      if (navigateRef.current) clearTimeout(navigateRef.current);
    };
  }, []);
  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Economic Forecasting",
      description:
        "Advanced economic modeling and forecasting across local, state, national, and international markets",
      link: "/economic-indicators",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Business Forecasting",
      description:
        "Predictive analytics for revenue, growth projections, and comprehensive business planning strategies",
      link: "/business-forecast",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Market Analysis",
      description:
        "Competitive intelligence, market trends, and strategic positioning analysis for informed decisions",
      link: "/market-competitive-analysis",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Pricing Strategy",
      description:
        "Dynamic pricing models, competitive analysis, and optimization strategies for maximum profitability",
      link: "/pricing-strategies",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Revenue Strategy",
      description:
        "Revenue optimization, stream diversification, and growth strategies tailored to your business model",
      link: "/revenue-forecasting",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Funding and Loan Hub",
      description:
        "Funding options analysis, loan comparison, investor matching, and capital strategy planning",
      link: "/loan-research",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Inventory and Supply Chain",
      description:
        "Supply chain optimization, inventory management, and demand forecasting for operational efficiency",
      link: "/supply-chain-analytics",
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Financial Advisory",
      description:
        "Strategic budgeting, cash flow planning, and comprehensive financial guidance for better decisions",
      link: "/financial-advisory",
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Policy and Economic Impact",
      description:
        "Policy analysis, economic impact assessment, and regulatory compliance impact calculations",
      link: "/impact-calculator",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Tax and Compliance",
      description:
        "Tax optimization, compliance monitoring, and regulatory reporting for seamless operations",
      link: "/tax-compliance",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Business Feasibility",
      description:
        "Evaluate and analyze business ideas across multiple scenarios to determine viability and success potential",
      link: "/business-feasibility",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Sales Intelligence",
      description:
        "Universal sales intelligence module for lead handling, sales performance optimization, pipeline forecasting, and revenue conversion",
      link: "/sales-intelligence",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                  alt="Joseph AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Joseph AI</h1>
                <p className="text-xs text-gray-600">
                  Economic Intelligence Platform
                </p>
              </div>
            </div>
            <Link to="/economic-indicators">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                  alt="Joseph AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Meet{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Joseph AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your intelligent economic analysis companion. Get real-time
            insights, forecasts, and strategic guidance powered by advanced AI
            technology for smarter business decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/economic-indicators">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Analyzing
              </Button>
            </Link>
            <Link to="/business-forecast">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 border-2 hover:bg-gray-50"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Real-time Data
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              AI-Powered Insights
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Multi-level Analysis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Interactive Chat
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Navigation Modules - 10 Total */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Business Intelligence Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access all business intelligence modules from one unified
              platform. Click any module to dive deep into specialized analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Important People Section - Space Reserved */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the Team Behind Joseph AI
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The brilliant minds who make intelligent economic analysis
              possible
            </p>
          </div>

          {/* Reserved space for important people profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Profile cards will be added here - currently showing placeholder structure */}
            {[1, 2, 3, 4, 5, 6].map((placeholder) => (
              <Card
                key={placeholder}
                className="border-2 border-dashed border-gray-300 bg-gray-50/50"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    Profile #{placeholder} - Ready for content
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="inline-block border-2 border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-800 font-medium">
                    Ready to add photos and descriptions for your important team
                    members
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">99.9%</h3>
              <p className="text-blue-100">Data Accuracy</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">10K+</h3>
              <p className="text-blue-100">Active Users</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">1M+</h3>
              <p className="text-blue-100">Data Points Analyzed</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">Live Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white shadow-lg border border-gray-200 p-3">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                    alt="Joseph AI Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Economic Analysis?
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who trust Joseph AI for
                intelligent economic insights and strategic guidance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/economic-indicators">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/financial-advisory">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3 border-2"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Explore Features
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 p-1.5">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                    alt="Joseph AI Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold">Joseph AI</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Advanced economic intelligence platform powered by AI. Get
                real-time insights, forecasts, and strategic guidance for
                smarter business decisions.
              </p>
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-gray-300"
                >
                  <Star className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-gray-300"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Access</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/economic-indicators"
                    className="hover:text-white transition-colors"
                  >
                    Economic Forecasting
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business-forecast"
                    className="hover:text-white transition-colors"
                  >
                    Business Forecasting
                  </Link>
                </li>
                <li>
                  <Link
                    to="/financial-advisory"
                    className="hover:text-white transition-colors"
                  >
                    Financial Advisory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/market-competitive-analysis"
                    className="hover:text-white transition-colors"
                  >
                    Market Analysis
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Joseph AI. All rights reserved. Peaceful Intelligence
              Technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

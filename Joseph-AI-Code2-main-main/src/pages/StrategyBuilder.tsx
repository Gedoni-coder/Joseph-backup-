import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import {
  Target,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  DollarSign,
  Shield,
  Lightbulb,
  Brain,
  Download,
  Save,
  Share,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Settings,
  Building,
  ShoppingCart,
  Factory,
  UserPlus,
  CreditCard,
  Truck,
  Award,
  PieChart,
  ArrowRight,
  Copy,
  Trash2,
} from "lucide-react";

const StrategyBuilder = () => {
  const [selectedGoal, setSelectedGoal] = useState("revenue");
  const [selectedPillars, setSelectedPillars] = useState(["finance", "marketing"]);
  const [selectedScenario, setSelectedScenario] = useState("safe");
  const [draggedTactic, setDraggedTactic] = useState(null);

  // Strategy Goals
  const strategyGoals = [
    { id: "revenue", name: "Revenue Growth", icon: <DollarSign className="h-5 w-5" />, color: "bg-green-100 text-green-800" },
    { id: "market", name: "Market Expansion", icon: <BarChart3 className="h-5 w-5" />, color: "bg-blue-100 text-blue-800" },
    { id: "cost", name: "Cost Reduction", icon: <TrendingDown className="h-5 w-5" />, color: "bg-orange-100 text-orange-800" },
    { id: "efficiency", name: "Operational Efficiency", icon: <Settings className="h-5 w-5" />, color: "bg-purple-100 text-purple-800" },
  ];

  // Key Pillars
  const keyPillars = [
    { id: "finance", name: "Finance", icon: <DollarSign className="h-5 w-5" />, color: "bg-green-100 text-green-800" },
    { id: "operations", name: "Operations", icon: <Settings className="h-5 w-5" />, color: "bg-blue-100 text-blue-800" },
    { id: "marketing", name: "Marketing", icon: <Users className="h-5 w-5" />, color: "bg-purple-100 text-purple-800" },
    { id: "innovation", name: "Innovation", icon: <Lightbulb className="h-5 w-5" />, color: "bg-orange-100 text-orange-800" },
    { id: "hr", name: "Human Resources", icon: <UserPlus className="h-5 w-5" />, color: "bg-pink-100 text-pink-800" },
  ];

  // Tactics Library
  const tacticsLibrary = {
    finance: [
      { id: 1, name: "Dynamic Pricing Model", description: "Adjust prices based on demand and competition", impact: "High", effort: "Medium", roi: "250%" },
      { id: 2, name: "Cost Center Analysis", description: "Identify and eliminate unnecessary expenses", impact: "Medium", effort: "Low", roi: "180%" },
      { id: 3, name: "Revenue Stream Diversification", description: "Develop new income sources", impact: "High", effort: "High", roi: "300%" },
      { id: 4, name: "Financial Automation", description: "Automate routine financial processes", impact: "Medium", effort: "Medium", roi: "150%" },
    ],
    operations: [
      { id: 5, name: "Supply Chain Optimization", description: "Streamline supplier relationships and logistics", impact: "High", effort: "High", roi: "200%" },
      { id: 6, name: "Process Automation", description: "Implement automated workflows", impact: "Medium", effort: "Medium", roi: "175%" },
      { id: 7, name: "Quality Management System", description: "Enhance product/service quality", impact: "Medium", effort: "Low", roi: "130%" },
      { id: 8, name: "Lean Manufacturing", description: "Eliminate waste and improve efficiency", impact: "High", effort: "Medium", roi: "220%" },
    ],
    marketing: [
      { id: 9, name: "Customer Retention Program", description: "Implement loyalty and retention strategies", impact: "High", effort: "Medium", roi: "280%" },
      { id: 10, name: "Digital Marketing Campaign", description: "Leverage online channels for growth", impact: "Medium", effort: "Low", roi: "190%" },
      { id: 11, name: "Brand Positioning Strategy", description: "Strengthen market position and awareness", impact: "Medium", effort: "Medium", roi: "160%" },
      { id: 12, name: "Customer Analytics Platform", description: "Data-driven customer insights", impact: "High", effort: "High", roi: "240%" },
    ],
    innovation: [
      { id: 13, name: "R&D Investment Program", description: "Increase research and development activities", impact: "High", effort: "High", roi: "350%" },
      { id: 14, name: "Technology Adoption", description: "Implement cutting-edge technologies", impact: "Medium", effort: "Medium", roi: "200%" },
      { id: 15, name: "Innovation Lab", description: "Establish dedicated innovation space", impact: "Medium", effort: "High", roi: "180%" },
      { id: 16, name: "Strategic Partnerships", description: "Collaborate with innovative companies", impact: "High", effort: "Low", roi: "220%" },
    ],
    hr: [
      { id: 17, name: "Talent Acquisition Strategy", description: "Recruit top-tier professionals", impact: "Medium", effort: "Medium", roi: "170%" },
      { id: 18, name: "Employee Development Program", description: "Upskill existing workforce", impact: "Medium", effort: "Low", roi: "140%" },
      { id: 19, name: "Performance Management System", description: "Optimize employee performance", impact: "Medium", effort: "Medium", roi: "155%" },
      { id: 20, name: "Cultural Transformation", description: "Build high-performance culture", impact: "High", effort: "High", roi: "250%" },
    ],
  };

  // Scenario Modes
  const scenarios = {
    conservative: {
      name: "Conservative",
      description: "Low risk, steady growth approach",
      color: "bg-green-100 text-green-800",
      tactics: []
    },
    safe: {
      name: "Safe",
      description: "Balanced risk-reward strategy", 
      color: "bg-blue-100 text-blue-800",
      tactics: []
    },
    aggressive: {
      name: "Aggressive",
      description: "High risk, high reward approach",
      color: "bg-red-100 text-red-800", 
      tactics: []
    }
  };

  const [scenarioTactics, setScenarioTactics] = useState({
    conservative: [],
    safe: [],
    aggressive: []
  });

  // Roadmap quarters
  const [roadmapQuarters] = useState([
    { id: "q1", name: "Q1 2024", milestones: [], kpis: [] },
    { id: "q2", name: "Q2 2024", milestones: [], kpis: [] },
    { id: "q3", name: "Q3 2024", milestones: [], kpis: [] },
    { id: "q4", name: "Q4 2024", milestones: [], kpis: [] },
  ]);

  const togglePillar = (pillarId) => {
    setSelectedPillars(prev => 
      prev.includes(pillarId) 
        ? prev.filter(id => id !== pillarId)
        : [...prev, pillarId]
    );
  };

  const handleDragStart = (e, tactic) => {
    setDraggedTactic(tactic);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, scenario) => {
    e.preventDefault();
    if (draggedTactic) {
      setScenarioTactics(prev => ({
        ...prev,
        [scenario]: [...prev[scenario], draggedTactic]
      }));
      setDraggedTactic(null);
    }
  };

  const removeTacticFromScenario = (scenario, tacticId) => {
    setScenarioTactics(prev => ({
      ...prev,
      [scenario]: prev[scenario].filter(t => t.id !== tacticId)
    }));
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Target className="h-6 w-6" />}
        title="Strategic Planning & Execution Builder"
        description="Build comprehensive strategies with AI-powered insights and collaborative tools"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Strategy Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Strategy Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Define Your Strategic Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {strategyGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        selectedGoal === goal.id 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${goal.color}`}>
                          {goal.icon}
                        </div>
                        <span className="font-medium">{goal.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Pillars Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Key Pillars Selector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium mb-3 block">Choose Focus Areas for Your Strategy</label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {keyPillars.map((pillar) => (
                  <button
                    key={pillar.id}
                    onClick={() => togglePillar(pillar.id)}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedPillars.includes(pillar.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${pillar.color}`}>
                        {pillar.icon}
                      </div>
                      <span className="font-medium text-sm">{pillar.name}</span>
                    </div>
                    {selectedPillars.includes(pillar.id) && (
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Tactics Library */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Tactics Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={selectedPillars[0] || "finance"} className="space-y-4">
                  <TabsList className="grid grid-cols-5 w-full">
                    {keyPillars.map((pillar) => (
                      <TabsTrigger
                        key={pillar.id}
                        value={pillar.id}
                        disabled={!selectedPillars.includes(pillar.id)}
                        className="text-xs"
                      >
                        {pillar.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {keyPillars.map((pillar) => (
                    <TabsContent key={pillar.id} value={pillar.id} className="space-y-3">
                      {tacticsLibrary[pillar.id]?.map((tactic) => (
                        <Card
                          key={tactic.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, tactic)}
                          className="cursor-move hover:shadow-md transition-all border-l-4 border-l-blue-500"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{tactic.name}</h4>
                                  <p className="text-sm text-muted-foreground">{tactic.description}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Badge className={getImpactColor(tactic.impact)}>
                                    {tactic.impact}
                                  </Badge>
                                  <Badge className={getEffortColor(tactic.effort)}>
                                    {tactic.effort}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Expected ROI: {tactic.roi}</span>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Scenario Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Scenario Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop tactics from the library above into different strategy modes
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                      <div
                        key={key}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, key)}
                        className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3 hover:border-blue-400 transition-colors"
                      >
                        <div className="text-center">
                          <Badge className={scenario.color}>
                            {scenario.name}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {scenario.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {scenarioTactics[key].map((tactic) => (
                            <Card key={tactic.id} className="p-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{tactic.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeTacticFromScenario(key, tactic.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                        
                        {scenarioTactics[key].length === 0 && (
                          <div className="text-center text-muted-foreground text-sm mt-8">
                            Drop tactics here
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Advisor Panel */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Joseph AI Advisor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Strategy Assessment</p>
                      <p className="text-muted-foreground">
                        Your selected pillars show strong synergy. Revenue growth + Marketing focus has 85% success rate.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Risk Analysis</p>
                      <p className="text-muted-foreground">
                        High-effort tactics in aggressive scenario may strain resources. Consider phased approach.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">ROI Forecast</p>
                      <p className="text-muted-foreground">
                        Current strategy mix shows potential 240% ROI over 12 months with 78% confidence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    Get AI Recommendations
                  </Button>
                  <Link to="/ai-insights">
                    <Button variant="outline" className="w-full" size="sm">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Chat with Joseph
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Roadmap Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Roadmap Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Auto-Generate Roadmap
                </Button>
                
                <div className="space-y-3">
                  {roadmapQuarters.map((quarter) => (
                    <Card key={quarter.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{quarter.name}</span>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quarter.milestones.length || 0} milestones planned
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Collaboration Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaboration Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Owners
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Notes
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share with Teams
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Team Members</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• John Smith (Finance Lead)</p>
                    <p>• Sarah Johnson (Marketing)</p>
                    <p>• Michael Brown (Operations)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Strategy Report (PDF)
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel Workbook
                </Button>
                <Link to="/growth-planning">
                  <Button className="w-full" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Integrate with Growth Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrategyBuilder;

import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft, FileText, PlusCircle, Monitor, Shield } from "lucide-react";
import { useCompetitiveData } from "@/hooks/useCompetitiveData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SwotWhitePaper() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const company = params.get("company") || "Your Organization";
  const { swotAnalyses, competitiveAdvantages } = useCompetitiveData();

  const swot = useMemo(() => swotAnalyses.find(s => s.competitor === company), [swotAnalyses, company]);

  const [localAdvantages, setLocalAdvantages] = useState<{ id: string; advantage: string; type: string; description: string; monitored?: boolean; recommendations?: string[] }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ advantage: "", type: "technology", description: "" });
  const [strengthenOpen, setStrengthenOpen] = useState(false);
  const [selectedAdvIndex, setSelectedAdvIndex] = useState<number | null>(null);
  const [recSelections, setRecSelections] = useState<string[]>([]);

  const allAdvantages = useMemo(() => {
    const base = competitiveAdvantages.map(a => ({ id: a.id, advantage: a.advantage, type: a.type, description: a.description }));
    return [...base, ...localAdvantages];
  }, [competitiveAdvantages, localAdvantages]);

  const downloadTxt = () => {
    const lines: string[] = [];
    lines.push(`SWOT White Paper`);
    lines.push("");
    lines.push(`Company: ${company}`);
    lines.push("");
    if (swot) {
      const section = (title: string, items: any[]) => {
        lines.push(title + ":");
        items.forEach(i => lines.push(`- ${i.factor}: ${i.description} (impact: ${i.impact}, confidence: ${i.confidence}%)`));
        lines.push("");
      };
      section("Strengths", swot.strengths);
      section("Weaknesses", swot.weaknesses);
      section("Opportunities", swot.opportunities);
      section("Threats", swot.threats);
    }
    lines.push("Advantages:");
    allAdvantages.forEach(a => lines.push(`- [${a.type}] ${a.advantage}: ${a.description}`));
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SWOT-${company.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    window.print();
  };

  const addAdvantage = () => {
    if (!form.advantage.trim()) return;
    setLocalAdvantages(prev => [
      { id: Date.now().toString(), advantage: form.advantage.trim(), type: form.type, description: form.description.trim() },
      ...prev,
    ]);
    setForm({ advantage: "", type: "technology", description: "" });
    setShowForm(false);
  };

  const openStrengthen = (index: number) => {
    setSelectedAdvIndex(index);
    const adv = allAdvantages[index];
    const recs = [
      `Invest in ${adv.type} roadmap for ${company}`,
      `Form partnership to enhance ${adv.advantage}`,
      `Allocate budget to scale ${adv.advantage} impact`,
    ];
    setRecSelections(recs);
    setStrengthenOpen(true);
  };

  const applyRecommendations = () => {
    if (selectedAdvIndex == null) return;
    const adv = allAdvantages[selectedAdvIndex];
    setLocalAdvantages(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(a => a.id === adv.id);
      if (idx >= 0) {
        copy[idx] = { ...copy[idx], recommendations: recSelections };
      } else {
        copy.unshift({ ...adv, recommendations: recSelections });
      }
      return copy;
    });
    setStrengthenOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/market-competitive-analysis" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTxt}><Download className="h-4 w-4 mr-2" /> Download</Button>
            <Button onClick={exportPdf}><FileText className="h-4 w-4 mr-2" /> Export PDF</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">SWOT Analysis — {company}</CardTitle>
          </CardHeader>
          <CardContent>
            {!swot ? (
              <div className="text-sm text-muted-foreground">No SWOT data found. Use Analyze New Advantage to begin documenting strengths.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-2">Strengths</div>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    {swot.strengths.map((s, i) => (
                      <li key={i}><span className="font-medium">{s.factor}:</span> {s.description} <span className="text-xs text-muted-foreground">(impact {s.impact}, conf. {s.confidence}%)</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Weaknesses</div>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    {swot.weaknesses.map((s, i) => (
                      <li key={i}><span className="font-medium">{s.factor}:</span> {s.description} <span className="text-xs text-muted-foreground">(impact {s.impact}, conf. {s.confidence}%)</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Opportunities</div>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    {swot.opportunities.map((s, i) => (
                      <li key={i}><span className="font-medium">{s.factor}:</span> {s.description} <span className="text-xs text-muted-foreground">(impact {s.impact}, conf. {s.confidence}%)</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Threats</div>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    {swot.threats.map((s, i) => (
                      <li key={i}><span className="font-medium">{s.factor}:</span> {s.description} <span className="text-xs text-muted-foreground">(impact {s.impact}, conf. {s.confidence}%)</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Competitive Advantages</div>
          <Button onClick={() => setShowForm(s => !s)} className="bg-blue-600 hover:bg-blue-700"><PlusCircle className="h-4 w-4 mr-2" /> Analyze New Advantage</Button>
        </div>

        {showForm && (
          <Card className="mb-4 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input placeholder="Advantage" value={form.advantage} onChange={(e) => setForm({ ...form, advantage: e.target.value })} />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="technology">Technology</option>
                  <option value="cost">Cost</option>
                  <option value="service">Service</option>
                  <option value="brand">Brand</option>
                  <option value="distribution">Distribution</option>
                  <option value="partnerships">Partnerships</option>
                </select>
                <div className="md:col-span-2"><Textarea placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[40px]" /></div>
                <div className="md:col-span-4"><Button onClick={addAdvantage} disabled={!form.advantage} className="bg-blue-600 hover:bg-blue-700">Go</Button></div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAdvantages.map((a, idx) => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="text-base">[{a.type}] {a.advantage}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                {a.recommendations && a.recommendations.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium">Recommendations</div>
                    <ul className="list-disc ml-6 text-sm">
                      {a.recommendations.map((r, i) => (<li key={i}>{r}</li>))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setLocalAdvantages(prev => {
                      const copy = [...prev];
                      const i = copy.findIndex(x => x.id === a.id);
                      if (i >= 0) copy[i] = { ...copy[i], monitored: true };
                      else copy.unshift({ ...a, monitored: true });
                      return copy;
                    });
                  }}><Monitor className="h-4 w-4 mr-2" /> Monitor</Button>
                  <Button onClick={() => openStrengthen(idx)}><Shield className="h-4 w-4 mr-2" /> Strengthen</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={strengthenOpen} onOpenChange={setStrengthenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select recommendations</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {recSelections.map((r, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                <span>{r}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStrengthenOpen(false)}>Cancel</Button>
            <Button onClick={applyRecommendations}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft, FileText, Building2 } from "lucide-react";
import { useCompetitiveData } from "@/hooks/useCompetitiveData";

export default function CompetitorWhitePaper() {
  const { id } = useParams();
  const { competitors } = useCompetitiveData();
  const comp = competitors.find(c => c.id === id);

  const description = comp ? comp.description : "No description available.";

  const downloadTxt = () => {
    const content = `Competitor Profile\n\nName: ${comp?.name || "Unknown"}\nType: ${comp?.type || "-"}\nMarket Share: ${comp?.marketShare ?? "-"}%\nRevenue: ${comp?.revenue ?? "-"}\nEmployees: ${comp?.employees ?? "-"}\nFounded: ${comp?.founded || "-"}\nHeadquarters: ${comp?.headquarters || "-"}\n\nKey Products: ${(comp?.keyProducts || []).join(", ")}\n\nDescription:\n${description}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Profile-${(comp?.name || "Company").replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/market-competitive-analysis" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTxt}><Download className="h-4 w-4 mr-2" /> Download</Button>
            <Button onClick={exportPdf}><FileText className="h-4 w-4 mr-2" /> Export PDF</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Building2 className="h-5 w-5" /> {comp?.name || "Competitor Profile"}</CardTitle>
          </CardHeader>
          <CardContent>
            {comp ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">{description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><strong>Type:</strong> {comp.type}</div>
                  <div><strong>Market Share:</strong> {comp.marketShare}%</div>
                  <div><strong>Revenue:</strong> ${'{'}comp.revenue.toLocaleString(){'}'}</div>
                  <div><strong>Employees:</strong> {comp.employees.toLocaleString()}</div>
                  <div><strong>Founded:</strong> {comp.founded}</div>
                  <div><strong>Headquarters:</strong> {comp.headquarters}</div>
                </div>
                {comp.keyProducts?.length ? (
                  <div>
                    <div className="font-medium">Key Products</div>
                    <ul className="list-disc ml-6 text-sm">
                      {comp.keyProducts.map((p, i) => (<li key={i}>{p}</li>))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>No competitor found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

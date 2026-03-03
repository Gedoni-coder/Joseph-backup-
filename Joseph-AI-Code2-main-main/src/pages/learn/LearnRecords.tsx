import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart3, TrendingUp, Award } from "lucide-react";

interface QuizRecord {
  courseTitle: string;
  score: number;
  completedAt: string;
}

export default function LearnRecords() {
  const [records, setRecords] = React.useState<QuizRecord[]>([]);

  React.useEffect(() => {
    try {
      const quizzes = JSON.parse(localStorage.getItem("joseph:quizzes") || "[]");
      const completed = quizzes
        .filter((q: any) => q.completed && q.score !== undefined)
        .map((q: any) => ({
          courseTitle: q.courseTitle,
          score: q.score,
          completedAt: new Date().toISOString(), // In real app, store actual completion date
        }));
      setRecords(completed);
    } catch (e) {
      console.error("Error loading records:", e);
    }
  }, []);

  const averageScore = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
    : 0;
  const totalQuizzes = records.length;
  const passedQuizzes = records.filter(r => r.score >= 70).length;

  return (
    <div className="container mx-auto py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Records</h1>
      <p className="mb-6 text-muted-foreground">
        View your performance records and track progress across all quizzes.
      </p>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{averageScore}%</div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalQuizzes}</div>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{passedQuizzes}</div>
                <p className="text-sm text-muted-foreground">Passed (≥70%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Records */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quiz Performance History</h2>
        {records.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No quiz records yet. Complete quizzes to see your performance here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{record.courseTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{record.score}%</div>
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(record.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      record.score >= 70 ? "bg-green-100 text-green-600" :
                      record.score >= 50 ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      <span className="text-lg font-bold">{record.score}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { ClipboardList } from "lucide-react";

interface Quiz {
  id: string;
  courseId: string;
  courseTitle: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  completed: boolean;
  score?: number;
}

export default function LearnQuizzes() {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>(() => {
    try {
      const stored = localStorage.getItem("joseph:quizzes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeQuiz, setActiveQuiz] = React.useState<Quiz | null>(null);
  const [answers, setAnswers] = React.useState<{ [qId: string]: number }>({});
  const [submitted, setSubmitted] = React.useState(false);

  // Auto-generate quizzes for courses
  React.useEffect(() => {
    try {
      const courses = JSON.parse(localStorage.getItem("joseph:courses") || "[]");
      const existingQuizIds = new Set(quizzes.map(q => q.courseId));
      
      const newQuizzes: Quiz[] = courses
        .filter((c: any) => !existingQuizIds.has(c.id))
        .map((course: any) => ({
          id: `quiz_${course.id}_${Date.now()}`,
          courseId: course.id,
          courseTitle: course.title,
          questions: generateQuestionsForCourse(course.topic),
          completed: false,
        }));

      if (newQuizzes.length > 0) {
        const updated = [...quizzes, ...newQuizzes];
        setQuizzes(updated);
        localStorage.setItem("joseph:quizzes", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Error generating quizzes:", e);
    }
  }, []);

  function generateQuestionsForCourse(topic: string): Quiz["questions"] {
    // Simple auto-generation - in production, use AI to generate context-aware questions
    return [
      {
        id: "q1",
        question: `What is a key concept in ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        question: `How does ${topic} relate to the connected economy?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: `Which statement best describes ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 2,
      },
    ];
  }

  function handleStartQuiz(quiz: Quiz) {
    setActiveQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / activeQuiz.questions.length) * 100);

    const updated = quizzes.map(q =>
      q.id === activeQuiz.id ? { ...q, completed: true, score } : q
    );
    setQuizzes(updated);
    localStorage.setItem("joseph:quizzes", JSON.stringify(updated));
    setSubmitted(true);
  }

  if (activeQuiz && !submitted) {
    return (
      <div className="container mx-auto py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{activeQuiz.courseTitle} - Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id}>
                <h3 className="font-semibold mb-3">
                  Question {idx + 1}: {q.question}
                </h3>
                <RadioGroup
                  value={answers[q.id]?.toString()}
                  onValueChange={(val) => setAnswers({ ...answers, [q.id]: parseInt(val) })}
                >
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-2">
                      <RadioGroupItem value={optIdx.toString()} id={`${q.id}-${optIdx}`} />
                      <Label htmlFor={`${q.id}-${optIdx}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button onClick={handleSubmit} className="w-full">Submit Quiz</Button>
            <Button variant="outline" onClick={() => setActiveQuiz(null)} className="w-full">
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted && activeQuiz) {
    return (
      <div className="container mx-auto py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{activeQuiz.score}%</div>
              <p className="text-muted-foreground">You scored {activeQuiz.score}% on this quiz.</p>
            </div>
            <Button onClick={() => { setActiveQuiz(null); setSubmitted(false); }} className="w-full">
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
      <p className="mb-6 text-muted-foreground">
        Take automatically generated quizzes for each course you've completed.
      </p>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quizzes available yet. Complete a course to generate quizzes!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{quiz.courseTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {quiz.questions.length} questions
                </p>
                {quiz.completed && quiz.score !== undefined ? (
                  <div>
                    <p className="text-sm font-semibold mb-2">Score: {quiz.score}%</p>
                    <Button onClick={() => handleStartQuiz(quiz)} variant="outline" className="w-full">
                      Retake Quiz
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => handleStartQuiz(quiz)} className="w-full">
                    Start Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


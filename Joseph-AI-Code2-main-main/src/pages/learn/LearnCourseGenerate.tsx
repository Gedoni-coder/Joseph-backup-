import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { ModuleConversation } from "../../components/conversation/module-conversation";

export default function LearnCourseGenerate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const [courseContent, setCourseContent] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [courseId] = React.useState(() => `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  React.useEffect(() => {
    if (!topic) {
      navigate("/learn/courses");
      return;
    }

    // Generate course content via AI (using Groq API)
    async function generateCourse() {
      setLoading(true);
      try {
        const backendBase = import.meta.env.VITE_CHATBOT_BACKEND_URL || "http://localhost:8000";
          const response = await fetch(`${backendBase}/chatbot/generate-response/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Create a comprehensive, well-structured course about: ${topic}. Focus on microeconomics, macroeconomics, and the connected economy context. Format it with clear sections, headings, and practical explanations relevant to business and economic decision-making.`,
            context: "course_generation"
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setCourseContent(data.response || "Course content will be generated here.");
          
          // Save course to localStorage
          const courses = JSON.parse(localStorage.getItem("joseph:courses") || "[]");
          courses.push({
            id: courseId,
            title: `Course: ${topic}`,
            topic: topic,
            createdAt: new Date().toISOString(),
            conversationCount: 0,
          });
          localStorage.setItem("joseph:courses", JSON.stringify(courses));
        } else {
          setCourseContent(`# Course: ${topic}\n\nThis course explores ${topic} from microeconomic and macroeconomic perspectives within the connected economy framework.\n\n## Introduction\n\nUnderstanding ${topic} is essential for making informed business and economic decisions in today's interconnected markets.\n\n[Course content will be generated here]`);
        }
      } catch (error) {
        setCourseContent(`# Course: ${topic}\n\nThis course explores ${topic} from microeconomic and macroeconomic perspectives within the connected economy framework.\n\n## Introduction\n\nUnderstanding ${topic} is essential for making informed business and economic decisions in today's interconnected markets.\n\n[Course content generation encountered an error. You can still use the chatbot below to learn interactively about ${topic} and its economic implications.]`);
      } finally {
        setLoading(false);
      }
    }

    generateCourse();
  }, [topic, courseId, navigate]);

  return (
    <div className="container mx-auto py-12 max-w-5xl min-h-screen flex flex-col">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/learn/courses")} className="mb-4">
          ← Back to Courses
        </Button>
        <h1 className="text-3xl font-bold mb-2">Course: {topic}</h1>
      </div>

      {/* Course Content */}
      <Card className="mb-6 flex-1">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Generating course content...</span>
            </div>
          ) : (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">{courseContent}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chatbot - Always at bottom */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg z-10">
        <div className="max-w-5xl mx-auto p-4">
          <ModuleConversation module="market_analysis" moduleTitle={`Course: ${topic}`} />
        </div>
      </div>
    </div>
  );
}


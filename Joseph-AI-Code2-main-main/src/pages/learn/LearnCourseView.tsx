import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ModuleConversation } from "../../components/conversation/module-conversation";

export default function LearnCourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = React.useState<any>(null);

  React.useEffect(() => {
    if (!courseId) {
      navigate("/learn/courses");
      return;
    }

    // Load course from localStorage
    try {
      const courses = JSON.parse(localStorage.getItem("joseph:courses") || "[]");
      const found = courses.find((c: any) => c.id === courseId);
      if (found) {
        setCourse(found);
      } else {
        navigate("/learn/courses");
      }
    } catch {
      navigate("/learn/courses");
    }
  }, [courseId, navigate]);

  if (!course) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-5xl min-h-screen flex flex-col">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/learn/courses")} className="mb-4">
          ← Back to Courses
        </Button>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground">Topic: {course.topic}</p>
      </div>

      {/* Course Content Placeholder - In real app, load from stored content */}
      <Card className="mb-6 flex-1">
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <h2>Course Content</h2>
            <p className="text-muted-foreground">
              Course materials covering microeconomics, macroeconomics, and the connected economy are displayed here. Use the chatbot below to continue learning and explore economic concepts.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chatbot - Always at bottom */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg z-10">
        <div className="max-w-5xl mx-auto p-4">
          <ModuleConversation module="market_analysis" moduleTitle={course.title} />
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { BookOpen, MessageSquare } from "lucide-react";

interface Course {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  conversationCount: number;
}

export default function LearnCourses() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  
  // Load courses from localStorage
  const [courses, setCourses] = React.useState<Course[]>(() => {
    try {
      const stored = localStorage.getItem("joseph:courses");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/learn/courses/generate?topic=${encodeURIComponent(query)}`);
  }

  const filteredCourses = courses.filter(course =>
    [course.title, course.topic].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Courses</h1>
      <p className="mb-6 text-muted-foreground">
        Create AI-generated courses or access your previously taken courses with full conversation history.
      </p>

      {/* Course Generation Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="flex gap-2">
            <Input
              type="text"
              placeholder="What topic would you like to learn about? (e.g., Introduction to Smart Contracts)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Generate Course</Button>
          </form>
        </CardContent>
      </Card>

      {/* Course History */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No courses yet. Generate your first course above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/learn/courses/${course.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{course.topic}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{course.conversationCount} conversations</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Search, BookOpen, ClipboardList, BarChart3 } from "lucide-react";

export default function Learn() {
  return (
    <div className="container mx-auto py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learn Division</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the connected economy through discovery, courses, quizzes, and track your learning journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/learn/discover">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Discover</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore topics about the connected economy with search and curated content.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/learn/courses">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Courses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create AI-generated courses and learn through conversational classes with Joseph AI.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/learn/quizzes">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Quizzes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Take automatically generated quizzes for each course to test your knowledge.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/learn/records">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Records</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your performance records and track progress across all quizzes.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}


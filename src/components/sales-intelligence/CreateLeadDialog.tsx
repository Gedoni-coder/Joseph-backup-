import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ArrowRight } from "lucide-react";
import CreateLeadForm from "./CreateLeadForm";
import DocumentUpload from "./DocumentUpload";

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCreated?: (lead: any) => void;
}

export default function CreateLeadDialog({
  open,
  onOpenChange,
  onLeadCreated,
}: CreateLeadDialogProps) {
  const [step, setStep] = useState<"choice" | "form" | "upload">("choice");

  const handleReset = () => {
    setStep("choice");
  };

  const handleBack = () => {
    setStep("choice");
  };

  const handleFormSubmit = (formData: any) => {
    onLeadCreated?.(formData);
    onOpenChange(false);
    handleReset();
  };

  const handleDocumentUpload = (files: File[]) => {
    onLeadCreated?.({ type: "document", files });
    onOpenChange(false);
    handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {step === "choice" && (
          <>
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
              <DialogDescription>
                Choose how you want to add a new lead to your pipeline
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <button
                onClick={() => setStep("form")}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Fill Form
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Manually enter lead details
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => setStep("upload")}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Upload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Upload Document
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload PDF, Excel, or other documents
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
              </button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Create Lead - Manual Entry</DialogTitle>
              <DialogDescription>
                Fill in the lead details below
              </DialogDescription>
            </DialogHeader>
            <CreateLeadForm
              onSubmit={handleFormSubmit}
              onCancel={handleBack}
            />
          </>
        )}

        {step === "upload" && (
          <>
            <DialogHeader>
              <DialogTitle>Create Lead - Upload Document</DialogTitle>
              <DialogDescription>
                Upload documents containing lead information
              </DialogDescription>
            </DialogHeader>
            <DocumentUpload
              onUpload={handleDocumentUpload}
              onCancel={handleBack}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

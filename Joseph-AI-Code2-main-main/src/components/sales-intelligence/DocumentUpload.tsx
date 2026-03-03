import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  onCancel: () => void;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".xls",
  ".xlsx",
  ".doc",
  ".docx",
  ".csv",
];

export default function DocumentUpload({
  onUpload,
  onCancel,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext),
      );
      if (!hasValidExtension) {
        return false;
      }
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return false;
    }

    return true;
  };

  const handleFiles = (newFiles: FileList) => {
    setError("");
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(newFiles).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `Invalid files: ${invalidFiles.join(", ")}. Only PDF, Excel, Word, and CSV files under 10MB are allowed.`,
      );
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }
    onUpload(files);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept={ALLOWED_EXTENSIONS.join(",")}
        />

        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="font-semibold text-gray-900 mb-1">
          Drag and drop files here
        </p>
        <p className="text-sm text-gray-600">
          or click to browse your computer
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: PDF, Excel, Word, CSV (max 10MB each)
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Selected Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <File className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={files.length === 0}
          className="flex-1"
        >
          Upload Files
        </Button>
      </div>
    </div>
  );
}

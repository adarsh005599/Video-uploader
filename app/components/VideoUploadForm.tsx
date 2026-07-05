"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "./FileUpload";
import { apiClient, VideoFormData } from "@/app/utils/api-client";

export default function VideoUploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleUploadSuccess = (res: any) => {
    // ImageKit's upload response includes the file's public URL as `url`
    setVideoUrl(res.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!videoUrl) {
      setError("Please upload a video before submitting");
      return;
    }
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: VideoFormData = {
        title,
        description,
        videoUrl,
        controls: true,
      } as VideoFormData;

      await apiClient.createVideo(payload);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Video file</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={setUploadProgress}
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm mt-1">Uploading... {uploadProgress}%</p>
        )}
        {videoUrl && (
          <p className="text-sm text-green-600 mt-1">Video uploaded ✓</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Publish video"}
      </button>
    </form>
  );
}
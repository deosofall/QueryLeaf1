"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2, Upload } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log("meow", data);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="glass rounded-2xl p-1.5 glow-emerald-sm">
      <div
        {...getRootProps({
          className: `border-dashed border-2 rounded-xl cursor-pointer py-10 flex justify-center items-center flex-col transition-all duration-300 ${
            isDragActive
              ? "border-emerald-500/60 bg-emerald-500/10"
              : "border-border/60 hover:border-emerald-500/40 hover:bg-emerald-500/5"
          }`,
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="mt-3 text-sm text-muted-foreground">
              Analyzing your document...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3">
              <Upload className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-foreground/80">
              Drop your PDF here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse · max 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

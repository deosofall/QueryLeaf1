import { SignIn } from "@clerk/nextjs";
import { Leaf } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-7 h-7 text-emerald-500" />
          <span className="text-xl font-outfit font-bold text-foreground tracking-tight">
            Query<span className="text-gradient-emerald">Leaf</span>
          </span>
        </div>
        <SignIn />
      </div>
    </div>
  );
}

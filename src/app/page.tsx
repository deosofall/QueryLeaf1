import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn, Leaf, Sparkles, BookOpen, Zap } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-animated overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-emerald-500" />
            <span className="text-xl font-outfit font-bold text-foreground tracking-tight">
              Query<span className="text-gradient-emerald">Leaf</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuth && (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — Copy */}
          <div className="flex flex-col gap-8 animate-slide-up">
            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass text-accent border border-accent/20">
                <Zap className="w-3.5 h-3.5" />
                Instant Answers
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass text-blue-400 border border-blue-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                Research-Grade
              </span>
            </div>

            <div>
              <h1 className="text-5xl lg:text-6xl font-outfit font-bold leading-tight tracking-tight">
                <span className="text-foreground">Chat with any</span>
                <br />
                <span className="text-gradient-emerald">PDF document</span>
              </h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Upload your PDFs and get instant, AI-powered answers. Join
              millions of students, researchers, and professionals transforming
              how they interact with documents.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {isAuth && firstChat && (
                <>
                  <Link href={`/chat/${firstChat.id}`}>
                    <Button className="bg-emerald-500 hover:bg-emerald-400 text-background font-semibold px-6 h-12 text-base glow-emerald-sm transition-all duration-300 hover:glow-emerald">
                      Go to Chats
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <SubscriptionButton isPro={isPro} />
                </>
              )}
              {!isAuth && (
                <Link href="/sign-in">
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-background font-semibold px-8 h-12 text-base glow-emerald-sm transition-all duration-300 hover:glow-emerald animate-glow-pulse">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background"
                    style={{
                      background: `hsl(${152 + i * 30}, ${40 + i * 5}%, ${30 + i * 8}%)`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">10,000+</span>{" "}
                researchers trust QueryLeaf
              </p>
            </div>
          </div>

          {/* Right — Upload / Visual */}
          <div className="flex flex-col items-center justify-center animate-fade-in">
            {isAuth ? (
              <div className="w-full max-w-md">
                <FileUpload />
              </div>
            ) : (
              <div className="relative w-full max-w-md">
                {/* Decorative card */}
                <div className="glass rounded-2xl p-8 glow-emerald-sm">
                  <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center animate-float">
                      <Leaf className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-outfit font-semibold text-foreground mb-2">
                        Your PDFs, Supercharged
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Drop any PDF and start asking questions. Our AI reads,
                        understands, and answers — instantly.
                      </p>
                    </div>
                    <div className="w-full space-y-3">
                      {["Upload PDF", "Ask a question", "Get instant answers"].map(
                        (step, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 glass-light rounded-lg px-4 py-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-sm text-foreground/80">
                              {step}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <Link href="/sign-in" className="w-full">
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-background font-semibold h-11 transition-all duration-300">
                        <LogIn className="mr-2 w-4 h-4" />
                        Sign in to start
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Background glow decoration */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 rounded-full blur-3xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-background font-[family-name:var(--font-geist-sans)]">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-20 bg-surface border-r border-border">
        <div className="max-w-sm">
          <p className="text-xl font-semibold text-brand mb-2">Ghost AI</p>
          <p className="text-lg font-medium text-copy-primary mb-3">
            Write code, not prompts.
          </p>
          <p className="text-base text-copy-secondary mb-10">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>
          <ul className="space-y-4 text-base text-copy-muted">
            <li>AI-powered editor built for developers</li>
            <li>Context-aware code generation</li>
            <li>Collaborative projects</li>
          </ul>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background">
        <SignUp />
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-background font-[family-name:var(--font-geist-sans)]">
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-border overflow-hidden">
        {/* Dynamic tech hero — edge to edge across top */}
        <div className="relative flex-shrink-0" style={{ height: 280 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 280"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <defs>
              <pattern
                id="si-grid"
                x="0"
                y="0"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  strokeWidth="0.5"
                  style={{ stroke: "var(--accent-primary)", strokeOpacity: 0.09 }}
                />
              </pattern>
              <radialGradient id="si-cyan" cx="25%" cy="50%" r="45%">
                <stop
                  offset="0%"
                  style={{ stopColor: "var(--accent-primary)", stopOpacity: 0.4 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "var(--accent-primary)", stopOpacity: 0 }}
                />
              </radialGradient>
              <radialGradient id="si-purple" cx="75%" cy="45%" r="40%">
                <stop
                  offset="0%"
                  style={{ stopColor: "var(--accent-ai)", stopOpacity: 0.35 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "var(--accent-ai)", stopOpacity: 0 }}
                />
              </radialGradient>
            </defs>

            <rect width="800" height="280" fill="#090910" />
            <rect width="800" height="280" fill="url(#si-grid)" />
            <rect width="800" height="280" fill="url(#si-cyan)">
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="5s"
                repeatCount="indefinite"
              />
            </rect>
            <rect width="800" height="280" fill="url(#si-purple)">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="7s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Circuit traces */}
            <g fill="none" strokeWidth="1">
              <path
                d="M 96 180 L 96 72 L 192 72"
                style={{ stroke: "var(--accent-primary)", strokeOpacity: 0.22 }}
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 280;280 0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 192 72 L 360 72 L 360 48 L 384 48"
                style={{ stroke: "var(--accent-primary)", strokeOpacity: 0.18 }}
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 220;220 0"
                  dur="5s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 384 48 L 576 48 L 576 96"
                style={{ stroke: "var(--accent-primary)", strokeOpacity: 0.15 }}
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 245;245 0"
                  dur="6s"
                  begin="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 576 96 L 720 96 L 720 72"
                style={{ stroke: "var(--accent-ai)", strokeOpacity: 0.2 }}
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 175;175 0"
                  dur="4.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 288 210 L 288 168 L 480 168 L 480 144"
                style={{ stroke: "var(--accent-ai)", strokeOpacity: 0.13 }}
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0 265;265 0"
                  dur="5.5s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Nodes */}
            <g>
              {/* A: 192,72 */}
              <circle
                cx="192"
                cy="72"
                r="3"
                style={{ fill: "var(--accent-primary)" }}
              >
                <animate
                  attributeName="r"
                  values="2.5;4.5;2.5"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx="192"
                cy="72"
                r="5"
                fill="none"
                style={{ stroke: "var(--accent-primary)" }}
              >
                <animate
                  attributeName="r"
                  values="5;16;5"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.35;0;0.35"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* B: 384,48 */}
              <circle
                cx="384"
                cy="48"
                r="2.5"
                style={{ fill: "var(--accent-primary)" }}
              >
                <animate
                  attributeName="r"
                  values="2;4;2"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx="384"
                cy="48"
                r="4"
                fill="none"
                style={{ stroke: "var(--accent-primary)" }}
              >
                <animate
                  attributeName="r"
                  values="4;13;4"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.3;0;0.3"
                  dur="4s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* C: 576,96 */}
              <circle
                cx="576"
                cy="96"
                r="3"
                style={{ fill: "var(--accent-ai)" }}
              >
                <animate
                  attributeName="r"
                  values="2.5;4.5;2.5"
                  dur="3.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="3.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx="576"
                cy="96"
                r="5"
                fill="none"
                style={{ stroke: "var(--accent-ai)" }}
              >
                <animate
                  attributeName="r"
                  values="5;16;5"
                  dur="3.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.35;0;0.35"
                  dur="3.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* D: 720,72 */}
              <circle
                cx="720"
                cy="72"
                r="2.5"
                style={{ fill: "var(--accent-ai-text)" }}
              >
                <animate
                  attributeName="r"
                  values="2;3.5;2"
                  dur="5s"
                  begin="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5"
                  dur="5s"
                  begin="2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* E: 96,180 */}
              <circle
                cx="96"
                cy="180"
                r="2"
                style={{ fill: "var(--accent-primary)" }}
              >
                <animate
                  attributeName="r"
                  values="1.5;3.5;1.5"
                  dur="4s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.8;0.4"
                  dur="4s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* F: 480,144 */}
              <circle
                cx="480"
                cy="144"
                r="2"
                style={{ fill: "var(--accent-ai)" }}
              >
                <animate
                  attributeName="r"
                  values="1.5;3;1.5"
                  dur="4.5s"
                  begin="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.7;0.4"
                  dur="4.5s"
                  begin="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>

          {/* Seamless fade into panel background */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--bg-surface))",
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center flex-1 px-20 py-10">
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
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background">
        <SignIn />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, CheckCircle2, RefreshCw, Globe, HelpCircle } from "lucide-react";
import { ChromeIcon as Chrome } from "./icons";

export const InteractiveHowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leetSolved, setLeetSolved] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [simulatedUrl, setSimulatedUrl] = useState("youtube.com");
  const [errorMsg, setErrorMsg] = useState("");

  const steps = [
    {
      title: "1. Unpacked Installation",
      desc: "Install the extension in developer mode or Chrome Web Store. On first launch, the setup popup opens.",
    },
    {
      title: "2. Lock-In Username",
      desc: "Enter your LeetCode username. DevGuard links to your profile to fetch verified submissions.",
    },
    {
      title: "3. Total Restrictive Guard",
      desc: "Attempting to visit any website redirects you straight to the daily LeetCode challenge.",
    },
    {
      title: "4. Solve to Unlock",
      desc: "Solve the daily challenge. DevGuard verifies the solve via the LeetCode API and lifts the block.",
    },
  ];

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      setErrorMsg("Please enter valid username");
      return;
    }
    setErrorMsg("");
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSubmitted(true);
      setActiveStep(2); // Auto advance to lock step
    }, 1200);
  };

  const handleSimulateRedirect = () => {
    setSimulatedUrl("youtube.com");
    setTimeout(() => {
      setSimulatedUrl("leetcode.com/problems/daily-problem");
    }, 800);
  };

  const handleVerifySolve = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLeetSolved(true);
      setStreakCount(1);
      setActiveStep(3); // Auto advance to unlocked step
    }, 1500);
  };

  const resetSimulator = () => {
    setUsername("");
    setIsSubmitted(false);
    setLeetSolved(false);
    setStreakCount(0);
    setSimulatedUrl("youtube.com");
    setErrorMsg("");
    setActiveStep(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
      {/* Left Column: Interactive Steps Controls */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                activeStep === idx
                  ? "bg-brand-dark/80 border-brand-green/40 shadow-[0_0_15px_-3px_rgba(34,197,94,0.15)]"
                  : "bg-transparent border-neutral-900 hover:border-neutral-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                    activeStep === idx
                      ? "text-brand-green border-brand-green/30 bg-brand-green/10"
                      : "text-neutral-500 border-neutral-800"
                  }`}
                >
                  Step 0{idx + 1}
                </span>
                <span
                  className={`font-mono text-sm font-semibold transition-colors ${
                    activeStep === idx ? "text-neutral-100" : "text-neutral-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {activeStep === idx && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-neutral-400 mt-2 leading-relaxed"
                >
                  {step.desc}
                </motion.p>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={resetSimulator}
          className="flex items-center justify-center space-x-2 border border-neutral-800 hover:border-neutral-700 bg-brand-dark/20 text-neutral-400 hover:text-neutral-200 transition-colors py-2 px-4 rounded-lg text-xs font-mono w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Simulator</span>
        </button>
      </div>

      {/* Right Column: Simulated Sandbox (Chrome Window Mockup) */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="flex-grow bg-brand-dark/40 border border-neutral-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[380px] min-h-[380px]">
          {/* Browser Window Header */}
          <div className="bg-brand-dark border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            </div>
            
            {/* Address Bar */}
            <div className="bg-brand-black/60 border border-neutral-850 rounded-md py-1 px-3 text-[10px] text-neutral-500 font-mono flex items-center justify-center space-x-1 w-2/3 mx-auto">
              <Globe className="w-3 h-3 text-neutral-600 flex-shrink-0" />
              <span className="truncate">{simulatedUrl}</span>
            </div>

            <div className="w-10 flex justify-end">
              <div className="p-1 rounded bg-brand-green/10 border border-brand-green/20">
                <Chrome className="w-3.5 h-3.5 text-brand-green" />
              </div>
            </div>
          </div>

          {/* Browser / Extension Content View */}
          <div className="p-6 flex-grow flex items-center justify-center relative overflow-hidden bg-brand-black/40">
            {/* Ambient background grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-brand-dark border border-neutral-800 rounded-xl p-5 w-72 shadow-xl z-10"
                >
                  <div className="font-mono text-xs text-neutral-400 mb-1 tracking-wider uppercase">Setup</div>
                  <h4 className="text-sm font-semibold text-neutral-200 mb-3">Enter LeetCode username:</h4>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-brand-black border border-neutral-800 focus:border-brand-green/50 text-neutral-200 rounded px-3 py-1.5 text-xs focus:outline-none transition-colors font-mono"
                  />
                  <div className="text-[10px] text-brand-yellow/80 font-mono mt-2 flex items-center space-x-1">
                    <HelpCircle className="w-3 h-3 flex-shrink-0" />
                    <span>pls note action once done cannot be reset</span>
                  </div>
                  {errorMsg && (
                    <div className="text-[10px] text-red-500 font-mono mt-1">{errorMsg}</div>
                  )}
                  <button
                    onClick={handleUsernameSubmit}
                    disabled={isVerifying}
                    className="w-full mt-4 bg-brand-green hover:bg-brand-green-glow disabled:bg-neutral-800 text-black disabled:text-neutral-500 font-semibold py-1.5 rounded text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Submit Username</span>
                    )}
                  </button>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="setup-confirmed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-brand-dark border border-neutral-800 rounded-xl p-5 w-72 shadow-xl z-10 text-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-brand-green mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-neutral-200 mb-1">Username Configured!</h4>
                  <p className="text-xs text-neutral-400 font-mono mb-4">Target: {username || "demo_user"}</p>
                  
                  <div className="bg-brand-black p-2.5 rounded border border-neutral-900 text-left">
                    <div className="text-[10px] text-neutral-500 font-mono">Current Popup Path:</div>
                    <div className="text-xs text-brand-green font-mono">./frontend/streak.html</div>
                  </div>

                  <button
                    onClick={() => setActiveStep(2)}
                    className="w-full mt-4 bg-transparent border border-neutral-850 hover:border-neutral-700 text-neutral-300 font-semibold py-1.5 rounded text-xs transition-colors"
                  >
                    Simulate Lock Redirection
                  </button>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-sm text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_-3px_rgba(239,68,68,0.2)]">
                    <Lock className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200">DevGuard Redirect Active</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Web traffic blocked. Resolve the LeetCode daily challenge to resume general browsing.
                    </p>
                  </div>

                  <div className="bg-brand-dark border border-neutral-850 p-3 rounded-lg flex items-center justify-between text-left">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-neutral-500 font-mono">Simulated action:</div>
                      <div className="text-xs text-neutral-300 font-semibold">Try opening YouTube</div>
                    </div>
                    <button
                      onClick={handleSimulateRedirect}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-350 text-xs px-3 py-1 rounded transition-colors font-mono"
                    >
                      Trigger Test
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveStep(3)}
                    className="text-xs text-brand-green hover:underline font-mono"
                  >
                    Proceed to solving step &rarr;
                  </button>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  key="solve"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-brand-dark border border-neutral-850 rounded-xl p-5 shadow-2xl flex flex-col space-y-4"
                >
                  {/* Mock LeetCode Question Header */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />
                      <span className="font-mono text-xs font-semibold text-neutral-200">189. Rotate Array</span>
                    </div>
                    <span className="text-[10px] text-brand-yellow font-mono border border-brand-yellow/30 bg-brand-yellow/5 px-2 py-0.5 rounded">
                      Medium
                    </span>
                  </div>

                  {/* Simulator action panel */}
                  <div className="bg-brand-black p-3 rounded border border-neutral-900 space-y-3">
                    {leetSolved ? (
                      <div className="flex items-center space-x-2.5 py-1">
                        <CheckCircle2 className="w-5 h-5 text-brand-green" />
                        <div>
                          <div className="text-xs text-brand-green font-semibold">Submission Accepted!</div>
                          <div className="text-[10px] text-neutral-500 font-mono">Verified via alfa-leetcode-api</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400 font-mono">Status: Pending Solve</span>
                        <button
                          onClick={handleVerifySolve}
                          disabled={isVerifying}
                          className="bg-brand-green text-black font-semibold text-xs px-3 py-1 rounded hover:bg-brand-green-glow transition-colors flex items-center space-x-1"
                        >
                          {isVerifying ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <span>Submit Solution</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Extension Popover Simulator Output */}
                  {leetSolved && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-brand-green/30 bg-brand-green/5 p-3 rounded-lg text-center"
                    >
                      <div className="text-xs text-neutral-300 font-medium flex items-center justify-center space-x-1.5">
                        <Unlock className="w-3.5 h-3.5 text-brand-green" />
                        <span>Web Unlocked! Redirection disabled.</span>
                      </div>
                      <div className="mt-2 text-[10px] text-neutral-400 font-mono">
                        Streak popup count: <span className="text-brand-green font-bold">{streakCount} problems</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

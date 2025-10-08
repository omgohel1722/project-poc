import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getData } from "../services/api-services";
import { apiPaths } from "../constants/apiPaths";

const Dashboard = () => {
  const { instance, accounts } = useMsal();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accounts.length > 0) {
      setUserInfo(accounts[0]);
      setLoading(false);
    }
  }, [accounts]);

  const getRedirectUri = () => {
    return window.location.origin + "/";
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: getRedirectUri(),
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const logout = async () => {
    await getData(apiPaths.LOGOUT, "POST", null, token);
  };

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      try {
        // Call your feedback API - pass the token and feedback message
        const response = await getData(
          apiPaths.CREATE_MESSAGE,
          "POST",
          { text: feedback },
          token
        );

        // If API call is successful, show submitted state
        setFeedbackSubmitted(true);

        setTimeout(() => {
          setFeedback("");
          setFeedbackSubmitted(false);
        }, 3000);
      } catch (error) {
        setFeedbackSubmitted(false);
        // Optionally handle error (show error message to user)
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <div className="text-white text-xl font-semibold">
            Loading Dashboard...
          </div>
          <div className="text-slate-400 text-sm mt-2">
            Preparing your analytics experience
          </div>
        </div>
      </div>
    );
  }

  const userName = userInfo?.name || "User";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -left-64 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-64 -right-64 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl animate-pulse"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Modern Tech Logo */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                {/* Animated Hexagon Logo */}
                <div className="w-10 h-10 relative">
                  {/* Outer hexagon */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rotate-45 transform transition-transform duration-300 group-hover:rotate-90"></div>
                  {/* Inner hexagon */}
                  <div className="absolute inset-1 bg-slate-900 rotate-45"></div>
                  {/* Center dot */}
                  <div className="absolute inset-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                  {/* Animated particles */}
                  <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                  <div
                    className="absolute bottom-1 left-1 w-1 h-1 bg-purple-400 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-semibold">
                  {userName.charAt(0)}
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{userName}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  logout();
                }}
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Chat Container */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Welcome Message */}
            <div className="p-6 sm:p-8 border-b border-white/10">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-6 shadow-lg border border-white/20">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Dear {firstName},
                    </h2>
                    <div className="text-slate-200 leading-relaxed space-y-3 text-sm">
                      <p>
                        We're absolutely delighted to have you join our platform
                        today! Your journey towards data-driven excellence
                        starts right here, and we couldn't be more excited to be
                        part of it.
                      </p>
                      <p>
                        As you explore the dashboard, you'll discover a world of
                        possibilities designed specifically to streamline your
                        workflow and enhance your decision-making process. Every
                        feature has been carefully crafted with your success in
                        mind, ensuring that complex data becomes simple,
                        actionable insights.
                      </p>
                      <p>
                        Our team has worked tirelessly to create an experience
                        that not only meets your needs but exceeds your
                        expectations. From real-time updates to comprehensive
                        reporting tools, everything is at your fingertips, ready
                        to help you achieve your goals more efficiently than
                        ever before.
                      </p>
                      <p>
                        Below, you'll find a helpful tutorial video that walks
                        you through the essential features and functionalities.
                        We highly recommend taking a few minutes to watch it –
                        it's packed with tips and tricks that will help you get
                        the most out of your experience from day one.
                      </p>
                      <p className="font-medium text-blue-300">
                        Your feedback matters to us! Feel free to share your
                        thoughts, suggestions, or any questions in the section
                        below. We're here to ensure your experience is nothing
                        short of exceptional!
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      {new Date().toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="p-6 sm:p-8 border-b border-white/10">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12">
                  {/* Spacer for alignment */}
                </div>
                <div className="flex-1">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-5 shadow-lg border border-white/20">
                    <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      Getting Started Tutorial
                    </h3>
                    <div
                      className="relative rounded-xl overflow-hidden shadow-xl"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/YZZcnFKMSM0?si=N-ZwbobI7WPRdgyh"
                        title="Tutorial Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      Watch this comprehensive guide to maximize your platform
                      experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-semibold">
                      {userName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    Share Your Feedback
                  </h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="We'd love to hear your thoughts, suggestions, or any questions you might have..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-white placeholder-slate-400"
                    rows="5"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-400">
                      {feedback.length > 0
                        ? `${feedback.length} characters`
                        : "Start typing..."}
                    </span>
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedback.trim() || feedbackSubmitted}
                      className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                        feedbackSubmitted
                          ? "bg-green-500 text-white cursor-default"
                          : feedback.trim()
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          : "bg-white/10 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {feedbackSubmitted ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Submitted!
                        </>
                      ) : (
                        <>
                          Submit Feedback
                          <svg
                            className="w-5 h-5 rotate-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 text-sm text-slate-400">
            <p>Thank you for being a valued member of our community</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getData } from "../services/api-services";
import { apiPaths } from "../constants/apiPaths";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import images
import bgImage from "../assets/bg-image.jpg";
import atqorLogo from "../assets/atqorLogo.png";
// import ceoImage from "../assets/atqorLogo.jpg";

const Dashboard = () => {
  const { accounts } = useMsal();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [fileType, setFileType] = useState("");

  const token = localStorage.getItem("accessToken");

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

  const videoLinks = [
    "https://www.youtube.com/embed/YZZcnFKMSM0",
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/ysz5S6PUM-U",
    "https://www.youtube.com/embed/ScMzIvxBSi4",
    "https://www.youtube.com/embed/aqz-KE-bpKQ",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (accounts.length > 0) {
      setUserInfo(accounts[0]);
      setLoading(false);
    }
  }, [accounts]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 >= videoLinks.length ? 0 : prev + 3));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(videoLinks.length - 3, 0) : Math.max(prev - 3, 0)
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Only image or video files are allowed!");
      return;
    }
    if (isImage && selectedFile.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB!");
      return;
    }
    if (isVideo && selectedFile.size > MAX_VIDEO_SIZE) {
      toast.error("Video size must be less than 20MB!");
      return;
    }

    setFileType(isImage ? "image" : "video");
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setFileBase64(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileBase64("");
    setFileType("");
  };

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      try {
        const payload = {
          text: feedback,
          fileUrl: fileBase64 || null,
        };
        await getData(apiPaths.CREATE_MESSAGE, "POST", payload, token);
        setFeedbackSubmitted(true);
        toast.success("Feedback submitted successfully!");
        setTimeout(() => {
          setFeedback("");
          setFeedbackSubmitted(false);
          handleRemoveFile();
        }, 3000);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setFeedbackSubmitted(false);
        toast.error("Failed to submit feedback!");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <div className="text-slate-800 text-xl font-semibold">
            Loading Dashboard...
          </div>
          <div className="text-slate-600 text-sm mt-2">
            Preparing your analytics experience
          </div>
        </div>
      </div>
    );
  }

  const userName = userInfo?.name || "User";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen relative font-['Poppins']">
      {/* ✅ Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8fafc",
          opacity: 0.9,
        }}
      />

      <ToastContainer />

      {/* ✅ Header */}
      <header className="relative w-full h-[300px] flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <img src={atqorLogo} alt="atQor Logo" className="h-10" />
          <h1 className="text-4xl font-bold text-[#000000]">
            Wali Diwali <span className="text-[#000000]">@2025</span>
          </h1>
        </div>
        <p className="text-lg text-gray-700">
          Where tradition meets taste, and gifting gets a glow-up
        </p>
      </header>

      <main className="relative pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* ✅ Diwali Message Section */}
          <div className="bg-[#FBEEDE9E] rounded-3xl shadow-2xl p-8 mb-8 border border-[#B99C66]">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Dear {firstName},
              </h2>

              <p className="text-gray-700 leading-relaxed">
                This Diwali, as we celebrate light, warmth, and new beginnings,
                we want to recognize the strength, resilience, and unity that
                you — and your family — bring to atQor.
              </p>

              <h3 className="text-xl font-semibold italic text-orange-800 mb-3">
                Crafted with Heart, Rooted in India
              </h3>
              <p className="text-gray-700">
                This Diwali, we go beyond gifting — we create experiences that
                connect hearts, celebrate traditions, and strengthen
                relationships.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  Each hamper is a fusion of cultural richness and modern
                  elegance, thoughtfully curated to reflect the spirit of the
                  festival.
                </p>
                <p>
                  From brass bell essentials to scented candles and premium dry
                  fruits, every item tells a story of care, celebration, and
                  Indian craftsmanship.
                </p>
                <p>
                  Sourced from local artisans, our hampers proudly support the
                  Make in India initiative, honoring the legacy of handmade
                  excellence.
                </p>
                <p>
                  With sustainable packaging and reusable elements, we embrace
                  eco-conscious values while preserving festive charm.
                </p>

                <p className="font-semibold italic text-orange-800 mb-3">
                  Let this gift be more than a gesture — let it be a heartfelt
                  experience that lingers long after the festivities.
                </p>

                <p>
                  Our wellness initiatives this year were just one part of our
                  dedication to each of you as a valued member of the atQor
                  family. We know that behind each success is the support and
                  care of your family, who share in your efforts and
                  achievements.
                </p>

                <p>
                  This Diwali, we thank you and your loved ones for being part
                  of our journey. May the season bring joy and warmth to all.
                </p>

                <p className="font-semibold italic text-orange-800 mb-3">
                  atQor Wali Diwali, unwrap joy in every jar.
                </p>

                <p className="text-gray-600 italic">
                  Thank you for being a part of our journey.
                </p>
              </div>

              {/* ✅ Signature */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-700 mb-4">With gratitude,</p>
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/ceo-image.jpg"
                    alt="CEO"
                    className="w-16 h-16 rounded-full border-2 border-orange-200 shadow-lg"
                  />
                  <div>
                    <div className="font-bold text-gray-800 text-lg">
                      Pushkaraj Kale
                    </div>
                    <div className="text-gray-600">CEO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Video Carousel Section */}
          <div className="bg-[#FBEEDE9E] rounded-3xl shadow-2xl p-8 mb-8 border border-[#B99C66] relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Leadership Diwali wishes Video Title
            </h2>

            {/* Carousel */}
            <div className="overflow-hidden relative">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${
                    (currentIndex / videoLinks.length) * 100
                  }%)`,
                }}
              >
                {videoLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-1/3 px-2"
                    style={{ minWidth: "33.3333%" }}
                  >
                    <div className="rounded-xl overflow-hidden shadow-md">
                      <iframe
                        className="w-full h-48"
                        src={`${link}?rel=0`}
                        title={`Video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-[#B99C66] text-white px-3 py-2 rounded-full shadow-md hover:bg-[#a07e3a]"
              >
                ❮
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#B99C66] text-white px-3 py-2 rounded-full shadow-md hover:bg-[#a07e3a]"
              >
                ❯
              </button>
            </div>
          </div>

          {/* ✅ Feedback Section */}
          <div className="bg-[#FBEEDE9E] rounded-3xl shadow-2xl p-8 mb-8 border border-[#B99C66] relative">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                {userName} Share Your Diwali Wishes
              </h2>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your wishes, images, or videos..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                rows="5"
              />

              <div className="mt-4">
                <input
                  type="file"
                  id="feedback-file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={!!file}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("feedback-file").click()
                  }
                  disabled={!!file}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-xl font-medium ${
                    file ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                >
                  {file ? "File Selected" : "Upload Image/Video"}
                </button>

                {file && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-slate-600">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 text-sm hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim() || feedbackSubmitted}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    feedbackSubmitted
                      ? "bg-green-500 text-white"
                      : feedback.trim()
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {feedbackSubmitted ? "Submitted!" : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

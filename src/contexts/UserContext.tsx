import React, { createContext, useState, ReactNode, useEffect } from 'react';
import run from '../gemini';

export const datacontext = createContext<any>(null);

interface Props {
  children: ReactNode;
}

// Tour configuration
const TOUR_STEPS = [
  { path: "/", message: "Welcome to Bytex. Starting your project tour. This is the Entry of the project.", delay: 5000 },
  { path: "/recommendations", message: "This is the recommendations hub. Here you can explore all recommendation types. their are 4 recommendations that bytex is providing lets see what are they", delay: 7000 },
  { path: "/recommendations/academics", message: "First is the academics recommendation . Upload your curriculum to get laptop suggestions. ", delay: 7000 },
  { path: "/recommendations/grades", message: "This is the grade recommendation . Upload your GradeSheet to get Laptop Recommendation", delay: 7000 },
  { path: "/recommendations/seniors", message: "This is the senior recommendation .  here you can see What your seniors buy in your college", delay: 7000 },
  { path: "/recommendations/hobby", message: "This is the hobby recommendation page. Select your hobbies to get the best laptop suggestions.", delay: 7000 },
  { path: null, message: "also you can Buy Laptop from Bytex you just have to click on any of the laptop you will see Details of the laptop. And this was the Tour of Bytex . if You need something i am Here to help you Ask me anything related to Bytex i will guide you", delay: 8000 },
];

function UserContext({ children }: Props) {
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [promptText, setPromptText] = useState<string>("Listening...");
  const [response, setresponse] = useState<boolean>(false);

  function speak(text: string) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-IN";
    text_speak.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(text_speak);
  }

  // Resume tour on page load
  useEffect(() => {
    const tourInProgress = localStorage.getItem("tourInProgress");
    if (tourInProgress) {
      const currentStep = parseInt(localStorage.getItem("tourStep") || "0");
      if (currentStep < TOUR_STEPS.length) {
        const step = TOUR_STEPS[currentStep];
        setSpeaking(true);
        speak(step.message);
        setPromptText(step.message);
        setresponse(true);

        const navigationTimeout = setTimeout(() => {
          const nextStep = currentStep + 1;
          if (nextStep < TOUR_STEPS.length) {
            localStorage.setItem("tourStep", nextStep.toString());
            const nextPath = TOUR_STEPS[nextStep].path;
            if (nextPath) {
              window.location.href = nextPath;
            } else {
              localStorage.removeItem("tourInProgress");
              localStorage.removeItem("tourStep");
              setSpeaking(false);
            }
          } else {
            localStorage.removeItem("tourInProgress");
            localStorage.removeItem("tourStep");
            setSpeaking(false);
          }
        }, step.delay);

        return () => clearTimeout(navigationTimeout);
      }
    }
  }, []);

  function takecommand(command: string) {
    if (command.includes("open") && command.includes("youtube")) {
      speak("Zara is opening YouTube");
      setPromptText("Zara is opening YouTube....");
      setTimeout(() => {
        window.location.href = "https://www.youtube.com/";
      }, 2000);
    }

    else if (
      command.includes("grade sheet") ||
      command.includes("gradesheet") ||
      (command.includes("show") && command.includes("grade")) ||
      (command.includes("show") && command.includes("gradesheet"))
    ) {
      const url = "http://localhost:8080/recommendations/grades";

      speak("Opening grade sheet laptop recommendations");
      speak("Sir please upload your gradeSheet to see the best Laptop Recommendation based your Academic Perfomance")
      setPromptText("Sir please upload your gradeSheet to see the best Laptop Recommendation based your Academic Perfomance");
      setTimeout(() => {
        window.location.href = url;
      }, 2000);

      setTimeout(() => {
        setSpeaking(false);
      }, 4000);
    }

    else if (
      command.includes("senior") ||
      command.includes("seniors") ||
      (command.includes("show") && command.includes("seniors")) ||
      (command.includes("open") && command.includes("seniors")) ||
      command.includes("recommendation seniors") ||
      command.includes("seniors recommendation")
    ) {
      const url = "http://localhost:8080/recommendations/seniors";

      speak("Opening laptop recommendations based on senior suggestions");
      speak("Sir please select your college Name to What your senior buy in your college")
      setPromptText("Sir please select your college Name to What your senior buy in your college");
      setTimeout(() => {
        window.location.href = url;
      }, 2000);

      setTimeout(() => {
        setSpeaking(false);
      }, 4000);
    }

    else if (
      command.includes("hobby") ||
      (command.includes("show") && command.includes("hobby")) ||
      (command.includes("open") && command.includes("hobby")) ||
      command.includes("hobby recommendation") ||
      command.includes("recommendation hobby") ||
      command.includes("laptop for hobby")
    ) {
      const url = "http://localhost:8080/recommendations/hobby";

      speak("Opening hobby based laptop recommendations");
      speak("Sir please select your hobbies to see best laptops Recommendations ");
      setPromptText("Sir please select your hobbies to see best laptops Recommendations ");
      setTimeout(() => {
        window.location.href = url;
      }, 2000);

      setTimeout(() => {
        setSpeaking(false);
      }, 4000);
    }

    else if (
      command.includes("academic") ||
      command.includes("academics") ||
      (command.includes("show") && command.includes("academics")) ||
      (command.includes("open") && command.includes("academics")) ||
      command.includes("academic recommendation") ||
      command.includes("recommendation academics") ||
      command.includes("laptop for studies") ||
      command.includes("study laptop")
    ) {
      const url = "http://localhost:8080/recommendations/academics";

      speak("Opening academic based laptop recommendations");
      speak("sir Please upload your Academic Curriculum to see Best Laptops");
      setPromptText("Opening academic based laptop recommendations...");
      setTimeout(() => {
        window.location.href = url;
      }, 2000);

      setTimeout(() => {
        setSpeaking(false);
      }, 4000);
    }

    else if (command.includes("date")) {
      const today = new Date();
      const dateStr = today.toDateString();
      speak(`Today is ${dateStr}`);
      setPromptText(`Today is ${dateStr}`);
    }

    else if (command.includes("time")) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      speak(`The current time is ${timeStr}`);
      setPromptText(`The current time is ${timeStr}`);
    }

    else if (command.includes("hello") || command.includes("hi")) {
      speak("Hello! How can Zara help you today?");
      setPromptText("Hello! How can Zara help you today?");
    }

    else if (command.includes("who are you")) {
      speak("I am Zara, your personal AI assistant. made by harshu ");
      setPromptText("I am Zara, your personal AI assistant.");
    }

    else if (
      command.includes("tour") ||
      command.includes("what is project") ||
      command.includes("project") ||
      command.includes("show me project")
    ) {
      setSpeaking(true);
      localStorage.setItem("tourInProgress", "true");
      localStorage.setItem("tourStep", "0");
      
      const step = TOUR_STEPS[0];
      speak(step.message);
      setPromptText(step.message);
      setresponse(true);

      setTimeout(() => {
        localStorage.setItem("tourStep", "1");
        window.location.href = TOUR_STEPS[1].path!;
      }, step.delay);
    }

    else {
      aiResponse(command);
    }
  }

  async function aiResponse(prompt: string) {
    const text = await run(prompt);
    let newtext =
      text.split("**") &&
      text.split("*") &&
      text.replace("google", "Harshu") &&
      text.replace("Google", "Harshu");

    setPromptText(newtext);
    speak(newtext);
    setresponse(true);

    setTimeout(() => {
      setSpeaking(false);
    }, 5005);
  }

  const SpeechRecognition: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.onresult = (e: any) => {
    const transcript = e.results[0][0].transcript;
    takecommand(transcript.toLowerCase());
  };

  let value = {
    recognition,
    speaking,
    setSpeaking,
    promptText,
    setPromptText,
    response,
    setresponse,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
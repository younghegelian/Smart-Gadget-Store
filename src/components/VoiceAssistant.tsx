// src/components/VoiceAssistant.tsx
import React, { useContext } from "react";
// import va from "@/assets/ai.png";
// import speakingimg from "@/assets/speak.gif";
// import aiimg from "@/assets/aiVoice.gif";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "@/contexts/UserContext";

export default function VoiceAssistant() {
  const { recognition, speaking, setSpeaking, promptText, response, setresponse, setPromptText } =
    useContext(datacontext);

  if (!recognition) {
    return <div className="p-2 text-sm text-muted-foreground">Voice assistant not supported in this browser.</div>;
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 p-4 bg-card rounded-lg shadow-md text-center">
      {/* <img src={} alt="Zara" className="mx-auto w-24 h-24" /> */}
      <div className="mt-2 font-semibold">I'm Zara, your Voice Assistant</div>

      {!speaking ? (
        <button
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
          onClick={() => {
            setPromptText("Listening...");
            setSpeaking(true);
            setresponse(false);
            recognition.start();
          }}
        >
          Start Listening <CiMicrophoneOn />
        </button>
      ) : (
        <div className="mt-3">
          {/* {!response ? (
            // <img src={speakingimg} alt="listening" className="mx-auto w-20 h-20" />
          ) : (
            // <img src={aiimg} alt="processing" className="mx-auto w-20 h-20" />
          )} */}
          <p className="mt-2 text-sm">{promptText}</p>
        </div>
      )}
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMsg {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest when messages change
  useEffect(() => {
    if (open) {
      setTimeout(
        () =>
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          }),
        100
      );
    }
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const msg = input.trim();

    // Show user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      // 🔴 FIXED: backend expects { prompt: "..."} not { message: "..." }
      const res = await axiosInstance.post("/chatbot/chat", {
        prompt: msg,
      });

      // Try to get AI reply from several possible fields
      const replyText =
        res.data?.reply ||
        res.data?.answer ||
        res.data?.message ||
        "I couldn't understand that, please try again.";

      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong talking to the chatbot. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Chat Button (above compare button) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-6 z-40 cursor-pointer bg-purple-600 hover:bg-purple-700 
                   text-white p-4 rounded-full shadow-xl flex items-center justify-center"
      >
        <MessageCircle size={22} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[360px] max-h-[520px] bg-card shadow-xl 
                       rounded-xl border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-semibold text-sm">AI Laptop Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hover:bg-white/10 rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="p-3 flex-1 overflow-y-auto space-y-3 text-sm bg-background"
            >
              {messages.length === 0 && (
                <div className="text-xs text-muted-foreground text-center mt-4">
                  Ask anything about laptops, specs, branches, or our recommendations.
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "bot" && (
                    <div className="mt-1">
                      <Bot className="text-purple-500" size={16} />
                    </div>
                  )}

                  <div
                    className={`px-3 py-2 rounded-lg max-w-[75%] shadow-sm ${
                      m.sender === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.sender === "user" && (
                    <div className="mt-1">
                      <User className="text-blue-500" size={16} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-150" />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-300" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask your doubt..."
                className="flex-1 px-3 py-2 text-xs rounded-md border bg-card focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-md flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

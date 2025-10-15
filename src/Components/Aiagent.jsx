import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import "../STYLE/Aiagent.css";
import "aos/dist/aos.css";

export default function ChatbotUI() {
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! 👋 I'm HeartCare-GPT. How can I help you today?", isHtml: false },
  ]);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const chatBodyRef = useRef(null);
useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const initRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition");
      return null;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    return recognition;
  };

  const startListening = () => {
    if (!recognitionRef.current) recognitionRef.current = initRecognition();
    recognitionRef.current?.start();
  };

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmedMessage, isHtml: false }]);
    setInput("");

    setLoading(true);
    setMessages((prev) => [...prev, { sender: "ai", text: "", isHtml: false, typing: true }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await res.json();
      
      let reply = data.reply || "Sorry, I could not understand.";
       reply = reply.replace(/\*\*/g, " ");

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "ai",
          text: reply,
          isHtml: true, 
          typing: false,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: "Sorry, something went wrong. Please try again.", isHtml: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="chat-container" data-aos="zoom-in">
      <div className="chat-header">🤖 HeartCare-GPT</div>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, idx) =>
          msg.typing ? (
            <div key={idx} className="message ai">
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          ) : msg.isHtml ? (
            <div
              key={idx}
              className={`message ${msg.sender}`}
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ) : (
            <div key={idx} className={`message ${msg.sender}`} style={{ whiteSpace: "pre-wrap" }}  data-aos={msg.sender=='ai'?'fade-left':'fade-right'}>
              {msg.text}
            </div>
          )
        )}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim()}>
          <Send size={20} />
        </button>
        <button className={`mic-btn ${listening ? "listening" : ""}`} onClick={startListening}>
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
}

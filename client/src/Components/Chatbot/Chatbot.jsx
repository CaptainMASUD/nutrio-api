"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your legal assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("lawyer") || lowerMessage.includes("attorney")) {
      return "I can help you find a qualified lawyer! Please tell me what type of legal issue you're facing - family law, property disputes, immigration, or something else?"
    }

    if (lowerMessage.includes("case") || lowerMessage.includes("submit")) {
      return "To submit your case, you'll need to provide case details and any relevant documents. Would you like me to guide you through the case submission process?"
    }

    if (lowerMessage.includes("cost") || lowerMessage.includes("free") || lowerMessage.includes("price")) {
      return "Our platform connects you with volunteer lawyers who provide free legal aid. There are no fees for using our matching service or accessing legal resources."
    }

    if (lowerMessage.includes("document") || lowerMessage.includes("verification")) {
      return "Our document verification system uses blockchain technology to ensure authenticity. You can upload documents securely and track their verification status in real-time."
    }

    return "I understand you need legal assistance. I can help you with finding lawyers, submitting cases, accessing legal resources, or answering questions about our services. What would you like to know more about?"
  }

  const quickActions = ["Find a lawyer", "Submit my case", "Legal resources", "How it works"]

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center ${
          isOpen ? "bg-red-500 hover:bg-red-600 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-slate-200 rounded-lg shadow-xl z-40 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-cyan-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Legal Assistant</span>
              </div>
              <p className="text-xs text-cyan-100 mt-1">Online • Ready to help</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === "user" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === "bot" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-600" />}
                        <p className="text-sm">{message.text}</p>
                        {message.sender === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <motion.div
                className="px-4 pb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action}
                      onClick={() => setInputMessage(action)}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-amber-500 hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot

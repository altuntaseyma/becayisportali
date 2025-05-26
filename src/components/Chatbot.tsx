import React, { useState, useRef, useEffect } from 'react';
import { ChatbotMessage, chatbotCategories } from '../data/chatbotData';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchWeb = async (query: string): Promise<string> => {
    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
      const data = await response.json();
      return data.Abstract || 'Üzgünüm, bu konuda web\'de yeterli bilgi bulamadım.';
    } catch (error) {
      console.error('Web arama hatası:', error);
      return 'Web araması sırasında bir hata oluştu.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Önce yerel veritabanında ara
    let botResponse = findBotResponse(inputValue);

    // Eğer yerel veritabanında yanıt bulunamazsa web'de ara
    if (botResponse.includes('Üzgünüm, bu konuda bilgim yok')) {
      const webResponse = await searchWeb(inputValue + ' 657 sayılı kanun memur');
      botResponse = webResponse;
    }

    const botMessage: ChatbotMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  const findBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    for (const category of chatbotCategories) {
      for (const q of category.questions) {
        if (q.question.toLowerCase().includes(lowerInput) || 
            lowerInput.includes(q.question.toLowerCase())) {
          return q.answer;
        }
      }
    }

    return 'Üzgünüm, bu konuda bilgim yok. Lütfen başka bir soru sorun veya yukarıdaki kategorilerden birini seçin.';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Becayiş Asistanı</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { ParticleBackground } from '@/components/ui/particle-background';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGroqResponse } from '@/lib/groq';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hello! I'm the Hackaura AI Assistant. 🤖\nI'm powered by advanced AI to answer all your queries about the hackathon!",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string = inputText) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Get AI Response
            const responseText = await getGroqResponse(text);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the server. Please try again.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const suggestions = [
        "What are the prizes?",
        "When does it start?",
        "What is the venue?",
        "Who are the coordinators?",
        "Is there a registration fee?",
        "Can I stay overnight?"
    ];

    return (
        <div className="min-h-screen gradient-bg text-foreground overflow-hidden relative flex flex-col">
            <ParticleBackground />

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20 px-4 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold hidden sm:inline">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg gradient-text">Hackaura AI</span>
                    </div>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 container mx-auto px-4 pt-24 pb-4 max-w-4xl flex flex-col h-screen">
                <GlassCard className="flex-1 flex flex-col overflow-hidden border-primary/30 shadow-2xl shadow-primary/10">

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4 sm:p-6 space-y-4">
                        <div className="flex flex-col gap-4 pb-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 
                      ${msg.sender === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                                            {msg.sender === 'user' ? <User className="w-4 h-4 text-secondary" /> : <Bot className="w-4 h-4 text-primary" />}
                                        </div>

                                        {/* Bubble */}
                                        <div className={`p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-lg
                      ${msg.sender === 'user'
                                                ? 'bg-secondary/20 border border-secondary/30 text-white rounded-tr-none'
                                                : 'bg-white/5 border border-white/10 text-foreground/90 rounded-tl-none'
                                            }`}
                                        >
                                            {msg.text}
                                            <div className="text-[10px] opacity-40 mt-1 text-right">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start animate-fade-in">
                                    <div className="flex gap-3 max-w-[75%]">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-0"></div>
                                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-150"></div>
                                            <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-300"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">

                        {/* Suggestions */}
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(s)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-foreground/70 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 items-center relative">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask a question..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm sm:text-base placeholder:text-gray-500"
                            />
                            <NeonButton
                                variant="primary"
                                onClick={() => handleSendMessage()}
                                disabled={!inputText.trim() || isTyping}
                                className="px-4 py-3 rounded-xl min-w-[50px] flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </NeonButton>
                        </div>
                    </div>

                </GlassCard>
            </div>
        </div>
    );
}

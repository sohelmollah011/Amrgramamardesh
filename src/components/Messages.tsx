import React, { useState, useEffect, useRef } from 'react';
import { Member, Message } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

interface MessagesProps {
  member: Member | null;
}

export default function Messages({ member }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;
    const q = query(
      collection(db, 'chats', member.uid, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [member]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !member || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'chats', member.uid, 'messages'), {
        chatId: member.uid,
        senderId: auth.currentUser.uid,
        text: inputText.trim(),
        createdAt: serverTimestamp()
      });
      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle size={20} />
        </div>
        <div>
            <h3 className="font-bold text-gray-800 italic">অ্যাডমিন সাপোর্ট</h3>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">অনলাইন</span>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[9px] mt-1 text-right font-medium opacity-60`}>
                    {msg.createdAt ? format(msg.createdAt.toDate(), 'p', { locale: bn }) : 'এখনই'}
                </p>
              </div>
            </div>
          );
        }) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <User size={32} />
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-1">কোনো বার্তা নেই</h4>
                <p className="text-xs text-gray-400">অ্যাডমিনকে আপনার সমস্যা বা জিজ্ঞাসা লিখে পাঠান</p>
            </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="এখানে লিখুন..."
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-md shadow-blue-100"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

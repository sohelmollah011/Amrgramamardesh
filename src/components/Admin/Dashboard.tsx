import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Member, Saving } from '../../types';
import { Users, CreditCard, Bell, TrendingUp, Check, X, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'savings' | 'notices'>('members');

  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as Member)));
    });
    return () => unsubscribe();
  }, []);

  const approveMember = async (uid: string) => {
    const memberId = 'K' + Math.floor(1000 + Math.random() * 9000);
    try {
      await updateDoc(doc(db, 'members', uid), {
        status: 'active',
        memberId: memberId,
        updatedAt: serverTimestamp()
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      {/* Admin Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={18} />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">মোট সদস্য</p>
            <p className="text-2xl font-black text-gray-800 italic">{members.length}</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <ShieldAlert size={18} />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">পেন্ডিং আবেদন</p>
            <p className="text-2xl font-black text-gray-800 italic">
                {members.filter(m => m.status === 'pending').length}
            </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
        {(['members', 'savings', 'notices'] as const).map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                {tab === 'members' ? 'সদস্য' : tab === 'savings' ? 'সঞ্চয়' : 'নোটিশ'}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm min-h-[400px]">
        {activeTab === 'members' && (
            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 italic px-2 mb-4">সদস্য তালিকা</h3>
                {members.map(member => (
                    <div key={member.uid} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                                {member.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 italic">{member.fullName}</p>
                                <p className="text-[10px] text-gray-400 font-medium">আইডি: {member.memberId || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {member.status === 'pending' && (
                                <button 
                                    onClick={() => approveMember(member.uid)}
                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Check size={16} />
                                </button>
                            )}
                            <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        {activeTab === 'notices' && <NoticeEditor />}
        {activeTab === 'savings' && <SavingsManager members={members} />}
      </div>
    </div>
  );
}

function NoticeEditor() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const postNotice = async () => {
        if (!title || !content) return;
        try {
            await addDoc(collection(db, 'notices'), {
                title,
                content,
                priority: 'medium',
                createdAt: serverTimestamp()
            });
            setTitle('');
            setContent('');
            alert('নোটিশ পাবলিশ করা হয়েছে');
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-800 italic px-2 mb-4">নতুন নোটিশ তৈরি</h3>
            <input 
                type="text" 
                placeholder="শিরোনাম" 
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none outline-none focus:ring-2 focus:ring-blue-100" 
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <textarea 
                placeholder="বিস্তারিত বিবরণ..." 
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none outline-none focus:ring-2 focus:ring-blue-100 min-h-[150px]" 
                value={content}
                onChange={e => setContent(e.target.value)}
            />
            <button 
                onClick={postNotice}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
                পাবলিশ করুন
            </button>
        </div>
    );
}

function SavingsManager({ members }: { members: Member[] }) {
    const [selectedMember, setSelectedMember] = useState('');
    const [amount, setAmount] = useState('');

    const recordSaving = async () => {
        if (!selectedMember || !amount) return;
        try {
            await addDoc(collection(db, 'savings'), {
                memberId: selectedMember,
                amount: Number(amount),
                type: 'weekly',
                date: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            setAmount('');
            alert('সঞ্চয় লিপিবদ্ধ করা হয়েছে');
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-800 italic px-2 mb-4">সঞ্চয় সংগ্রহ করুন</h3>
            <select 
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none outline-none focus:ring-2 focus:ring-blue-100 appearance-none"
                value={selectedMember}
                onChange={e => setSelectedMember(e.target.value)}
            >
                <option value="">সদস্য নির্বাচন করুন</option>
                {members.filter(m => m.status === 'active').map(m => (
                    <option key={m.uid} value={m.uid}>{m.fullName} ({m.memberId})</option>
                ))}
            </select>
            <input 
                type="number" 
                placeholder="টাকার পরিমাণ (৳)" 
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none outline-none focus:ring-2 focus:ring-blue-100" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <button 
                onClick={recordSaving}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
            >
                জমা হিসেবে রেকর্ড করুন
            </button>
        </div>
    );
}

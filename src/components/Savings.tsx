import React, { useState, useEffect } from 'react';
import { Member, Saving } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Wallet, TrendingUp, Calendar, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

interface SavingsProps {
  member: Member | null;
}

export default function Savings({ member }: SavingsProps) {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!member) return;
    const q = query(
      collection(db, 'savings'),
      where('memberId', '==', member.uid),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Saving));
      setSavings(data);
      setTotal(data.reduce((acc, curr) => acc + curr.amount, 0));
    });

    return () => unsubscribe();
  }, [member]);

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={120} />
        </div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 italic">আপনার মোট সঞ্চয়</p>
        <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-900 italic">৳ {total.toLocaleString('bn-BD')}</span>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+০.৫%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-50">
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">চলতি সপ্তাহ</p>
                <p className="font-bold text-gray-800 italic">৳ ১০০.০০</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">লক্ষ্যমাত্রা</p>
                <p className="font-bold text-gray-800 italic">৳ ১০,০০০.০০</p>
            </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-100 active:scale-95">
        <Plus size={24} />
        সঞ্চয় জমা দিন
      </button>

      {/* History List */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-gray-800 italic">সঞ্চয় ইতিহাস</h3>
            <button className="text-blue-600 text-xs font-bold">ফিল্টার করুন</button>
        </div>
        <div className="space-y-3">
          {savings.length > 0 ? savings.map(saving => (
            <div key={saving.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 italic">{saving.type === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'} কিস্তি</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                            {format(saving.date.toDate(), 'dd MMMM, yyyy', { locale: bn })}
                        </p>
                    </div>
                </div>
                <div className="text-right flex items-center gap-2">
                    <span className="font-black text-gray-800 italic">৳ {saving.amount}</span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600" />
                </div>
            </div>
          )) : (
            <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Wallet size={32} />
                </div>
                <p className="text-gray-400 text-sm italic">এখনো কোনো সঞ্চয় জমা দেওয়া হয়নি</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

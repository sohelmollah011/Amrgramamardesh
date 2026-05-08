import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { db } from '../lib/firebase';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { CreditCard, Wallet, Users, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomeProps {
  member: Member | null;
}

export default function Home({ member }: HomeProps) {
  const [notices, setNotices] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalMembers: 0, totalSavings: 0 });

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">শুভেচ্ছা</p>
            <h2 className="text-2xl font-bold">{member?.fullName || 'সদস্য'}</h2>
            <p className="text-blue-200 text-xs mt-1">সদস্য আইডি: {member?.memberId || 'অপেক্ষমান'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            member?.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
          }`}>
            {member?.status === 'active' ? 'সক্রিয়' : 'অপেক্ষমান'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-600/50">
          <div>
            <p className="text-blue-200 text-[10px] uppercase mb-1">মোট সঞ্চয়</p>
            <p className="text-xl font-bold italic">৳ ৫,৪২০.০০</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-[10px] uppercase mb-1">গত মাসের সঞ্চয়</p>
            <p className="text-xl font-bold italic">৳ ৪৫০.০০</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link 
          to="/savings" 
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <span className="text-[11px] font-bold text-gray-600">জমা দিন</span>
        </Link>
        <Link 
          to="/id-card" 
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <span className="text-[11px] font-bold text-gray-600">আইডি কার্ড</span>
        </Link>
        <Link 
          to="/profile" 
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Users size={20} />
          </div>
          <span className="text-[11px] font-bold text-gray-600">আমার তথ্য</span>
        </Link>
      </div>

      {/* Notice Board */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-green-600" />
            <h3 className="font-bold text-gray-800 italic">নোটিশ বোর্ড</h3>
          </div>
          <button className="text-xs text-blue-600 font-bold flex items-center gap-1">
            সব দেখুন <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {notices.length > 0 ? notices.map(notice => (
            <div key={notice.id} className="p-3 bg-gray-50 rounded-xl border-l-4 border-blue-500">
              <h4 className="text-sm font-bold text-gray-900 mb-1">{notice.title}</h4>
              <p className="text-[11px] text-gray-500 line-clamp-1">{notice.content}</p>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-400 text-xs italic">
              বর্তমানে কোনো নতুন নোটিশ নেই
            </div>
          )}
        </div>
      </div>

      {/* Organization Stats (Public/Rural Feel) */}
      <div className="bg-green-50 rounded-3xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white">
          <Users size={24} />
        </div>
        <div>
          <p className="text-green-800 text-[10px] font-bold uppercase tracking-wider">আমাদের পরিবার</p>
          <p className="text-xl font-black text-green-900 italic">১২৪ জন সদস্য</p>
          <p className="text-green-600 text-[10px] mt-0.5 italic">প্রতিষ্ঠিত: ২০২৪</p>
        </div>
      </div>
    </div>
  );
}

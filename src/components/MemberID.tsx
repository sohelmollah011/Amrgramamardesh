import React from 'react';
import { Member } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ShieldCheck } from 'lucide-react';

interface MemberIDProps {
  member: Member | null;
}

export default function MemberID({ member }: MemberIDProps) {
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">আইডি কার্ড তৈরি হয়নি</h3>
        <p className="text-gray-500 text-sm">দয়া করে আপনার প্রোফাইল সম্পূর্ণ করুন এবং অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।</p>
      </div>
    );
  }

  const qrData = JSON.stringify({
    uid: member.uid,
    memberId: member.memberId,
    name: member.fullName,
    status: member.status
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Visual ID Card */}
      <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-[2rem] p-6 text-white shadow-2xl overflow-hidden group">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl group-hover:bg-white/10 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 rounded-full -ml-16 -mb-16 blur-xl"></div>
        
        {/* Header */}
        <div className="flex justify-between items-start relative z-10 mb-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" referrerPolicy="no-referrer" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest leading-none opacity-80">আমার গ্রাম আমার দেশ</span>
              <span className="text-xs font-black italic">কাহেনা যুব সংগঠন</span>
            </div>
          </div>
          <div className="bg-green-500/20 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-green-300 border border-green-500/30">
            {member.status === 'active' ? 'সক্রিয় সদস্য' : 'অপেক্ষমান'}
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-6 mt-4 relative z-10">
          <div className="w-24 h-24 bg-white/10 rounded-2xl border-2 border-white/20 p-1 flex items-center justify-center overflow-hidden">
            {member.documentUrl ? (
               <img src={member.documentUrl} alt="Profile" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
            ) : (
                <div className="w-full h-full bg-blue-700/50 flex items-center justify-center">
                    <span className="text-4xl">📸</span>
                </div>
            )}
          </div>
          <div className="flex-1 space-y-1.5 flex flex-col justify-center">
            <div className="space-y-0.5">
              <p className="text-[8px] uppercase tracking-widest text-blue-200">সদস্যের নাম</p>
              <h3 className="text-lg font-bold truncate leading-tight uppercase">{member.fullName}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] uppercase tracking-widest text-blue-200">সদস্য আইডি</p>
                <p className="text-sm font-mono font-bold tracking-tighter">{member.memberId || 'PENDING'}</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-blue-200">রক্তের গ্রুপ</p>
                <p className="text-sm font-bold">{member.bloodGroup || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end relative z-10">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-blue-200">পেশা</p>
              <p className="text-xs font-medium italic">{member.profession}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-widest text-blue-200">শহর/গ্রাম</p>
              <p className="text-xs font-medium italic">{member.address.village}</p>
            </div>
        </div>
      </div>

      {/* QR Code Segment */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
        <h4 className="text-sm font-bold text-gray-800 mb-6 italic">ভেরিফিকেশন কিউআর কোড</h4>
        <div className="w-48 h-48 mx-auto bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-center justify-center">
          <QRCodeSVG value={qrData} size={150} level="H" includeMargin={false} fgColor="#1e3a8a" />
        </div>
        <p className="mt-6 text-xs text-gray-400 max-w-[200px] mx-auto leading-relaxed">
          যেকোনো সাধারণ কিউআর স্ক্যানার দিয়ে স্ক্যান করে তথ্য যাচাই করুন
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all">
          <Download size={18} />
          ডাউনলোড
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95">
          <Share2 size={18} />
          শেয়ার করুন
        </button>
      </div>
    </div>
  );
}

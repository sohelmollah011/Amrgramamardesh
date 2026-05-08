import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ShieldCheck, Search, XCircle, UserCheck, QrCode, Camera } from 'lucide-react';
import { Member } from '../types';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Verify() {
  const [memberId, setMemberId] = useState('');
  const [result, setResult] = useState<Member | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scanner.render((decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.memberId) {
            setMemberId(data.memberId);
            handleVerify(data.memberId);
            scanner?.clear();
            setShowScanner(false);
          }
        } catch (e) {
          // If not our specific JSON, maybe it's just the ID string
          setMemberId(decodedText);
          handleVerify(decodedText);
          scanner?.clear();
          setShowScanner(false);
        }
      }, (error) => {
        // ignore errors
      });
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [showScanner]);

  const handleVerify = async (idToVerify?: string) => {
    const id = idToVerify || memberId;
    if (!id) return;
    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const q = query(collection(db, 'members'), where('memberId', '==', id.toUpperCase()));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setResult({ id: snap.docs[0].id, ...snap.docs[0].data() } as any);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 italic">সদস্য পদ যাচাই</h2>
        <p className="text-sm text-gray-500">আইডি কার্ডের নম্বর লিখে যাচাই করুন</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
        {showScanner ? (
          <div className="space-y-4">
            <div id="reader" className="w-full rounded-2xl overflow-hidden bg-gray-50 aspect-square"></div>
            <button 
              onClick={() => setShowScanner(false)}
              className="w-full py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="যেমন: K1234"
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-lg font-bold tracking-widest text-center uppercase focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleVerify()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-100"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search size={20} />
                    যাচাই
                  </>
                )}
              </button>
              <button
                onClick={() => setShowScanner(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-100"
              >
                <Camera size={20} />
                স্ক্যান
              </button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="bg-green-50 border border-green-100 rounded-[2.5rem] p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
            <UserCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-1">{result.fullName}</h3>
          <p className="text-green-700 text-sm font-bold uppercase tracking-widest mb-4">ভেরিফাইড সদস্য</p>
          
          <div className="bg-white/60 p-6 rounded-3xl text-left space-y-3 shadow-inner">
            <div className="flex justify-between items-center border-b border-white/50 pb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">পূর্ণ নাম</span>
                <span className="text-sm font-black text-gray-800 italic">{result.fullName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/50 pb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">আইডি নম্বর</span>
                <span className="text-sm font-black text-blue-900 font-mono italic">{result.memberId}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ঠিকানা (গ্রাম)</span>
                <span className="text-sm font-black text-gray-800 italic">{result.address.village}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 text-center animate-in shake-in duration-300">
          <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
            <XCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-1">তথ্য পাওয়া যায়নি</h3>
          <p className="text-red-700 text-sm">অনুগ্রহ করে আইডি নম্বরটি পুনরায় চেক করুন</p>
        </div>
      )}

      <div className="px-6 py-4 bg-blue-50 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
            📸
        </div>
        <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
            খুব শীঘ্রই কিউআর কোড স্ক্যানার সুবিধা যোগ করা হবে। বর্তমানে ম্যানুয়াল ভেরিফিকেশন চালু আছে।
        </p>
      </div>
    </div>
  );
}

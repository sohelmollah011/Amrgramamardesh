import React, { useState } from 'react';
import { Member, Address } from '../types';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, MapPin, Briefcase, Camera, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileSetupProps {
  member?: Member | null;
}

export default function ProfileSetup({ member }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Member>>({
    fullName: member?.fullName || '',
    fatherName: member?.fatherName || '',
    motherName: member?.motherName || '',
    dob: member?.dob || '',
    bloodGroup: member?.bloodGroup || '',
    phone: member?.phone || '',
    profession: member?.profession || '',
    address: member?.address || {
      village: '',
      postOffice: '',
      union: '',
      upazila: '',
      district: 'মুন্সীগঞ্জ',
    }
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!auth.currentUser) return;

    try {
      const memberRef = doc(db, 'members', auth.currentUser.uid);
      await setDoc(memberRef, {
        ...formData,
        uid: auth.currentUser.uid,
        status: member?.status || 'pending',
        role: member?.role || 'member',
        updatedAt: serverTimestamp(),
        ...(member ? {} : { createdAt: serverTimestamp() })
      }, { merge: true });
      
      alert('তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
      window.location.href = '/';
    } catch (error) {
      console.error("Error saving profile:", error);
      alert('সঞ্চয় করার সময় ভুল হয়েছে। পুনরায় চেষ্টা করুন।');
    }
  };

  const steps = [
    { title: 'ব্যক্তিগত তথ্য', icon: User },
    { title: 'ঠিকানা', icon: MapPin },
    { title: 'পেশা', icon: Briefcase },
    { title: 'ছবি ও দলিল', icon: Camera },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <InputField label="পূর্ণ নাম" value={formData.fullName} onChange={v => setFormData({ ...formData, fullName: v })} placeholder="সদস্যের নাম লিখুন" />
            <InputField label="পিতার নাম" value={formData.fatherName} onChange={v => setFormData({ ...formData, fatherName: v })} />
            <InputField label="মাতার নাম" value={formData.motherName} onChange={v => setFormData({ ...formData, motherName: v })} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="জন্ম তারিখ" type="date" value={formData.dob} onChange={v => setFormData({ ...formData, dob: v })} />
              <InputField label="রক্তের গ্রুপ" value={formData.bloodGroup} onChange={v => setFormData({ ...formData, bloodGroup: v })} placeholder="যেমন: O+" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <InputField label="গ্রাম" value={formData.address?.village} onChange={v => setFormData({ ...formData, address: { ...formData.address!, village: v } })} />
            <InputField label="ডাকঘর" value={formData.address?.postOffice} onChange={v => setFormData({ ...formData, address: { ...formData.address!, postOffice: v } })} />
            <InputField label="ইউনিয়ন" value={formData.address?.union} onChange={v => setFormData({ ...formData, address: { ...formData.address!, union: v } })} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="উপজেলা" value={formData.address?.upazila} onChange={v => setFormData({ ...formData, address: { ...formData.address!, upazila: v } })} />
              <InputField label="জেলা" value={formData.address?.district} onChange={v => setFormData({ ...formData, address: { ...formData.address!, district: v } })} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <InputField label="পেশা" value={formData.profession} onChange={v => setFormData({ ...formData, profession: v })} placeholder="যেমন: ছাত্র, কৃষক, ব্যবসায়ী" />
            <InputField label="মোবাইল নম্বর" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="০১XXXXXXXXX" />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Camera size={40} />
              <p className="text-sm font-medium text-center">আপনার প্রোফাইল ছবি এবং এনআইডি কার্ডের ছবি আপলোড করুন</p>
              <button className="mt-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold">ফাইল নির্বাচন করুন</button>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                * নিশ্চিত করুন যে সব তথ্য সঠিক। ভুল তথ্য প্রদান করলে সদস্যপদ বাতিল হতে পারে।
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="flex justify-between items-center mb-8 px-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              step > i + 1 ? 'bg-green-600 text-white' : 
              step === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' : 
              'bg-gray-100 text-gray-400'
            }`}>
              {step > i + 1 ? <Check size={16} /> : <s.icon size={16} />}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${
              step === i + 1 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 italic">{steps[step-1].title}</h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-10">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <ChevronLeft size={20} />
              পেছনে
            </button>
          )}
          <button
            onClick={step === 4 ? handleSubmit : nextStep}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            {step === 4 ? 'সম্পূর্ণ করুন' : 'পরবর্তী'}
            {step < 4 && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder = "" }: { label: string, type?: string, value?: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5 focus-within:text-blue-600 transition-colors">
      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-3.5 transition-all outline-none text-sm font-medium text-gray-800"
      />
    </div>
  );
}

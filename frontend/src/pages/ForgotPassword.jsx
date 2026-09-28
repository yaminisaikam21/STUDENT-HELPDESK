import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function ForgotPassword(){
  return <div className="min-h-screen bg-[#2B211B] px-4 py-10 text-[#F7F1E8] flex items-center justify-center">
    <div className="w-full max-w-md">
      <div className="mb-6 flex items-center justify-between"><Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-[#E7D8C5] hover:text-white"><ArrowLeft className="w-4"/>Back to login</Link><BrandLogo linkTo="/" light/></div>
      <div className="rounded-3xl border border-[#6B4A35] bg-[#3A2A20] p-7 sm:p-8 shadow-2xl">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4A3426] text-[#C9A66B]"><KeyRound/></div>
        <p className="section-kicker text-[#C9A66B]">Account recovery</p>
        <h1 className="mt-2 font-heading text-2xl font-extrabold">Forgot your password?</h1>
        <p className="mt-2 text-sm leading-6 text-[#B89B7A]">Password reset by email is not currently exposed by the project backend. Use the account security screen after signing in, or contact your campus administrator if you cannot sign in.</p>
        <div className="mt-6 rounded-2xl border border-[#6B4A35] bg-[#33251D] p-4"><div className="flex gap-3"><ShieldCheck className="w-5 shrink-0 text-[#C9A66B]"/><p className="text-xs leading-5 text-[#E7D8C5]">The existing backend supports authenticated password changes, so no fake reset request is sent from this screen.</p></div></div>
        <Link to="/login" className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#B58A4A] px-4 py-3 text-sm font-bold text-[#2B211B] hover:bg-[#C9A66B]">Return to sign in</Link>
      </div>
    </div>
  </div>
}

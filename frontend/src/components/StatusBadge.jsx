import React from 'react';
import {Clock,CheckCircle2,AlertCircle,XCircle,ShieldCheck,ArrowRightCircle,HelpCircle} from 'lucide-react';
export default function StatusBadge({status,type='complaint',size='sm'}){
 const s=String(status||'').trim(); let bg='bg-[#F3EBDD] text-[#6B5B4E] border-[#D8CBB9]'; let Icon=HelpCircle;
 if(s==='Pending'){bg='bg-[#F7EEDB] text-[#7A563D] border-[#DCC7AF]';Icon=Clock}
 else if(s==='Assigned'||s==='In Progress'){bg='bg-[#EDE0D0] text-[#6B4A35] border-[#CDB59B]';Icon=ArrowRightCircle}
 else if(['Resolved','Approved','Completed','Verified'].includes(s)){bg='bg-[#EEE7DE] text-[#5B3D2C] border-[#CDBDAA]';Icon=CheckCircle2}
 else if(['Rejected','Failed'].includes(s)){bg='bg-[#EFE2DB] text-[#744638] border-[#D8B7AA]';Icon=XCircle}
 else if(s==='Parent Verification'){bg='bg-[#F7EEDB] text-[#7A563D] border-[#DCC7AF]';Icon=ShieldCheck}
 else if(s==='Warden Review'){bg='bg-[#EDE0D0] text-[#6B4A35] border-[#CDB59B]';Icon=Clock}
 const sizeClasses=size==='xs'?'text-[11px] px-2 py-0.5':size==='md'?'text-sm px-3 py-1':'text-xs px-2.5 py-0.5';
 return <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${bg} ${sizeClasses}`}><Icon className={size==='xs'?'w-3 h-3':size==='md'?'w-4 h-4':'w-3.5 h-3.5'}/><span>{s}</span></span>
}
export function PriorityBadge({priority}){const p=String(priority||'Medium').trim();const color=p==='Low'?'bg-[#EEE7DE] text-[#5B3D2C] border-[#CDBDAA]':p==='High'?'bg-[#F7EEDB] text-[#7A563D] border-[#DCC7AF]':p==='Urgent'?'bg-[#EFE2DB] text-[#744638] border-[#D8B7AA] font-semibold':'bg-[#EDE0D0] text-[#6B4A35] border-[#CDB59B]';return <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${color}`}>{p}</span>}

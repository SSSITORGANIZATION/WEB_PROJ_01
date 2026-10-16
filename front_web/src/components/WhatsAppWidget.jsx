import React, { useState } from 'react';
import { X, MessageCircle, Send, Mail } from 'lucide-react';

// WhatsApp @username link (new WhatsApp username feature — no phone number exposed)
const WHATSAPP_USERNAME = '7993477794';

// Default quick requirements shown as chips
const DEFAULT_REQUIREMENTS = [
  'UI/UX Design',
  'Web Development',
  'Mobile App Development',
  'Cloud & DevOps',
  'AI Integration',
  'E-Commerce Solution',
];

// Email used by the mail icon
const CONTACT_EMAIL = 'sudarsanbandapalli@gmail.com';

// Build a professional WhatsApp message from the selected requirement + custom text
const buildMessage = (header, customText) => {
  const lines = [
    'Hello SA Technologies 👋',
    '',
    "I'm interested in your services.",
    '',
    `Requirement: ${header}`,
  ];
  if (customText && customText.trim()) {
    lines.push('', 'Additional details:', customText.trim());
  }
  lines.push('', 'Please get in touch with me.');
  return lines.join('\n');
};

const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const [activeReq, setActiveReq] = useState(null);
  const [customText, setCustomText] = useState('');

  const header = activeReq || 'General Enquiry';

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${WHATSAPP_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSend = () => {
    openWhatsApp(buildMessage(header, customText));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Expandable panel */}
      {open && (
        <div className="w-72 origin-bottom-right rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20">
          {/* Panel header */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/10">
                <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight text-slate-900">Chat with us</p>
                <p className="text-[11px] text-slate-500">Typically replies instantly</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick requirement chips */}
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            What do you need?
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {DEFAULT_REQUIREMENTS.map((req) => (
              <button
                key={req}
                type="button"
                onClick={() => setActiveReq(activeReq === req ? null : req)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${activeReq === req
                  ? 'border-[#25D366] bg-[#25D366] text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#128C4A]'
                  }`}
              >
                {req}
              </button>
            ))}
          </div>

          {/* Selected requirement header */}
          <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
            Sending as: <span className="font-semibold text-slate-900">{header}</span>
          </div>

          {/* Custom requirement input */}
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            placeholder="Type your requirement here..."
            className="mb-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
          />

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send on WhatsApp
          </button>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        title="Chat with us on WhatsApp"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/30 ring-1 ring-white/20 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.371-.03-.52-.087-.148-.66-1.59-.904-2.178-.238-.573-.48-.495-.66-.504-.17-.008-.364-.01-.558-.01-.193 0-.507.073-.772.372-.266.297-1.012.988-1.012 2.41 0 1.422 1.036 2.794 1.18 2.99.144.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>

      {/* Mail button */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label="Send us an email"
        title="Email us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-white/20 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <Mail className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
};

export default WhatsAppWidget;

import React from "react";
import { DollarSign, Receipt, Calculator } from "lucide-react";

const TOOLS = [
  { value: "currency", label: "Currency Converter", icon: DollarSign },
  { value: "gst",      label: "GST Calculator",     icon: Receipt    },
  { value: "emi",      label: "EMI Calculator",      icon: Calculator },
];

const ToolSelector = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {TOOLS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            selected === value
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
              : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default ToolSelector;

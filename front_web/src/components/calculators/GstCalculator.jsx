import React, { useState } from "react";

const GST_RATES = [
  { label: "Nil GST (0%)", value: 0 },
  { label: "GST 5%", value: 5 },
  { label: "GST 12%", value: 12 },
  { label: "GST 18%", value: 18 },
  { label: "GST 28%", value: 28 },
];

const GstCalculator = () => {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!amount) return;

    const base = Number(amount);
    const gst = (base * gstRate) / 100;
    setResult({
      gst,
      total: base + gst,
    });
    
    // Scroll to results after calculation
    setTimeout(() => {
      const resultElement = document.getElementById('gst-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleReset = () => {
    setAmount("");
    setGstRate(18);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Amount */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Base Amount (₹)
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
        />
      </div>

      {/* GST Rate */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          GST Rate
        </label>
        <select
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          value={gstRate}
          onChange={(e) => setGstRate(Number(e.target.value))}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          {GST_RATES.map((r) => (
            <option key={r.value} value={r.value} className="bg-slate-900 text-white">
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCalculate}
          disabled={!amount}
        >
          Calculate
        </button>

        <button
          className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Result */}
      {result && (
        <div id="gst-result" className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
          <div className="text-white">
            <div className="text-sm text-slate-300 mb-3">GST Calculation Result</div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">GST Amount</span>
                <span className="text-xl font-bold text-green-400">₹{result.gst.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">Total Amount</span>
                <span className="text-xl font-bold text-emerald-400">₹{result.total.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                GST Rate: {gstRate}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GstCalculator;

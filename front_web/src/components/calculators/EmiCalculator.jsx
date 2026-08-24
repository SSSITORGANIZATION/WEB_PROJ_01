import React, { useState } from "react";

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState(null);

  const handleCalculate = () => {
    if (!principal || !months) return;

    const P = Number(principal);
    const N = Number(months);
    const R = Number(rate) / 12 / 100;

    let calculatedEmi;

    if (R === 0) {
      calculatedEmi = P / N;
    } else {
      calculatedEmi =
        (P * R * Math.pow(1 + R, N)) /
        (Math.pow(1 + R, N) - 1);
    }

    setEmi(calculatedEmi);
    
    // Scroll to results after calculation
    setTimeout(() => {
      const resultElement = document.getElementById('emi-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleReset = () => {
    setPrincipal("");
    setRate("");
    setMonths("");
    setEmi(null);
  };

  return (
    <div className="space-y-4">
      {/* Loan Amount */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Loan Amount (₹)
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all"
          placeholder="Enter loan amount"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          min="0"
        />
      </div>

      {/* Interest Rate */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Annual Interest Rate (%)
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all"
          placeholder="Enter interest rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      {/* Tenure */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Loan Tenure (Months)
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all"
          placeholder="Enter months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          min="1"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCalculate}
          disabled={!principal || !months}
        >
          Calculate EMI
        </button>

        <button
          className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Result */}
      {emi && (
        <div id="emi-result" className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
          <div className="text-white">
            <div className="text-sm text-slate-300 mb-3">EMI Calculation Result</div>
            
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Monthly EMI</div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                ₹ {emi.toFixed(2)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div className="text-center">
                  <div className="text-slate-500">Loan Amount</div>
                  <div className="text-slate-300 font-semibold">₹{Number(principal).toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">Interest Rate</div>
                  <div className="text-slate-300 font-semibold">{rate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">Tenure</div>
                  <div className="text-slate-300 font-semibold">{months} months</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">Total Amount</div>
                  <div className="text-slate-300 font-semibold">₹{(emi * months).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmiCalculator;

import React, { useEffect, useState } from "react";
import axios from "axios";

const CURRENCY_LIST = {
  USD: "US Dollar",
  INR: "Indian Rupee",
  EUR: "Euro",
  GBP: "British Pound",
  // AED: "UAE Dirham",
  SGD: "Singapore Dollar",
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch rates (USD base – stable)
  useEffect(() => {
    axios
      .get("/api/latest?from=USD")
      .then((res) => {
        setRates(res.data?.rates || {});
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load live currency rates");
        setLoading(false);
      });
  }, []);

  const handleConvert = () => {
    if (!amount) return;

    const numericAmount = Number(amount);

    const fromRate =
      fromCurrency === "USD" ? 1 : rates[fromCurrency];
    const toRate =
      toCurrency === "USD" ? 1 : rates[toCurrency];

    if (!fromRate || !toRate) return;

    // FROM → USD → TO
    const amountInUSD = numericAmount / fromRate;
    const converted = amountInUSD * toRate;

    setResult(converted);
    
    // Scroll to results after conversion
    setTimeout(() => {
      const resultElement = document.getElementById('currency-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };


  const handleReset = () => {
    setAmount("");
    setResult(null);
    setFromCurrency("USD");
    setToCurrency("INR");
  };

  return (
    <div className="space-y-4">
      {/* Amount */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Amount to convert
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

      {/* From */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">From</label>
        <select
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          {Object.entries(CURRENCY_LIST).map(([code, name]) => (
            <option key={code} value={code} className="bg-slate-900 text-white">
              {code} — {name}
            </option>
          ))}
        </select>
      </div>

      {/* To */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">To</label>
        <select
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          {Object.entries(CURRENCY_LIST).map(([code, name]) => (
            <option key={code} value={code} className="bg-slate-900 text-white">
              {code} — {name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleConvert}
          disabled={!amount || loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>

        <button
          className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          Loading live rates…
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result !== null && (
        <div id="currency-result" className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
          <div className="text-white">
            <div className="text-sm text-slate-300 mb-1">Conversion Result</div>
            <div className="text-2xl font-bold text-green-400">
              {toCurrency} {result.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400 mt-2">
              {fromCurrency} {amount} = {toCurrency} {result.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;

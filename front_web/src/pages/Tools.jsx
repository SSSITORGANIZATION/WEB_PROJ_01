import { motion } from "motion/react";
import { ArrowRight, Calculator, DollarSign, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import CalculatorToolsPanel from "../components/calculators/CalculatorToolsPanel";

const Tools = () => (
  <div className="min-h-screen bg-slate-950">
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Calculator className="h-7 w-7 text-white" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Practical tools, instant answers
          </p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-6xl" style={{ fontFamily: "Manrope, sans-serif" }}>
            Developer Tools
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-blue-100 md:text-xl" style={{ fontFamily: "Work Sans, sans-serif" }}>
            Simple calculators to help with currency conversion, GST, and monthly loan payments.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-blue-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <DollarSign className="h-4 w-4" /> Currency conversion
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <Receipt className="h-4 w-4" /> GST calculation
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <Calculator className="h-4 w-4" /> EMI estimation
            </span>
          </div>
        </motion.div>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
      <CalculatorToolsPanel />
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-lg font-semibold text-white">Looking for articles and guides?</h2>
          <p className="mt-1 text-sm text-slate-400">Browse the full Resources library for more information.</p>
        </div>
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-50"
        >
          Explore resources <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  </div>
);

export default Tools;

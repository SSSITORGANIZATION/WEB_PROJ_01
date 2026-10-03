import { motion } from "motion/react";
import { CurrencyConverter, GstCalculator, EmiCalculator } from ".";
import { DollarSign, Receipt, Calculator, Lightbulb } from "lucide-react";

const CALCULATOR_TABS = [
  {
    key: "currency",
    label: "Currency Converter",
    icon: DollarSign,
    gradient: "from-blue-600 to-blue-700",
    border: "border-blue-500/30",
    badge: "Live Rates",
    description: "Convert between USD, INR, EUR, GBP and more using real-time exchange rates.",
    component: CurrencyConverter,
  },
  {
    key: "gst",
    label: "GST Calculator",
    icon: Receipt,
    gradient: "from-green-600 to-emerald-600",
    border: "border-green-500/30",
    badge: "India",
    description: "Calculate GST amounts instantly with all Indian slab rates (0%, 5%, 12%, 18%, 28%).",
    component: GstCalculator,
  },
  {
    key: "emi",
    label: "EMI Calculator",
    icon: Calculator,
    gradient: "from-purple-600 to-purple-700",
    border: "border-purple-500/30",
    badge: "Finance",
    description: "Calculate your monthly loan EMI with principal, interest rate, and tenure.",
    component: EmiCalculator,
  },
];

const CalculatorToolsPanel = ({ className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={className}
    aria-labelledby="interactive-tools-heading"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
        <Lightbulb className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <h2 id="interactive-tools-heading" className="text-xl font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
          Interactive Tools
        </h2>
        <p className="text-slate-400 text-sm" style={{ fontFamily: "Work Sans, sans-serif" }}>
          3 calculators — all ready to use
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CALCULATOR_TABS.map((tab, index) => {
        const Component = tab.component;
        const Icon = tab.icon;

        return (
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`bg-slate-900/70 backdrop-blur-sm border ${tab.border} rounded-2xl overflow-hidden flex flex-col`}
          >
            <div className={`bg-gradient-to-r ${tab.gradient} px-5 py-4 flex items-center justify-between flex-shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {tab.label}
                  </h3>
                  <p className="text-white/70 text-xs leading-tight" style={{ fontFamily: "Work Sans, sans-serif" }}>
                    {tab.description}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline flex-shrink-0 ml-2 px-2 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full">
                {tab.badge}
              </span>
            </div>

            <div className="p-5 flex-1">
              <Component />
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.section>
);

export default CalculatorToolsPanel;

import React from "react";

const ToolSelector = ({ selected, onChange }) => {
  return (
    <div className="mb-4">
      <label className="fw-semibold mb-2 d-block">
        Choose Calculator
      </label>

      <select
        className="form-select form-select-lg"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="currency">💱 Currency Converter</option>
        <option value="gst">🧾 GST Calculator</option>
        <option value="emi">🏦 EMI Calculator</option>
      </select>
    </div>
  );
};
export default ToolSelector;

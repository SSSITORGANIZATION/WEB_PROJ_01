import React, { useState, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange, disabled = false }) => {
  const [otp, setOtp] = useState(value || '');

  useEffect(() => {
    setOtp(value || '');
  }, [value]);

  const handleChange = (index, e) => {
    const newValue = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(newValue)) return;

    const newOtp = otp.split('');
    newOtp[index] = newValue;
    setOtp(newOtp.join(''));
    
    if (onChange) {
      onChange(newOtp.join(''));
    }

    // Auto-focus next input
    if (newValue && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (/^\d+$/.test(pastedData)) {
      setOtp(pastedData);
      if (onChange) {
        onChange(pastedData);
      }
      
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length, length) - 1;
      const lastInput = document.getElementById(`otp-${lastIndex}`);
      if (lastInput) lastInput.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
};

export default OTPInput;

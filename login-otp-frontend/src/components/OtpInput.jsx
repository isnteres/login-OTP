import { useState, useRef, useEffect } from "react";

export default function OtpInput({ value = "", onChange, disabled = false }) {
  const [otp, setOtp] = useState(value.split(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value === "") {
      setOtp(["", "", "", "", "", ""]);
    }
  }, [value]);

  const handleChange = (index, val) => {
    if (disabled) return;

    // Solo permitir números
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Solo el último carácter
    setOtp(newOtp);

    // Llamar onChange con el código completo
    onChange(newOtp.join(""));

    // Auto-focus al siguiente input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;

    // Backspace: volver al input anterior
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Borrar el valor actual con backspace
    if (e.key === "Backspace" && otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange(newOtp.join(""));
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus en el último input lleno
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={index === 0}
          style={{
            width: "48px",
            height: "56px",
            fontSize: "24px",
            textAlign: "center",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            outline: "none",
            transition: "all 0.2s",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
      ))}
    </div>
  );
}

const handleKeyDown = (index, e) => {
  if (disabled) return;

  // Enter: submit del formulario
  if (e.key === "Enter") {
    e.preventDefault();
    const form = inputRefs.current[0]?.closest("form");
    if (form) {
      form.requestSubmit();
    } else {
      // Buscar el botón primary más cercano y clickearlo
      const btn = document.querySelector(".btn-primary:not([disabled])");
      if (btn) btn.click();
    }
  }

  // Backspace: volver al input anterior
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }

  // Borrar el valor actual con backspace
  if (e.key === "Backspace" && otp[index]) {
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);
    onChange(newOtp.join(""));
  }
};

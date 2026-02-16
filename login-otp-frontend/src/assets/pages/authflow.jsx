import { useState } from "react";
import OtpInput from "../../components/OtpInput";

export default function AuthFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl">

        {/* STEP 1 - EMAIL */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Iniciar Sesión
            </h2>

            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Enviar Código
            </button>
          </>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center">
              Verificación OTP
            </h2>

            <p className="text-sm text-gray-500 text-center mb-6">
              Enviamos un código a {email}
            </p>

            <OtpInput />

            <button
              onClick={nextStep}
              className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Validar Código
            </button>
          </>
        )}

        {/* STEP 3 - PASSWORD */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Crear Contraseña
            </h2>

            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={nextStep}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
            >
              Guardar y Continuar
            </button>
          </>
        )}

        {/* STEP 4 - BIENVENIDA */}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              🎉 Bienvenido
            </h2>
            <p className="text-gray-600">
              Tu cuenta ha sido creada correctamente.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

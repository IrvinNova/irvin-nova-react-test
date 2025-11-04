import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

interface FormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Login() {
    const navigate = useNavigate();
    const { setToken, token, clearToken } = useAppStore();
    const [values, setValues] = useState<FormValues>({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isValid, setIsValid] = useState(false);

    // Manejo de inactividad
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

    // Validaciones en tiempo real
    const validate = (field: string, value: string) => {
        let error = "";

        switch (field) {
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = "Correo inválido";
                break;

            case "password":
                if (value.length < 6) error = "Mínimo 6 caracteres";
                else if (value.length > 12) error = "Máximo 12 caracteres";
                else if (!/[A-Z]/.test(value)) error = "Debe tener una letra mayúscula";
                else if (!/[a-z]/.test(value)) error = "Debe tener una letra minúscula";
                else if (!/[0-9]/.test(value)) error = "Debe tener un número";
                else if (!/[^A-Za-z0-9]/.test(value)) error = "Debe tener un carácter especial";
                break;

            case "confirmPassword":
                if (value !== values.password) error = "Las contraseñas no coinciden";
                break;
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    useEffect(() => {
        useAppStore.getState().restoreSession();
    }, []);


    //  Validar formulario completo
    useEffect(() => {
        const noErrors = Object.values(errors).every((e) => e === "");
        const allFilled = Object.values(values).every((v) => v !== "");
        setIsValid(noErrors && allFilled);
    }, [errors, values]);

    //  Manejo de sesión persistente e inactividad
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const lastLoginTime = localStorage.getItem("loginTime");
        if (savedToken && lastLoginTime) {
            const now = Date.now();
            const diff = now - parseInt(lastLoginTime, 10);

            if (diff <= 5 * 60 * 1000) {
                setToken(savedToken);
                navigate("/rick-morty");
            } else {
                clearToken();
                localStorage.removeItem("token");
                localStorage.removeItem("loginTime");
            }
        }

        const resetTimer = () => {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            inactivityTimer.current = setTimeout(() => {
                clearToken();
                navigate("/login");
            }, 5 * 60 * 1000); // 5 minutos
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);

        resetTimer();

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, [setToken, clearToken, navigate]);

    useEffect(() => {
        const lastLoginTime = localStorage.getItem("loginTime");
        if (lastLoginTime) {
            const now = Date.now();
            const diff = now - parseInt(lastLoginTime, 10);
            if (diff > 5 * 60 * 1000) {
                // Más de 5 minutos: sesión expirada
                clearToken();
                localStorage.removeItem("loginTime");
            }
        }
    }, [clearToken]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        const fakeToken = "session-token";
        setToken(fakeToken);
        localStorage.setItem("loginTime", Date.now().toString());
        navigate("/rick-morty");
    };

    // Bloquear copiar/pegar
    const handlePreventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 animate-gradient-x">
            <div className="login-container bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 w-full max-w-5xl !max-w-5xl shadow-2xl">


                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    Bienvenido 🚀
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm text-gray-200 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onPaste={handlePreventCopyPaste}
                            onCopy={handlePreventCopyPaste}
                            className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none 
              border ${errors.email ? "border-red-400" : "border-green-400"} focus:ring-2 focus:ring-purple-400`}
                            placeholder="correo@dominio.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm text-gray-200 mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onPaste={handlePreventCopyPaste}
                            onCopy={handlePreventCopyPaste}
                            className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none 
              border ${errors.password ? "border-red-400" : "border-green-400"} focus:ring-2 focus:ring-purple-400`}
                            placeholder="Tu contraseña segura"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-400 mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="block text-sm text-gray-200 mb-1">Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onPaste={handlePreventCopyPaste}
                            onCopy={handlePreventCopyPaste}
                            className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none 
              border ${errors.confirmPassword ? "border-red-400" : "border-green-400"} focus:ring-2 focus:ring-purple-400`}
                            placeholder="Repite tu contraseña"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 
            ${isValid
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 text-white shadow-lg shadow-purple-500/50"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );

}

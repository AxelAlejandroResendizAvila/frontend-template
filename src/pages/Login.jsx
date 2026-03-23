import { api } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const navigate = useNavigate();

    // Validar formato de email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Limpiar errores cuando el usuario escribe
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(null);
        setError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(null);
        setError(null);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEmailError(null);
        setPasswordError(null);

        // Validaciones del cliente
        if (!email.trim()) {
            setEmailError("El email es requerido");
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError("Por favor ingresa un email válido");
            return;
        }

        if (!password) {
            setPasswordError("La contraseña es requerida");
            return;
        }

        if (password.length < 6) {
            setPasswordError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            const data = await api.post("/auth/login", { email, password });
            
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error en autenticación:", err);
            const status = err.status;
            const message = err.data?.message || err.message || "";
            
            // Manejar errores específicos del servidor
            if (status === 401) {
                setError("Email o contraseña incorrectos");
                setPasswordError("Contraseña incorrecta");
            } else if (message === "Usuario no encontrado") {
                setError("El email no está registrado");
                setEmailError("Email no encontrado");
            } else if (message.toLowerCase().includes("contraseña")) {
                setPasswordError("La contraseña es incorrecta");
            } else if (status === 400) {
                setError("Datos inválidos. Verifica tu email y contraseña");
            } else {
                setError("Error al conectar con el servidor. Intenta más tarde");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Iniciar Sesión</h2>
                
                {error && <p className="text-red-600 mb-4 text-center text-sm font-semibold bg-red-50 p-3 rounded">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 font-medium mb-1">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                emailError 
                                    ? "border-red-500 focus:ring-red-500 bg-red-50" 
                                    : "border-slate-300 focus:ring-blue-500"
                            }`}
                            placeholder="tu@email.com"
                            required
                        />
                        {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-slate-700 font-medium mb-1">Contraseña</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                passwordError 
                                    ? "border-red-500 focus:ring-red-500 bg-red-50" 
                                    : "border-slate-300 focus:ring-blue-500"
                            }`}
                            placeholder="********"
                            required
                        />
                        {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
                        disabled={loading}
                    >
                        {loading ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;



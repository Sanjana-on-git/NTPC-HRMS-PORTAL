import ntpcLogo from "../../assets/ntpc-logo.png";
import plantImage from "../../assets/ntpc-simhadri.png";
import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    Clock3,
    CalendarDays,
} from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
    setError("");

    if (!employeeId || !password) {
        setError("Please fill in all required fields.");
        return;
    }

    setLoading(true);

    try {
        const { data } = await api.post("/auth/login", {
            email: employeeId,
            password,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const role = data.user.Role;

        if (role === "DGM") {
            navigate("/dgm");
        } 
        else if (role === "DeptHead") {
            navigate("/hod");
        } 
        else if (role === "HR") {
            navigate("/hr");
        } 
        else {
            setError("Unknown user role");
        }

    } catch (err) {
        setError(err.response?.data?.message || "Login failed");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex">

            <div className="relative flex-1">

                <div className="absolute top-8 left-8 z-20 flex items-center gap-4">
                    <img src={ntpcLogo} alt="NTPC" className="h-10 object-contain" />

                    <div className="h-10 w-px bg-slate-300" />

                    <div>
                        <h2 className="text-[#005B96] font-bold text-lg tracking-wide">
                            NTPC SIMHADRI
                        </h2>

                        <p className="text-xs text-gray-500 italic">
                            Powering Progress, Empowering People.
                        </p>
                    </div>
                </div>

                <div className="absolute top-36 left-8 z-20 max-w-md">
                    <h1 className="text-4xl font-bold leading-tight text-gray-900">
                        Empowering People.
                    </h1>

                    <h1 className="text-4xl font-bold text-[#1476B8]">
                        Driving Performance.
                    </h1>

                    <div className="mt-6 w-16 h-[3px] bg-green-800" />

                    <p className="mt-5 text-gray-500 text-sm leading-relaxed">
                        A unified HRMS platform for attendance tracking, shift operations,
                        approvals and workforce management built for NTPC Simhadri.
                    </p>
                </div>

                <img
                    src={plantImage}
                    alt="NTPC Plant"
                    className="absolute bottom-0 left-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-blue-50/20" />
            </div>

            <div className="flex-1 flex items-center justify-center bg-[#fafafa]">
                <div className="w-[470px] bg-white rounded-2xl shadow-xl p-8">

                    <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
                        <div className="flex items-center gap-1 border rounded-full px-3 py-1">
                            <Lock size={12} className="text-[#1476B8]" />
                            Secure attendance portal
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <CalendarDays size={12} className="text-[#1476B8]" />
                                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock3 size={12} className="text-[#1476B8]" />
                                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                        Human Resource <span className="text-[#1476B8]">Management System</span>
                    </h2>

                    <p className="text-center text-gray-500 text-sm mt-2">
                        Role based attendance and approval system
                    </p>

                    <div className="w-20 h-1 bg-[#1476B8] rounded-full mx-auto mt-4 mb-6" />

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-700">Authentication Failed</h4>
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="relative mb-4">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1476B8]" />
                        <input
                            type="text"
                            placeholder="Employee ID"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>

                    <div className="relative mb-5">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1476B8]" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1476B8]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-6">
                        <label className="flex items-center gap-2 text-gray-500">
                            <input type="checkbox" /> Remember Me
                        </label>
                        <button className="text-[#1476B8] hover:underline">Forgot Password</button>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-[#5A8DEE] text-white font-medium hover:bg-[#1F52A3] transition disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Login →'}
                    </button>
                </div>
            </div>
        </div>
    );
}
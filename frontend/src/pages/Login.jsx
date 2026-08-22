import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PublicNavbar from '../components/Navbar/PublicNavbar';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = field === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (touched[field]) {
      const error = field === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      if (emailError) emailRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error);
        setErrors({ password: result.error });
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-xs">
                <Database className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">InsightFlow</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to continue your data analysis
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-4 py-2.5 text-base bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 hover:border-gray-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="you@company.com"
                    aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                    aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                  />
                  {errors.email && touched.email && (
                    <span id="email-error" className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" role="alert">
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={(e) => handleBlur('password', e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-4 py-2.5 text-base bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                      errors.password && touched.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 hover:border-gray-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="••••••••"
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                    aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p id="password-error" className="mt-1.5 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Demo credentials (for testing)</p>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600 font-mono space-y-1">
                <div>Email: <span className="text-gray-900">demo@insightflow.io</span></div>
                <div>Password: <span className="text-gray-900">demo123456</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-gray-200 bg-white">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} InsightFlow. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
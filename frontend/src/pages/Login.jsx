import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Database, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
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

  const fillDemo = () => {
    setEmail('demo@insightflow.io');
    setPassword('demo123456');
    setErrors({});
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary/30 selection:text-primary relative">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 relative animate-fade-in-up">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-200">
                <Database className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tight">DATA_AGENT</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Sign in to access your dataset workstation
            </p>
            
            {/* Floating accent elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-primary/5 blur-xl" />
            </div>
          </div>

          {/* Form Card */}
          <div className="card-elevated relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '100ms' }}>
            <form onSubmit={handleSubmit} noValidate className="space-y-5 relative z-10">
              <Input
                ref={emailRef}
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                disabled={isLoading}
                error={errors.email && touched.email ? errors.email : undefined}
                placeholder="you@company.com"
              />

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <div className="relative">
                  <Input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={(e) => handleBlur('password', e.target.value)}
                    disabled={isLoading}
                    error={errors.password && touched.password ? errors.password : undefined}
                    placeholder="••••••••"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center space-x-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                loading={isLoading}
              >
                <span>Sign In</span>
              </Button>
            </form>

            <div className="mt-6 text-center relative z-10">
              <p className="text-xs text-text-secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Create one free
                </Link>
              </p>
            </div>

            {/* Demo Helper Card */}
            <div className="mt-6 pt-5 border-t border-border relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Quick Demo Access</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fillDemo}
                >
                  Fill credentials
                </Button>
              </div>
              <div className="card px-3 py-2.5 text-xs text-text-muted font-mono-tight space-y-1">
                <div>Email: <span className="text-text-primary">demo@insightflow.io</span></div>
                <div>Pass: <span className="text-text-primary">demo123456</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-border text-center text-xs text-text-muted relative z-10">
        © 2026 DATA_AGENT. All rights reserved.
      </footer>
    </div>
  );
}
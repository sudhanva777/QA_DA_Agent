import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Database, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useThreeScene } from '../context/ThreeSceneContext';
import toast from 'react-hot-toast';
import PublicNavbar from '../components/Navbar/PublicNavbar';

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { _isReducedMotion } = useThreeScene();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const calculateStrength = (password) => {
    let score = 0;
    PASSWORD_REQUIREMENTS.forEach((req) => {
      if (req.test(password)) score++;
    });
    return score;
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'password') {
      setPasswordStrength(calculateStrength(value));
    }

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    if (field === 'password' && touched.confirmPassword) {
      const error = validateField('confirmPassword', formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let firstErrorField = null;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        if (!firstErrorField) firstErrorField = field;
      }
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(newErrors).length > 0) {
      const refMap = { name: nameRef, email: emailRef, password: passwordRef, confirmPassword: confirmRef };
      refMap[firstErrorField]?.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData.name.trim(), formData.email.trim(), formData.password);
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.error);
        if (result.error.includes('email')) {
          setErrors((prev) => ({ ...prev, email: result.error }));
          emailRef.current?.focus();
        }
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 1) return { label: 'Very Weak', color: 'text-[var(--accent-hot)]', bg: 'bg-[var(--accent-hot)]' };
    if (strength === 2) return { label: 'Weak', color: 'text-[var(--accent-warm)]', bg: 'bg-[var(--accent-warm)]' };
    if (strength === 3) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    if (strength === 4) return { label: 'Strong', color: 'text-[var(--accent-tertiary)]', bg: 'bg-[var(--accent-tertiary)]' };
    return { label: 'Very Strong', color: 'text-[var(--accent-tertiary)]', bg: 'bg-[var(--accent-tertiary)]' };
  };

  const strength = getStrengthLabel(passwordStrength);
  const strengthPercent = (passwordStrength / 5) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--accent-primary)]/30 selection:text-[var(--accent-primary-glow)] relative">
      <PublicNavbar />

      {/* Global 3D scene is rendered by App */}

      <main className="flex-1 flex items-center justify-center px-4 py-28 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 relative animate-fade-in-up">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-[var(--shadow-glow-sm)] group-hover:shadow-[var(--shadow-glow)] transition-all duration-200">
                <Database className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">DATA_AGENT</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Start analyzing data with deterministic AI insights
            </p>
            
            {/* Floating accent elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[var(--accent-secondary)]/5 blur-xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[var(--accent-tertiary)]/5 blur-xl" />
            </div>
          </div>

          {/* Form Card - Glass panel floating in the universe */}
          <div className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-glass)] relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-secondary)]/10 via-transparent to-[var(--accent-tertiary)]/10 opacity-50 animate-pulse" />
            
            <form onSubmit={handleSubmit} noValidate className="space-y-4 relative z-10">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  disabled={isLoading}
                  className={`input-dark ${errors.name && touched.name ? 'border-[var(--accent-hot)]/70' : ''}`}
                  placeholder="Jane Doe"
                  aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                />
                {errors.name && touched.name && (
                  <p className="mt-1.5 text-xs text-[var(--accent-hot)]" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  disabled={isLoading}
                  className={`input-dark ${errors.email && touched.email ? 'border-[var(--accent-hot)]/70' : ''}`}
                  placeholder="you@company.com"
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                />
                {errors.email && touched.email && (
                  <p className="mt-1.5 text-xs text-[var(--accent-hot)]" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={(e) => handleBlur('password', e.target.value)}
                    disabled={isLoading}
                    className={`input-dark pr-11 ${errors.password && touched.password ? 'border-[var(--accent-hot)]/70' : ''}`}
                    placeholder="••••••••"
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1.5 text-xs text-[var(--accent-hot)]" role="alert">
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]" role="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-[var(--text-muted)]">Password Strength</span>
                      <span className={`text-[11px] font-semibold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="h-1 bg-[var(--bg-deep)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.bg}`}
                        style={{ width: `${strengthPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {PASSWORD_REQUIREMENTS.map((req, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[10px]">
                          {req.test(formData.password) ? (
                            <CheckCircle2 className="w-3 h-3 text-[var(--accent-tertiary)] flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[var(--text-dim)] flex-shrink-0" />
                          )}
                          <span className={req.test(formData.password) ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  ref={confirmRef}
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                  disabled={isLoading}
                  className={`input-dark ${errors.confirmPassword && touched.confirmPassword ? 'border-[var(--accent-hot)]/70' : ''}`}
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword && touched.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1.5 text-xs text-[var(--accent-hot)]" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
                <label htmlFor="terms" className="text-xs text-[var(--text-muted)] leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <Sparkles className="w-4 h-4 ml-1 text-[var(--accent-primary-glow)]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center relative z-10">
              <p className="text-xs text-[var(--text-secondary)]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-glow)] transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-dim)] relative z-10">
        © 2026 DATA_AGENT. All rights reserved.
      </footer>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Database, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Badge } from '../components/ui';
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
    if (strength <= 1) return { label: 'Very Weak', color: 'text-error', bg: 'bg-error' };
    if (strength === 2) return { label: 'Weak', color: 'text-warning', bg: 'bg-warning' };
    if (strength === 3) return { label: 'Fair', color: 'text-warning', bg: 'bg-warning' };
    if (strength === 4) return { label: 'Strong', color: 'text-success', bg: 'bg-success' };
    return { label: 'Very Strong', color: 'text-success', bg: 'bg-success' };
  };

  const strength = getStrengthLabel(passwordStrength);
  const strengthPercent = (passwordStrength / 5) * 100;

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
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Start analyzing data with deterministic AI insights
            </p>
            
            {/* Floating accent elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-success/5 blur-xl" />
            </div>
          </div>

          {/* Form Card */}
          <div className="card-elevated relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '100ms' }}>
            <form onSubmit={handleSubmit} noValidate className="space-y-4 relative z-10">
              <Input
                ref={nameRef}
                id="name"
                label="Full Name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={(e) => handleBlur('name', e.target.value)}
                disabled={isLoading}
                error={errors.name && touched.name ? errors.name : undefined}
                placeholder="Jane Doe"
              />

              <Input
                ref={emailRef}
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={formData.email}
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
                    autoComplete="new-password"
                    value={formData.password}
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
                {errors.password && touched.password && (
                  <p className="mt-1.5 text-xs text-error" role="alert">
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 p-3 rounded-lg card" role="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-text-muted">Password Strength</span>
                      <Badge variant="primary" className={strength.color.replace('text-', '')}>
                        {strength.label}
                      </Badge>
                    </div>
                    <div className="h-1 bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.bg}`}
                        style={{ width: `${strengthPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {PASSWORD_REQUIREMENTS.map((req, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[10px]">
                          {req.test(formData.password) ? (
                            <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-text-muted flex-shrink-0" />
                          )}
                          <span className={req.test(formData.password) ? 'text-text-secondary' : 'text-text-muted'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                ref={confirmRef}
                id="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                disabled={isLoading}
                error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : undefined}
                placeholder="••••••••"
              />

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-border bg-surface text-primary focus:ring-1 focus:ring-primary"
                />
                <label htmlFor="terms" className="text-xs text-text-muted leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 mt-2"
                rightIcon={<Sparkles className="w-4 h-4" />}
                loading={isLoading}
              >
                <span>Create Account</span>
              </Button>
            </form>

            <div className="mt-6 text-center relative z-10">
              <p className="text-xs text-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Sign in
                </Link>
              </p>
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
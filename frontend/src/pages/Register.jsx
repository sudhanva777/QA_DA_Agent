import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Database, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
    if (strength <= 1) return { label: 'Very Weak', color: 'text-red-600', bg: 'bg-red-500' };
    if (strength === 2) return { label: 'Weak', color: 'text-orange-600', bg: 'bg-orange-500' };
    if (strength === 3) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-500' };
    if (strength === 4) return { label: 'Strong', color: 'text-emerald-600', bg: 'bg-emerald-500' };
    return { label: 'Very Strong', color: 'text-emerald-700', bg: 'bg-emerald-600' };
  };

  const strength = getStrengthLabel(passwordStrength);
  const strengthPercent = (passwordStrength / 5) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-xs">
                <Database className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">InsightFlow</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-gray-600">
              Start analyzing data with AI-powered insights
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1.5">
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
                  className={`w-full px-4 py-2.5 text-base bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name && touched.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Jane Doe"
                  aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                  aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                />
                {errors.name && touched.name && (
                  <p id="name-error" className="mt-1.5 text-sm text-red-600" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                  Email
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
                  <p id="email-error" className="mt-1.5 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1.5">
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
                    className={`w-full px-4 py-2.5 text-base bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                      errors.password && touched.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 hover:border-gray-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="••••••••"
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                    aria-describedby={errors.password && touched.password ? 'password-error' : 'password-hint'}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3" role="group" aria-label="Password strength">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-500">Password Strength</span>
                      <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden" aria-hidden="true">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.bg}`}
                        style={{ width: `${strengthPercent}%` }}
                      />
                    </div>
                    <ul className="mt-2 space-y-1" aria-label="Password requirements">
                      {PASSWORD_REQUIREMENTS.map((req, i) => (
                        <li key={i} className="flex items-center space-x-2 text-xs">
                          {req.test(formData.password) ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" aria-hidden="true" />
                          )}
                          <span className={req.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}>
                            {req.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1.5">
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
                  className={`w-full px-4 py-2.5 text-base bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword && touched.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword && touched.confirmPassword ? 'confirm-error' : undefined}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p id="confirm-error" className="mt-1.5 text-sm text-red-600" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the <Link href="#" className="text-blue-600 hover:text-blue-700 underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <Sparkles className="w-4 h-4 ml-1" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
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
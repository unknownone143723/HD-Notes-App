// src/pages/SignupPage.tsx

import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

// --- HELPER COMPONENTS ---
// **THE FIX for FOCUS LOSS**: By defining these components outside the main SignupPage function,
// they are not recreated on every render, which prevents the input from losing focus.
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const InputField = ({ name, type, label, value, onChange, icon, disabled = false, required = true }: any) => (
  <div className="relative">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="block w-full px-3 py-3 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-70 disabled:cursor-not-allowed"
      placeholder=" "
      required={required}
      disabled={disabled}
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    >
      {label}
    </label>
    {icon && <div className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">{icon}</div>}
  </div>
);


// --- MAIN SIGNUP PAGE COMPONENT ---
const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '' // **THE FIX**: Added password to the main form data state
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetOtp = async () => { // Removed 'e: FormEvent'
    if (!formData.name || !formData.dateOfBirth || !formData.email || !formData.password) {
      return toast.error("Please fill in all your details, including password.");
    }
    setIsLoading(true);
    try {
      // **THE FIX**: Now sends the complete form data including the password
      await api.post('/auth/signup', formData);
      toast.success('OTP sent successfully!');
      setStep(2);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please check your details.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp
      });

      // ✅ Fix here
      login(response.data.email, response.data.token);

      toast.success('Account created successfully!');
      navigate('/welcome'); // ✅ This will now run
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // YOUR ORIGINAL LAYOUT IS PRESERVED
    <div className="">
      <div className="w-full max-w-4xl mx-auto md:h-[575px] bg-white rounded-2xl shadow-xl flex">
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
            <p className="text-gray-500 mt-2">Sign up to enjoy the feature of HD</p>
          </div>

          {/* **THE FIX for VALIDATION**: A single form now handles the final submission. */}
          <form onSubmit={handleSignup} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-6">
                <InputField name="name" type="text" label="Your Name" value={formData.name} onChange={handleInputChange} required={step === 1} />
                <InputField name="dateOfBirth" type="date" label="Date of Birth" value={formData.dateOfBirth} onChange={handleInputChange} required={step === 1} />
                <InputField name="email" type="email" label="Email" value={formData.email} onChange={handleInputChange} required={step === 1} />
                <InputField
                  name="password" type={showPassword ? 'text' : 'password'} label="Create Password" value={formData.password}
                  onChange={handleInputChange}
                  required={step === 1}
                  icon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
                <button
                  type="button" // This button does NOT submit the form
                  onClick={handleGetOtp}
                  disabled={isLoading}
                  className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center justify-center"
                >
                  {isLoading ? <Spinner /> : 'Get OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <InputField
                  name="otp" type="text" label="OTP" value={otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value) && value.length <= 6) setOtp(value);
                  }}
                  required={step === 2}
                />
                <button
                  type="submit" // This button DOES submit the form
                  disabled={isLoading}
                  className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center justify-center"
                >
                  {isLoading ? <Spinner /> : 'Sign up'}
                </button>
              </div>
            )}
          </form>

          <p className="text-sm text-center text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <img src="/container.png" alt="Signup illustration" className="w-full h-full object-cover rounded-r-2xl" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const InputField = ({ name, type, label, value, onChange, disabled = false, required = true }: any) => (
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
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
    >
      {label}
    </label>
  </div>
);

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', email: '' });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetOtp = async () => {
    if (!formData.name || !formData.dateOfBirth || !formData.email) {
      return toast.error('Please fill in all your details.');
    }
    setIsLoading(true);
    try {
      await api.post('/auth/signup', formData);
      toast.success('OTP sent successfully!');
      setStep(2);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
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
      login(response.data.email, response.data.token);
      toast.success('Account created successfully!');
      navigate('/welcome');
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', { credential: credentialResponse.credential });
      login(response.data.email, response.data.token);
      toast.success(`Welcome, ${response.data.name}!`);
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google sign up failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full max-w-4xl md:mt-3 md:h-[610px] mx-auto bg-white rounded-2xl flex">
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
            <p className="text-gray-500 mt-2">Sign up to enjoy the feature of HD</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-6">
                <InputField name="name" type="text" label="Your Name" value={formData.name} onChange={handleInputChange} />
                <InputField name="dateOfBirth" type="date" label="Date of Birth" value={formData.dateOfBirth} onChange={handleInputChange} />
                <InputField name="email" type="email" label="Email" value={formData.email} onChange={handleInputChange} />
                <button
                  type="button"
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
                  name="otp"
                  type="text"
                  label="OTP"
                  value={otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value) && value.length <= 6) setOtp(value);
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center justify-center"
                >
                  {isLoading ? <Spinner /> : 'Sign up'}
                </button>
              </div>
            )}
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google sign up failed. Please try again.')}
              useOneTap
            />
          </div>

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

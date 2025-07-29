import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const InputField = ({ name, type, label, value, onChange, icon, disabled = false, required = true }: any) => (
  <div className="relative">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="block w-full px-3 py-3 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-70"
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
    {icon && <div className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">{icon}</div>}
  </div>
);

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendLoginOtp = async () => {
    if (!email) {
      return toast.error("Please enter your email address.", { id: 'otp-email-empty' });
    }
    setIsLoading(true);
    try {
      await api.post('/auth/send-login-otp', { email });
      toast.success('OTP sent to your email!', { id: 'otp-sent-success' });
      setStep(2);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP.';
      toast.error(message, { id: 'otp-sent-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-login-otp', { email, otp });
      login(response.data.email, response.data.token);
      toast.success('Logged in successfully!', { id: 'otp-login-success' });
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed.';
      toast.error(message, { id: 'otp-verify-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      login(response.data.email, response.data.token);
      toast.success(`Welcome, ${response.data.name}!`, { id: 'google-login-success' });
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google login failed.';
      toast.error(message, { id: 'google-login-error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-4xl md:mt-2 md:h-[620px] mx-auto bg-white rounded-2xl flex">
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-500 mt-2">Please login to continue to your account.</p>
          </div>

          <form onSubmit={handleVerifyLoginOtp} className="space-y-6">
            <InputField name="email" type="email" label="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} disabled={step === 2} />
            {step === 2 && (
              <InputField
                name="otp"
                type="text"
                label="OTP"
                value={otp}
                onChange={(e: any) => {
                  const val = e.target.value;
                  if (/^[0-9]*$/.test(val) && val.length <= 6) setOtp(val);
                }}
              />
            )}
            {step === 1 ? (
              <button type="button" onClick={handleSendLoginOtp} disabled={isLoading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex justify-center">
                {isLoading ? <Spinner /> : 'Get OTP'}
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex justify-center">
                {isLoading ? <Spinner /> : 'Sign in'}
              </button>
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
              onError={() => {
                toast.error('Google login failed. Please try again.', { id: 'google-login-direct-error' });
              }}
              useOneTap
            />
          </div>

          <p className="text-sm text-center text-gray-500 mt-8">
            Need an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <img src="/container.png" alt="Login illustration" className="w-full h-full object-cover rounded-r-2xl" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

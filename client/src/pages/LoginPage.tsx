import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

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
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.email, response.data.token);
      toast.success('Logged in successfully!', { id: 'login-success' });
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message, { id: 'login-error' });
    } finally {
      setIsLoading(false);
    }
  };

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

          {loginMethod === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <InputField name="email" type="email" label="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
              <InputField
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                icon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
              <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex justify-center">
                {isLoading ? <Spinner /> : 'Sign in'}
              </button>
              <p className="text-sm text-center">
                <button type="button" onClick={() => setLoginMethod('otp')} className="font-medium text-blue-600 hover:underline">
                  Sign in with OTP
                </button>
              </p>
            </form>
          ) : (
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
              <p className="text-sm text-center">
                <button type="button" onClick={() => { setLoginMethod('password'); setStep(1); }} className="font-medium text-blue-600 hover:underline">
                  Sign in with Password
                </button>
              </p>
            </form>
          )}

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

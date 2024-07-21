import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import OtpVerification from '~/components/OtpVerification';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [message, setMessage] = useState('');
  

  const router = useRouter();


  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
      if (router.query.step === '2') {
        setStep(2);
      }
    }
  }, [router.query.email, router.query.step]);


  const generateOtp = api.user.register.useMutation({
    onSuccess: () => {
      setMessage('OTP sent to your email ,dont refresh your page');
      setStep(2);
    },
    onError: (error) => {
      setMessage(`Registration error: ${error.message}`);
    },
  });

  const verifyOtpAndCreateUser = api.user.verifyOtpAndCreateUser.useMutation({
    onSuccess: () => {
      setMessage('Email verified and user created successfully');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error) => {
      setMessage(`OTP verification error: ${error.message}`);
      if (error.message.includes('Too many invalid attempts')) {
        setStep(1);
        setName('');
        setEmail('');
        setPassword('');
      }
      router.push('/register')
    },
  });

  const handleGenerateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateOtp.mutateAsync({ email, name, password });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtpAndCreateUser.mutateAsync({ email, otp });
    } catch (error) {
      console.error('OTP verification error:', error);    
    }
  };

  return (
    <>
   
    <div className="pt-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {step==1&&(   <div className="max-w-md w-full space-y-8 box-border h-200 py-8 px-5 border-2 rounded-xl">
        <div>
          <h2 className="mt-3 text-center text-3xl font-bold text-gray-900">
            {step === 1 ? 'Create your account' : ''}
          </h2>
        </div>
        
          <form className="mt-8 space-y-6" onSubmit={handleGenerateOtp}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px py-5 px-5">
              <div>
                <label>Name</label>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="py-5">
                <label>Email</label>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Password</label>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="pt-9">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Account
                </button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
              </div>
            </div>

            <div>
          <p className="text-center text-sm text-gray-600">
            Have an account?{' '}
            <Link href="/login" className="text-black hover:text-indigo-500">
              LOGIN
            </Link>
          </p>
        </div>
          </form>
     
      
      </div>)}
      {step === 2 && (
          <OtpVerification
            email={email}
            onVerifyOtp={handleVerifyOtp}
            message={message}
            setMessage={setMessage}
          />
        )}
    
    </div>
  
    </>
  );
};

export default Register;

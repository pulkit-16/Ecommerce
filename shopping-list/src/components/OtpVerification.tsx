import { useState, useEffect } from 'react';

interface OtpVerificationProps {
  email: string;
  onVerifyOtp: (otp: string) => void;
  message: string;
  setMessage: (message: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onVerifyOtp, message, setMessage }) => {
  const [otp, setOtp] = useState(Array(8).fill(''));
  const [maskedEmail, setMaskedEmail] = useState('');

  useEffect(() => {
    setMaskedEmail(maskEmail(email));
  }, [email]);

  const maskEmail = (email: string): string => {
    const [localPart, domainPart] = email.split('@');
    if (!localPart || !domainPart) {
      return email; // Return the original email if either part is undefined
    }
    const maskedLocalPart = localPart.substring(0, 2) + '***';
    return maskedLocalPart + '@' + domainPart;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 7) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyOtp(otp.join(''));
  };

  return (
    <div className="flex items-center justify-center min-h-28">
      <div className="box-border border-2 rounded-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Verify your email</h1>
        <p className="text-center text-gray-600 mb-8">Enter the 8 digit code you have received on {maskedEmail}</p>
        <form onSubmit={handleSubmit} className="space-y-1">
          <span>Code</span>
          <div className="flex justify-center space-x-2 pb-12">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="w-9 h-9 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            VERIFY
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default OtpVerification;

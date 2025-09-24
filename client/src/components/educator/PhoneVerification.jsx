import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const PhoneVerification = ({ phone }) => {
  const { backendUrl, getToken, fetchUserData, userData } = useContext(AppContext);
  const { theme } = useTheme();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [isEditing, setIsEditing] = useState(false);

  const requestOtp = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/request-phone-verification`, 
        { phone: phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOtpSent(true);
        setTimer(180); // 3 minutes countdown
        setIsEditing(false);
        toast.success("Verification code sent to your phone!");
        // For testing purposes, show the code
        if (data.verificationCode) {
          toast.info(`Test code: ${data.verificationCode}`);
        }
      } else {
        toast.error(data.message || "Failed to send verification code");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error requesting verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-phone`, 
        { verificationCode: otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Phone verified successfully!");
        setOtpSent(false);
        setOtp("");
        setTimer(0);
        await fetchUserData(); // Refresh user data
      } else {
        toast.error(data.message || "Invalid verification code");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isVerified = userData?.isPhoneVerified;

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 ${theme.colors.border} border`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${theme.colors.textAccent}`}>
          Phone Verification
        </h3>
        {isVerified && (
          <span className={`px-3 py-1 rounded-full text-sm ${theme.colors.success}`}>
            ✓ Verified
          </span>
        )}
      </div>

      {/* Phone Number Display/Edit */}
      <div className="mb-4">
        <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
          Phone Number
        </label>
        {isEditing ? (
          <div className="flex space-x-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className={`flex-1 px-3 py-2 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={() => setIsEditing(false)}
              className={`px-3 py-2 rounded-lg ${theme.colors.buttonSecondary}`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className={`${theme.colors.textPrimary}`}>
              {phoneNumber || "Not set"}
            </p>
            {!isVerified && (
              <button
                onClick={() => setIsEditing(true)}
                className={`text-sm px-3 py-1 rounded ${theme.colors.buttonSecondary}`}
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Verification Status */}
      {isVerified ? (
        <div className={`p-4 rounded-lg ${theme.colors.success.replace('bg-', 'bg-opacity-20 bg-')} border border-green-300`}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-medium">Phone number verified successfully!</span>
          </div>
        </div>
      ) : (
        <>
          {!otpSent ? (
            <button
              onClick={requestOtp}
              disabled={isLoading || !phoneNumber.trim()}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${theme.colors.button} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full px-3 py-2 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  maxLength={6}
                />
              </div>
              
              <button
                onClick={verifyOtp}
                disabled={isLoading || otp.length !== 6}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${theme.colors.success} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>

              <div className={`text-sm ${theme.colors.textSecondary} text-center`}>
                {timer > 0 ? (
                  <p>You can request again in {formatTime(timer)}</p>
                ) : (
                  <div className="space-y-2">
                    <p>Didn't receive the code?</p>
                    <button
                      onClick={requestOtp}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg ${theme.colors.buttonSecondary} disabled:opacity-50`}
                    >
                      {isLoading ? "Sending..." : "Resend Code"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Info */}
      <div className={`mt-4 p-3 rounded-lg ${theme.colors.tertiary} ${theme.colors.borderAccent} border`}>
        <p className={`text-sm ${theme.colors.textSecondary}`}>
          <strong>Note:</strong> For testing purposes, use verification code: <strong>123456</strong>
        </p>
      </div>
    </div>
  );
};

export default PhoneVerification;

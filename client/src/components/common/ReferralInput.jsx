import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReferralService from "../../services/referralService";

const ReferralInput = ({ onReferralValidated, initialReferralCode = "" }) => {
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const [isValidating, setIsValidating] = useState(false);
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check URL params for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !referralCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, []);

  const validateReferralCode = async (code) => {
    if (!code || code.length < 3) {
      setReferrerInfo(null);
      setIsValid(false);
      onReferralValidated?.(null);
      return;
    }

    setIsValidating(true);
    try {
      const response = await ReferralService.validateReferralCode(code);
      if (response.success) {
        setReferrerInfo(response.referrer);
        setIsValid(true);
        onReferralValidated?.(code);
        toast.success(`Valid referral code from ${response.referrer.name || response.referrer.username}`);
      }
    } catch (error) {
      setReferrerInfo(null);
      setIsValid(false);
      onReferralValidated?.(null);
      if (code.length >= 3) {
        toast.error(error.message);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setReferralCode(value);
    
    // Debounce validation
    clearTimeout(window.referralValidationTimeout);
    window.referralValidationTimeout = setTimeout(() => {
      validateReferralCode(value);
    }, 500);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-1">
          Referral Code (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            id="referralCode"
            value={referralCode}
            onChange={handleInputChange}
            placeholder="Enter referral code"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              referralCode
                ? isValid
                  ? "border-green-500 focus:ring-green-500 bg-green-50"
                  : "border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
          {referralCode && !isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {referrerInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">
                Referred by: {referrerInfo.name || referrerInfo.username}
              </p>
              <p className="text-xs text-green-600">
                You'll earn a 5% bonus on your first investment!
              </p>
            </div>
          </div>
        </div>
      )}

      {referralCode && !isValid && !isValidating && referralCode.length >= 3 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">Invalid referral code</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralInput;

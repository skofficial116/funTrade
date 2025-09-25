import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReferralService from "../../services/referralService";

const ReferralDashboard = () => {
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      const response = await ReferralService.getReferralStats();
      if (response.success) {
        setReferralStats(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      const response = await ReferralService.generateReferralCode();
      if (response.success) {
        toast.success("Referral code generated successfully!");
        fetchReferralStats();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const copyReferralLink = () => {
    if (referralStats?.user?.referralCode) {
      const referralLink = `${window.location.origin}/signup?ref=${referralStats.user.referralCode}`;
      navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Referral Dashboard</h2>
        <p className="text-blue-100">Earn rewards by referring friends and building your network</p>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
        {referralStats?.user?.referralCode ? (
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg">
              {referralStats.user.referralCode}
            </div>
            <button
              onClick={copyReferralLink}
              className={`px-4 py-2 rounded-lg transition-colors ${
                copySuccess
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copySuccess ? "Copied!" : "Copy Link"}
            </button>
          </div>
        ) : (
          <button
            onClick={generateReferralCode}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Referral Code
          </button>
        )}
      </div>

      {/* Stats Overview */}
      {referralStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Level</p>
                <p className="text-2xl font-bold text-blue-600">
                  {referralStats.user.currentLevel || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Direct Team</p>
                <p className="text-2xl font-bold text-green-600">
                  {referralStats.user.directTeamCount || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(referralStats.user.totalEarnings)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining Cap</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(referralStats.user.remainingCap)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Progress */}
      {referralStats?.levelProgress && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Progress to Level {referralStats.levelProgress.nextLevel}</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Direct Team Members</span>
                <span>{referralStats.levelProgress.directTeamProgress.current} / {referralStats.levelProgress.directTeamProgress.required}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${referralStats.levelProgress.directTeamProgress.percentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Volume</span>
                <span>{formatCurrency(referralStats.levelProgress.volumeProgress.current)} / {formatCurrency(referralStats.levelProgress.volumeProgress.required)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${referralStats.levelProgress.volumeProgress.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Referrals */}
      {referralStats?.directReferrals?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Direct Referrals</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralStats.directReferrals.map((referral, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {referral.referee.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.referee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(referral.referee.totalInvestment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        referral.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {referral.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Bonuses */}
      {referralStats?.bonuses?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bonuses</h3>
          <div className="space-y-3">
            {referralStats.bonuses.slice(0, 5).map((bonus, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {bonus.bonusType.replace('_', ' ').toUpperCase()}
                    {bonus.level && ` - Level ${bonus.level}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(bonus.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +{formatCurrency(bonus.bonusAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {bonus.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralDashboard;

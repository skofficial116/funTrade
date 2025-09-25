const SecuritySettings = () => {
  const securityOptions = [
    { title: "Change Password", desc: "Update your password" },
    {
      title: "Two-Factor Authentication",
      desc: "Add an extra layer of security",
    },
    { title: "Login History", desc: "View recent login activity" },
    { title: "Connected Devices", desc: "Manage your connected devices" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
      <div className="space-y-4">
        {securityOptions.map((option, index) => (
          <button
            key={index}
            className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <p className="font-medium text-gray-800">{option.title}</p>
            <p className="text-sm text-gray-600">{option.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
export default SecuritySettings;

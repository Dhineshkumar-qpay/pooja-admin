import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { authService } from "../services/api";

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await authService.getProfile();
        if (response.status === 200 && response.data) {
          setProfile({
            name: response.data.name || "",
            email: response.data.email || "",
            mobile: response.data.mobile || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await authService.updateProfile({
        name: profile.name,
        mobile: profile.mobile,
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">
          Settings
        </h1>
        <button 
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
          <h2 className="text-lg font-heading font-semibold text-dark-brown-900 mb-4 border-b border-dark-brown-100 pb-2">
            Profile Information
          </h2>
          {isLoading ? (
            <div className="text-sm text-dark-brown-500">Loading profile...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-brown-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-brown-700 mb-1">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  disabled
                  className="w-full border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-500 bg-gray-50 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-brown-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  className="w-full border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

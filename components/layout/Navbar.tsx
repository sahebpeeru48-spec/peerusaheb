import React, { useState } from 'react';
import { Activity, PhoneCall, User as UserIcon, LogOut, Sparkles, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeTab, setActiveTab }) => {
  const { user, logout, loginDemo } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 focus:outline-none group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-teal-600 to-health-blue-500 flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">Health<span className="text-health-teal-600">AI</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-health-teal-50 text-health-teal-700 px-1.5 py-0.5 rounded border border-health-teal-200">Assistant</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Smart Healthcare Companion</p>
              </div>
            </button>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'bg-health-teal-50 text-health-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat' ? 'bg-health-teal-50 text-health-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-health-teal-600" />
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'symptoms' ? 'bg-health-teal-50 text-health-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Symptom Checker
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'facilities' ? 'bg-health-teal-50 text-health-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Find Healthcare
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Emergency Dial */}
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm font-bold border border-red-200 transition-colors shadow-sm"
              title="Call 911 for life-threatening emergencies"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse text-red-600" />
              <span className="hidden sm:inline">Emergency</span> 911
            </a>

            {/* Medical Disclaimer pill */}
            <div className="hidden lg:block">
              <MedicalDisclaimer compact={true} />
            </div>

            {/* User Profile / Demo login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-health-teal-100 text-health-teal-800 font-bold flex items-center justify-center text-sm border border-health-teal-200">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="block text-xs font-semibold text-slate-800 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-health-teal-600 font-medium capitalize">
                      {user.role} {user.id === 'demo-user-123' && '(Demo)'}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" /> Profile & Privacy
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('records');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-slate-400" /> Health Records
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginDemo()}
                  className="px-3 py-1.5 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                >
                  Demo Mode
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

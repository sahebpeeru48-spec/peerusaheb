import React from 'react';
import {
  LayoutDashboard,
  MessageSquareHeart,
  Stethoscope,
  MapPin,
  ClipboardList,
  HeartHandshake,
  CalendarDays,
  Settings,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { user } = useAuth();
  const { appointments, wellness } = useHealth();

  const pendingAppointments = appointments.filter(a => a.status === 'Requested' || a.status === 'Confirmed').length;
  const habitsCount = wellness?.habits?.filter(h => !h.completed).length || 0;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Health Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'chat',
      label: 'AI Health Assistant',
      icon: MessageSquareHeart,
      badge: 'AI Powered',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'symptoms',
      label: 'Symptom Checker',
      icon: Stethoscope,
      badge: 'Triage',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'facilities',
      label: 'Find Healthcare',
      icon: MapPin,
      badge: 'Map & GPS',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'records',
      label: 'Health Records',
      icon: ClipboardList,
      badge: null
    },
    {
      id: 'wellness',
      label: 'Wellness & Habits',
      icon: HeartHandshake,
      badge: habitsCount > 0 ? `${habitsCount} goals` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarDays,
      badge: pendingAppointments > 0 ? `${pendingAppointments}` : null,
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'settings',
      label: 'Settings & Privacy',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* User Overview Mini Card */}
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-health-teal-600 to-health-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500">Blood Type: {user.bloodType || 'A+'}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-health-teal-50 text-health-teal-700 border border-health-teal-200">
                Patient
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Navigation</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-health-teal-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Emergency Assistance Bottom Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency Services</span>
            </div>
            <p className="text-[11px] text-red-600 leading-snug mb-2">
              For sudden chest pain, severe bleeding, or stroke signs, call 911 immediately.
            </p>
            <a
              href="tel:911"
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <PhoneCall className="w-3 h-3" /> Call 911 Now
            </a>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-health-teal-600" /> HIPAA / Safe Demo
            </span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

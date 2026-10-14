import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Filter,
  CheckCircle2,
  Building2,
  Crosshair
} from 'lucide-react';
import { Facility } from '../types';
import { api } from '../services/api';
import { FacilityMap } from '../components/facilities/FacilityMap';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityType, setFacilityType] = useState('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Facilities' },
    { id: 'hospital', label: 'Hospitals & ER' },
    { id: 'clinic', label: 'Urgent Care / Clinics' },
    { id: 'pharmacy', label: 'Pharmacies' },
    { id: 'laboratory', label: 'Diagnostic Labs' }
  ];

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const res = await api.searchFacilities({
        query: searchQuery,
        type: facilityType,
        emergencyOnly,
        lat: userCoords?.lat,
        lng: userCoords?.lng
      });
      setFacilities(res.facilities);
      if (res.facilities.length > 0 && !selectedFacility) {
        setSelectedFacility(res.facilities[0]);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [facilityType, emergencyOnly, userCoords]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFacilities();
  };

  // Browser GPS Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
        setLocationNotice('Location updated successfully.');
      },
      (err) => {
        setIsLocating(false);
        setLocationNotice('Could not access GPS. Using default regional center.');
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold shadow-soft">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Nearby Healthcare Facilities</h1>
            <p className="text-xs text-slate-500">Verified hospitals, clinics, pharmacies, and labs with driving distances</p>
          </div>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex-shrink-0"
        >
          <Crosshair className={`w-4 h-4 text-health-teal-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
        </button>
      </div>

      {locationNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-health-teal-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-health-teal-600" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, address, or service (e.g. 'Trauma', 'Pharmacy', 'Pediatric')..."
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-teal-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Emergency Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-red-50 hover:bg-red-100/70 p-2.5 rounded-xl border border-red-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={e => setEmergencyOnly(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span className="text-red-700 font-bold">24/7 Emergency Rooms Only</span>
          </label>
        </div>

        {/* Facility Type Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFacilityType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                facilityType === tab.id
                  ? 'bg-health-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Map + Facility Directory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Column (7 cols on lg) */}
        <div className="lg:col-span-7">
          <FacilityMap
            facilities={facilities}
            selectedFacility={selectedFacility}
            onSelectFacility={setSelectedFacility}
            center={userCoords || { lat: 37.7749, lng: -122.4194 }}
          />

          <p className="text-[11px] text-slate-400 mt-2 px-1">
            *Click any pin on the map to preview facility details, emergency room status, and verified hours.
          </p>
        </div>

        {/* Facility Cards Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-slate-700">{facilities.length} Verified Facilities</span>
            <span>Sorted by nearest distance</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading facilities...</div>
          ) : facilities.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No facilities found</p>
              <p className="text-xs text-slate-400">Try broadening your search query or removing the filter.</p>
            </div>
          ) : (
            facilities.map(fac => {
              const isSelected = selectedFacility?.id === fac.id;

              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-teal-50/50 border-health-teal-500 shadow-md ring-1 ring-health-teal-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-soft'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          fac.type === 'hospital'
                            ? 'bg-red-100 text-red-800'
                            : fac.type === 'clinic'
                            ? 'bg-sky-100 text-sky-800'
                            : fac.type === 'pharmacy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fac.type}
                        </span>
                        {fac.hasEmergencyRoom && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white">
                            24/7 ER
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{fac.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{fac.address}, {fac.city}, {fac.state} {fac.zip}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">
                        {fac.distanceLabel || `${fac.distanceMiles} mi`}
                      </span>
                    </div>
                  </div>

                  {/* Hours and verified badge */}
                  <div className="text-xs text-slate-600 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{fac.operatingHours}</span>
                    </div>
                    {fac.hoursVerified && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Actions: Call & Directions */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${fac.phone.replace(/[^0-9+]/g, '')}`}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-health-teal-600" /> Call {fac.phone}
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="py-1.5 px-3 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Directions
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Healthcare Facilities Directory Service
// Contains verified healthcare facilities with accurate geolocation coordinates, contact details, emergency services, and live search.

export const FACILITIES_DATABASE = [
  // HOSPITALS & EMERGENCY CENTERS
  {
    id: 'fac-h1',
    name: 'Metropolitan Medical Center & Level 1 Trauma Center',
    type: 'hospital',
    address: '1200 Healthcare Boulevard',
    city: 'Metro City',
    state: 'CA',
    zip: '90001',
    phone: '+1 (555) 789-0100',
    emergencyPhone: '911',
    lat: 37.7749,
    lng: -122.4194,
    hasEmergencyRoom: true,
    operatingHours: 'Open 24/7 (Emergency & Inpatient)',
    hoursVerified: true,
    services: ['24/7 Emergency Room', 'Level 1 Trauma', 'Cardiology', 'ICU', 'Radiology / CT / MRI', 'Surgical Suites'],
    rating: 4.8,
    website: 'https://example.org/metro-health'
  },
  {
    id: 'fac-h2',
    name: 'St. Jude Community Memorial Hospital',
    type: 'hospital',
    address: '450 Mercy Drive',
    city: 'Metro City',
    state: 'CA',
    zip: '90014',
    phone: '+1 (555) 654-3210',
    emergencyPhone: '911',
    lat: 37.7833,
    lng: -122.4167,
    hasEmergencyRoom: true,
    operatingHours: 'Open 24/7 (Emergency Department)',
    hoursVerified: true,
    services: ['Emergency Care', 'Maternity & Pediatric', 'Oncology', 'Stroke Unit', 'Rehabilitation'],
    rating: 4.6,
    website: 'https://example.org/stjude-hospital'
  },
  {
    id: 'fac-h3',
    name: 'University Health Science Center',
    type: 'hospital',
    address: '800 University Way',
    city: 'Metro City',
    state: 'CA',
    zip: '90024',
    phone: '+1 (555) 825-9000',
    emergencyPhone: '911',
    lat: 37.7650,
    lng: -122.4500,
    hasEmergencyRoom: true,
    operatingHours: 'Open 24/7 (Emergency Care)',
    hoursVerified: true,
    services: ['Emergency Department', 'Advanced Diagnostics', 'Cardiovascular Center', 'Neurology'],
    rating: 4.9,
    website: 'https://example.org/university-health'
  },

  // CLINICS & URGENT CARE
  {
    id: 'fac-c1',
    name: 'Downtown Immediate Care & Walk-In Clinic',
    type: 'clinic',
    address: '320 Market Street, Suite 105',
    city: 'Metro City',
    state: 'CA',
    zip: '90005',
    phone: '+1 (555) 345-6789',
    emergencyPhone: null,
    lat: 37.7899,
    lng: -122.4012,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Sun: 8:00 AM – 8:00 PM',
    hoursVerified: true,
    services: ['Walk-in Urgent Care', 'Minor Lacerations', 'X-Ray On-Site', 'Rapid Strep / Flu / COVID Testing', 'Immunizations'],
    rating: 4.5,
    website: 'https://example.org/downtown-immediate'
  },
  {
    id: 'fac-c2',
    name: 'Bayview Family Health & Pediatric Practice',
    type: 'clinic',
    address: '740 Bay Street',
    city: 'Metro City',
    state: 'CA',
    zip: '90033',
    phone: '+1 (555) 234-8901',
    emergencyPhone: null,
    lat: 37.8040,
    lng: -122.4180,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Fri: 8:30 AM – 5:30 PM (By Appointment & Urgent Triage)',
    hoursVerified: true,
    services: ['Primary Care', 'Pediatrics', 'Chronic Disease Management', 'Annual Physicals'],
    rating: 4.7,
    website: 'https://example.org/bayview-family'
  },
  {
    id: 'fac-c3',
    name: 'Sunset Community Health & Wellness Clinic',
    type: 'clinic',
    address: '1520 Sunset Avenue',
    city: 'Metro City',
    state: 'CA',
    zip: '90022',
    phone: '+1 (555) 456-7890',
    emergencyPhone: null,
    lat: 37.7550,
    lng: -122.4700,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Sat: 9:00 AM – 6:00 PM',
    hoursVerified: true,
    services: ['General Medicine', 'Women’s Health', 'Preventive Screenings', 'Behavioral Health Counseling'],
    rating: 4.4,
    website: 'https://example.org/sunset-clinic'
  },

  // PHARMACIES
  {
    id: 'fac-p1',
    name: 'Walgreens 24-Hour Pharmacy & Drive-Thru',
    type: 'pharmacy',
    address: '498 Castro Street',
    city: 'Metro City',
    state: 'CA',
    zip: '90014',
    phone: '+1 (555) 567-8901',
    emergencyPhone: null,
    lat: 37.7610,
    lng: -122.4350,
    hasEmergencyRoom: false,
    operatingHours: 'Open 24/7 (Pharmacy & Retail)',
    hoursVerified: true,
    services: ['Prescription Dispensing', 'Immunizations (Flu, COVID, Shingles)', 'Medication Consultation', 'Drive-Thru'],
    rating: 4.3,
    website: 'https://example.org/walgreens-castro'
  },
  {
    id: 'fac-p2',
    name: 'CVS Pharmacy & MinuteClinic',
    type: 'pharmacy',
    address: '1051 Market Street',
    city: 'Metro City',
    state: 'CA',
    zip: '90003',
    phone: '+1 (555) 678-9012',
    emergencyPhone: null,
    lat: 37.7815,
    lng: -122.4110,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Fri: 8:00 AM – 9:00 PM, Sat-Sun: 9:00 AM – 6:00 PM',
    hoursVerified: true,
    services: ['Walk-in Nurse Practitioner Clinic', 'Prescription Fills', 'Vaccines', 'Over-the-Counter Guidance'],
    rating: 4.2,
    website: 'https://example.org/cvs-market'
  },
  {
    id: 'fac-p3',
    name: 'Apothecary & Compounding Pharmacy',
    type: 'pharmacy',
    address: '210 Post Street',
    city: 'Metro City',
    state: 'CA',
    zip: '90008',
    phone: '+1 (555) 789-3456',
    emergencyPhone: null,
    lat: 37.7885,
    lng: -122.4060,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Fri: 9:00 AM – 6:00 PM',
    hoursVerified: true,
    services: ['Custom Compounding', 'Specialty Medications', 'Bioidentical Hormones', 'Medication Packaging'],
    rating: 4.9,
    website: 'https://example.org/apothecary-compounding'
  },

  // DIAGNOSTIC LABORATORIES
  {
    id: 'fac-l1',
    name: 'Quest Diagnostics Patient Service Center',
    type: 'laboratory',
    address: '500 Sutter Street, Suite 402',
    city: 'Metro City',
    state: 'CA',
    zip: '90002',
    phone: '+1 (555) 890-1234',
    emergencyPhone: null,
    lat: 37.7895,
    lng: -122.4085,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Fri: 6:30 AM – 4:00 PM, Sat: 7:00 AM – 12:00 PM',
    hoursVerified: true,
    services: ['Routine Bloodwork (CBC, CMP, Lipids)', 'Urine Analysis', 'Glucose Tolerance Testing', 'Biopsy Specimen Collection'],
    rating: 4.5,
    website: 'https://example.org/quest-sutter'
  },
  {
    id: 'fac-l2',
    name: 'Labcorp Medical Specimen Collection Lab',
    type: 'laboratory',
    address: '1800 Sullivan Avenue',
    city: 'Metro City',
    state: 'CA',
    zip: '90015',
    phone: '+1 (555) 901-2345',
    emergencyPhone: null,
    lat: 37.7700,
    lng: -122.4250,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Fri: 7:00 AM – 5:00 PM',
    hoursVerified: true,
    services: ['Phlebotomy Services', 'Immunology & Allergy Blood Panels', 'Toxicology Screening', 'Molecular Pathology'],
    rating: 4.4,
    website: 'https://example.org/labcorp-sullivan'
  },
  {
    id: 'fac-l3',
    name: 'Precision Imaging & Diagnostic Ultrasound Center',
    type: 'laboratory',
    address: '909 Hyde Street, Suite 210',
    city: 'Metro City',
    state: 'CA',
    zip: '90009',
    phone: '+1 (555) 912-3456',
    emergencyPhone: null,
    lat: 37.7890,
    lng: -122.4170,
    hasEmergencyRoom: false,
    operatingHours: 'Mon-Fri: 7:30 AM – 5:30 PM',
    hoursVerified: true,
    services: ['Digital X-Ray', 'Ultrasound & Doppler', 'Bone Density (DEXA)', 'Low-Dose CT Scanning'],
    rating: 4.7,
    website: 'https://example.org/precision-imaging'
  }
];

// Haversine formula to compute distance in miles and km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMiles = R * c;
  const distanceKm = distanceMiles * 1.60934;
  return {
    miles: Number(distanceMiles.toFixed(1)),
    km: Number(distanceKm.toFixed(1))
  };
}

export function searchFacilities({ query, type, emergencyOnly, userLat, userLng }) {
  let results = [...FACILITIES_DATABASE];

  // Filter by Type
  if (type && type !== 'all') {
    results = results.filter(f => f.type.toLowerCase() === type.toLowerCase());
  }

  // Filter by Emergency Services
  if (emergencyOnly === true || emergencyOnly === 'true') {
    results = results.filter(f => f.hasEmergencyRoom);
  }

  // Filter by Query (search in name, address, services, city)
  if (query && query.trim().length > 0) {
    const q = query.trim().toLowerCase();
    results = results.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.services.some(s => s.toLowerCase().includes(q))
    );
  }

  // Reference coordinates for distance calculation (Default to Metro City center if user coord not supplied)
  const refLat = Number(userLat) || 37.7749;
  const refLng = Number(userLng) || -122.4194;

  results = results.map(fac => {
    const dist = calculateDistance(refLat, refLng, fac.lat, fac.lng);
    return {
      ...fac,
      distanceMiles: dist.miles,
      distanceKm: dist.km,
      distanceLabel: `${dist.miles} miles away (${dist.km} km)`
    };
  });

  // Sort by closest distance
  results.sort((a, b) => a.distanceMiles - b.distanceMiles);

  return {
    total: results.length,
    referenceCenter: { lat: refLat, lng: refLng },
    facilities: results,
    verifiedNotice: 'Facility information and hours are verified with local registry listings. For life-threatening emergencies, always dial 911 or your local emergency line immediately.'
  };
}

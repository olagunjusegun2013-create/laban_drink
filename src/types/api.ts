export type DepotType = 'confirmed_depot' | 'coverage_location';
export type AvailabilityStatus = 'Operational' | 'Limited Stock' | 'Coverage / Enquiry';
export type ApplicationStatus = 'New' | 'Under Review' | 'Approved' | 'Declined';
export type ContactStatus = 'Unread' | 'Responded' | 'Archived';

export interface DepotRecord {
  id: string;
  state: string;
  region: string;
  depotName: string;
  depotType: DepotType;
  address: string;
  phone: string;
  operatingHours: string;
  availabilityStatus: AvailabilityStatus;
  updatedAt: string;
}

export interface BrandContactConfig {
  companyName: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress: string;
  businessHours: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    x: string;
    linkedin: string;
  };
}

export interface DistributorApplication {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  state: string;
  businessLocation: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface ProductEnquiry {
  id: string;
  productId: string;
  productName: string;
  bottleSize: string;
  enquiryType: 'Retail' | 'Wholesale' | 'Event Catering';
  name: string;
  phone: string;
  email: string;
  state: string;
  notes: string;
  createdAt: string;
}

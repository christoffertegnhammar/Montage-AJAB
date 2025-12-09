
export interface User {
  email: string;
  role: 'ADMIN' | 'INSTALLER';
}

export interface Job {
  id: string;
  customerName: string;
  address: string;
  contactPerson: string;
  phone: string;
  description: string;
  startDate: string; // ISO String YYYY-MM-DD HH:mm
  endDate: string;   // ISO String YYYY-MM-DD HH:mm
  assignedInstallers: string[]; // List of installer emails
  pdfFiles: PDFFile[];
  status: 'ACTIVE' | 'COMPLETED';
  completedAt?: string; // ISO Date string
}

export interface PDFFile {
  id: string;
  name: string;
  size: string;
  url: string; 
}

export interface RiskItem {
  id: string;
  category: string;
  hazard: string;
  measure: string;
  riskLevel?: 'L' | 'M' | 'H';
  checked: boolean;
  isAiSuggested?: boolean;
}

export interface RiskAnalysisData {
  jobId: string;
  installerName: string;
  timestamp: string;
  items: RiskItem[];
  additionalNotes: string;
}

export interface SelfCheckItem {
  id: string;
  label: string;
  status: 'OK' | 'EJ_OK';
  comment?: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  JOB_LIST = 'JOB_LIST',
  JOB_DETAILS = 'JOB_DETAILS',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
  SELF_CHECK = 'SELF_CHECK',
}

// Centralized Constants
export const ADMIN_EMAILS = [
  'anna@ajabs.se', 
  'christoffer@ajabs.se',
  'admin@ajabs.se'
];

export const INSTALLER_EMAILS = [
  'sebastian.hillar@ajabs.se',
  'jens.lindback@ajabs.se',
  'anders.hansson@ajabs.se',
  'anton.petursson@ajabs.se'
];

export const SELF_CHECK_ITEMS_CONST = [
  "Ankomstkontroll - kontrollera så att godset ej är skadat, ockulär besiktning.",
  "Kontroll av infästning och montering",
  "Kontroll av gummitätningar, se till att porten är tät",
  "Kontroll av port/dörrgång så att rörelsen är som den ska",
  "Kontroll av spanjoletter, de går lätt att öppna & stänga.",
  "Kontroll så att inga skador uppstått på porten",
  "Kontroll av städning, allt material är undanplockat och arbetsplatsen är bra städad."
];

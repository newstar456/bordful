// 'use client';
import { APITable } from 'apitable';
// import Airtable from 'airtable';
import {
  CURRENCY_CODES,
  CURRENCY_RATES,
  type CurrencyCode,
  formatCurrencySymbol,
  getCurrencyByName,
} from '@/lib/constants/currencies';
import {
  getLanguageByName,
  LANGUAGE_CODES,
  type LanguageCode,
} from '@/lib/constants/languages';
import type { RemoteRegion, WorkplaceType } from '@/lib/constants/workplace';
import { normalizeMarkdown } from '@/lib/utils/markdown';

const apitable = new APITable({
  token: process.env.APITABLE_API_TOKEN as string,
  fieldKey: 'name', // default, can use 'id' to avoid column name changes
  requestTimeout: 60000, // optional, 60s
  host: 'https://api.aitable.ai/fusion/v1', // default host
});


const DATASHEET_ID = process.env.APITABLE_DATASHEET_ID || '';


export type CareerLevel =
  | 'Internship'
  | 'EntryLevel'
  | 'Associate'
  | 'Junior'
  | 'MidLevel'
  | 'Senior'
  | 'Staff'
  | 'Principal'
  | 'Lead'
  | 'Manager'
  | 'SeniorManager'
  | 'Director'
  | 'SeniorDirector'
  | 'VP'
  | 'SVP'
  | 'EVP'
  | 'CLevel'
  | 'Founder'
  | 'NotSpecified';

export type SalaryUnit = 'hour' | 'day' | 'week' | 'month' | 'year' | 'project';

export type Salary = {
  min: number | null;
  max: number | null;
  currency: CurrencyCode;
  unit: SalaryUnit;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  type?: string;
  status?: 'active' | 'inactive';
  posted_date?: number | string;
  apply_method?: any;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_unit?: string;
  career_level?: string[];
  workplace_type?: string;
  remote_region?: string;
  timezone_requirements?: string;
  workplace_city?: string;
  workplace_country?: string;
  languages?: string[];
  benefits?: string;
  application_requirements?: string;
  valid_through?: number | string;
  job_identifier?: string;
  job_source_name?: string;
  featured?: boolean;
  visa_sponsorship?: string;
  skills?: string;
  qualifications?: string;
  education_requirements?: string;
  experience_requirements?: string;
  industry?: string;
  occupational_category?: string;
  responsibilities?: string;
  apitable_id?: string;
};

// Input type (no recordId, no id field)
export type JobInput = Partial<Omit<Job, "id">>;

// -------------------------------
// Query: Get all jobs (with pagination)
// -------------------------------

export async function getJobs(): Promise<Job[]> {
  try {
  const datasheet = apitable.datasheet(DATASHEET_ID);
  const allRecords: Job[] = [];
  const iter = datasheet.records.queryAll({ viewId: "viwx65RM2KhKT", cellFormat: 'json' });

  for await (const records of iter) {
    if (!records || !Array.isArray(records)) continue;

    for (const record of records) {
      const f = record.fields || {};

      allRecords.push({
        id: record.recordId,
        title: f.title as string,
        company: f.company as string,
        type: f.type as string,
        status: f.status as "active" | "inactive",
        posted_date: f.posted_date as number | string,
        apply_method: f.apply_method as any,
        description: f.description as string,
        salary_min: f.salary_min as number,
        salary_max: f.salary_max as number,
        salary_currency: f.salary_currency as string,
        salary_unit: f.salary_unit as string,
        career_level: Array.isArray(f.career_level) ? f.career_level : [],
        workplace_type: f.workplace_type as string,
        remote_region: f.remote_region as string,
        timezone_requirements: f.timezone_requirements as string,
        workplace_city: f.workplace_city as string,
        workplace_country: f.workplace_country as string,
        languages: Array.isArray(f.languages) ? f.languages : [],
        benefits: f.benefits as string,
        application_requirements: f.application_requirements as string,
        valid_through: f.valid_through as number | string,
        job_identifier: f.job_identifier as string,
        job_source_name: f.job_source_name as string,
        featured: f.featured as boolean,
        visa_sponsorship: f.visa_sponsorship as string,
        skills: f.skills as string,
        qualifications: f.qualifications as string,
        education_requirements: f.education_requirements as string,
        experience_requirements: f.experience_requirements as string,
        industry: f.industry as string,
        occupational_category: f.occupational_category as string,
        responsibilities: f.responsibilities as string,
        apitable_id: f.apitable_id as string
      });
    }
  }

  return allRecords;
    } catch (error) {
      console.error("Error fetching jobs from APITable:", error);
      return [];
    }
}

// -------------------------------
// Query: Get a single job by recordId
// -------------------------------
export async function getJob(recordId: string): Promise<Job | null> {
  try {
    const datasheet = apitable.datasheet(DATASHEET_ID);
    const res = await datasheet.records.query({
      recordIds: [recordId],
      cellFormat: "json",
      maxRecords: 1,
    });

    if (!res.success || !res.data.records?.length) return null;

    const record = res.data.records[0];
    const f = record.fields;

    return {
        id: record.recordId,
        title: f.title as string,
        company: f.company as string,
        type: f.type as string,
        status: f.status as "active" | "inactive",
        posted_date: f.posted_date as number | string,
        apply_method: f.apply_method as any,
        description: f.description as string,
        salary_min: f.salary_min as number,
        salary_max: f.salary_max as number,
        salary_currency: f.salary_currency as string,
        salary_unit: f.salary_unit as string,
        career_level: Array.isArray(f.career_level) ? f.career_level : [],
        workplace_type: f.workplace_type as string,
        remote_region: f.remote_region as string,
        timezone_requirements: f.timezone_requirements as string,
        workplace_city: f.workplace_city as string,
        workplace_country: f.workplace_country as string,
        languages: Array.isArray(f.languages) ? f.languages : [],
        benefits: f.benefits as string,
        application_requirements: f.application_requirements as string,
        valid_through: f.valid_through as number | string,
        job_identifier: f.job_identifier as string,
        job_source_name: f.job_source_name as string,
        featured: f.featured as boolean,
        visa_sponsorship: f.visa_sponsorship as string,
        skills: f.skills as string,
        qualifications: f.qualifications as string,
        education_requirements: f.education_requirements as string,
        experience_requirements: f.experience_requirements as string,
        industry: f.industry as string,
        occupational_category: f.occupational_category as string,
        responsibilities: f.responsibilities as string,
        apitable_id: f.apitable_id as string
    };
  } catch (err) {
    console.error("Error fetching job:", err);
    return null;
  }
}

// -------------------------------
// Create a new APITable record
// -------------------------------

export async function createJob(data: JobInput) {
  const datasheet = apitable.datasheet(DATASHEET_ID);

  const res = await datasheet.records.create([
    {
      fields: {
        ...data,
      },
    },
  ]);

  if (!res.success) throw new Error("APITable create failed");

  return res.data.records[0];
}
// -------------------------------
// Update an existing record
// -------------------------------

export async function updateJob(recordId: string, data: JobInput) {
  const datasheet = apitable.datasheet(DATASHEET_ID);

  const res = await datasheet.records.update([
    {
      recordId,
      fields: {
        ...data,
        updatedAt: Date.now(), // optional but valid
      },
    },
  ]);

  if (!res.success) throw new Error("APITable update failed");

  return res.data.records[0];
}

// -------------------------------
// Upsert by job_identifier
// -------------------------------

export async function upsertJob(job_identifier: string, data: JobInput) {
  const datasheet = apitable.datasheet(DATASHEET_ID);

  // Search for existing job
  const res = await datasheet.records.query({
    filterByFormula: `{job_identifier} = "${job_identifier}"`,
    maxRecords: 1,
    cellFormat: "json",
  });

  const existing = res.success && res.data.records?.[0];

  if (existing) {
    return updateJob(existing.recordId, data);
  } else {
    return createJob({ ...data, job_identifier });
  }
}


// // Format salary for display
export function formatSalary(
  salary: Salary | null,
  showCurrencyCode = false
): string {
  if (!(salary && (salary.min || salary.max))) {
    return 'Not specified';
  }

  const formattedSymbol = formatCurrencySymbol(salary.currency);

  const formatNumber = (
    num: number | null,
    _currency: CurrencyCode,
    forceScale?: 'k' | 'M'
  ): string => {
    if (!num) {
      return '';
    }

    // Define consistent thresholds for all currencies
    const kThreshold = 10_000;
    const mThreshold = 1_000_000;

    // Apply forced scale if provided (for consistent range formatting)
    if (forceScale === 'M') {
      return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (forceScale === 'k') {
      return `${(num / 1000).toFixed(0)}k`;
    }

    // Format with appropriate scale based on magnitude
    if (num >= mThreshold) {
      return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (num >= kThreshold) {
      return `${(num / 1000).toFixed(0)}k`;
    }

    // For smaller numbers, show the full value with thousands separator
    return num.toLocaleString();
  };

  // Handle single value cases (only min or only max)
  let range;
  if (salary.min && salary.max) {
    // Determine the appropriate scale for both values based on the larger number
    let forceScale: 'k' | 'M' | undefined;

    // Use consistent thresholds for all currencies
    if (Math.max(salary.min, salary.max) >= 1_000_000) {
      forceScale = 'M'; // Force both values to use millions
    } else if (Math.max(salary.min, salary.max) >= 10_000) {
      forceScale = 'k'; // Force both values to use thousands
    }

    range =
      salary.min === salary.max
        ? formatNumber(salary.min, salary.currency)
        : `${formatNumber(
            salary.min,
            salary.currency,
            forceScale
          )}-${formatNumber(salary.max, salary.currency, forceScale)}`;
  } else {
    range = formatNumber(salary.min || salary.max, salary.currency);
  }

  // Use full words with slash
  const unitDisplay = {
    hour: '/hour',
    day: '/day',
    week: '/week',
    month: '/month',
    year: '/year',
    project: '/project',
  }[salary.unit];

  // Add currency code in parentheses if requested
  const currencyCode = showCurrencyCode ? ` (${salary.currency})` : '';

  return `${formattedSymbol}${range}${unitDisplay}${currencyCode}`;
}

// // Format USD approximation for non-USD salaries
export function formatUSDApproximation(salary: Salary | null): string | null {
  if (!(salary && (salary.min || salary.max)) || salary.currency === 'USD') {
    return null;
  }

//   // Create a USD equivalent salary object
  const usdSalary: Salary = {
    min: salary.min ? salary.min * CURRENCY_RATES[salary.currency] : null,
    max: salary.max ? salary.max * CURRENCY_RATES[salary.currency] : null,
    currency: 'USD',
    unit: salary.unit,
  };

//   // Format without currency code
  const formatted = formatSalary(usdSalary, false);
  return `≈ ${formatted}`;
}

// // Normalize salary for comparison (convert to annual USD)
export function normalizeAnnualSalary(salary: Salary | null): number {
  if (!(salary && (salary.min || salary.max))) {
    return -1;
  }

//   // Use the conversion rates from the currency constants
  const exchangeRate = CURRENCY_RATES[salary.currency] || 1;

//   // Annualization multipliers
  const annualMultiplier: Record<SalaryUnit, number> = {
    hour: 2080, // 40 hours/week * 52 weeks
    day: 260, // 52 weeks * 5 days
    week: 52,
    month: 12,
    year: 1,
    project: 1, // Projects treated as one-time annual equivalent
  };

  const value = salary.max || salary.min || 0;
  return value * exchangeRate * annualMultiplier[salary.unit];
}

// // Ensure career level is always returned as an array
function normalizeCareerLevel(value: unknown): CareerLevel[] {
  if (!value) {
    return ['NotSpecified'];
  }

  if (Array.isArray(value)) {
    // Convert Airtable's display values to our enum values
    return value.map((level) => {
      // Handle Airtable's display format (e.g., "Entry Level" -> "EntryLevel")
      const normalized = level.replace(/\s+/g, '');
      return normalized as CareerLevel;
    });
  }

//   // Handle single value
  const normalized = (value as string).replace(/\s+/g, '');
  return [normalized as CareerLevel];
}

function normalizeWorkplaceType(value: unknown): WorkplaceType {
  if (
    typeof value === 'string' &&
    ['On-site', 'Hybrid', 'Remote'].includes(value)
  ) {
    return value as WorkplaceType;
  }
  // If the value is undefined or invalid, check if there's a remote_region
  // If there is, it's probably a remote job
  if (value === undefined || value === null) {
    return 'Not specified';
  }
  return 'Not specified';
}

function normalizeRemoteRegion(value: unknown): RemoteRegion {
  if (typeof value === 'string') {
    const validRegions = [
      'Worldwide',
      'Americas Only',
      'Europe Only',
      'Asia-Pacific Only',
      'US Only',
      'EU Only',
      'UK/EU Only',
      'US/Canada Only',
    ];
    if (validRegions.includes(value)) {
      return value as RemoteRegion;
    }
  }
  return null;
}

// Function to normalize language data from Airtable
// This can handle multiple formats:
// - ISO codes directly: "en", "fr"
// - "Language Name (code)" format: "English (en)", "French (fr)"
// - Language names: "English", "French" (via lookup)
function normalizeLanguages(value: unknown): LanguageCode[] {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        // Format 1: Extract code from "Language Name (code)" format
        const languageCodeMatch = /.*?\(([a-z]{2})\)$/i.exec(item);
        if (languageCodeMatch?.[1]) {
          const extractedCode = languageCodeMatch[1].toLowerCase();

          // Verify the extracted code is valid
          if (LANGUAGE_CODES.includes(extractedCode as LanguageCode)) {
            return extractedCode as LanguageCode;
          }
        }

        // Format 2: Check if the string itself is a valid 2-letter code
        if (
          item.length === 2 &&
          LANGUAGE_CODES.includes(item.toLowerCase() as LanguageCode)
        ) {
          return item.toLowerCase() as LanguageCode;
        }

        // Format 3: Try to look up by language name
        const language = getLanguageByName(item);
        if (language) {
          return language.code as LanguageCode;
        }
      }

      return null;
    })
    .filter((code): code is LanguageCode => code !== null);
}

// // Function to normalize currency data from Airtable
// // This can handle multiple formats:
// // - ISO codes directly: "USD", "EUR" or crypto codes: "USDT", "DOGE"
// // - "Currency Code (Name)" format: "USD (United States Dollar)", "USDT (Tether USD)"
// // - Currency names: "United States Dollar", "Tether USD" (via lookup)
function normalizeCurrency(value: unknown): CurrencyCode {
  if (!value) {
    return 'USD'; // Default to USD if no currency specified
  }

  if (typeof value === 'string') {
    // Format 1: Extract code from "USD (United States Dollar)" or "USDT (Tether USD)" format
    const currencyCodeMatch = /^([A-Z]{2,5})\s*\(.*?\)$/i.exec(value);
    if (currencyCodeMatch?.[1]) {
      const extractedCode = currencyCodeMatch[1].toUpperCase();

      // Verify the extracted code is valid
      if (CURRENCY_CODES.includes(extractedCode as CurrencyCode)) {
        return extractedCode as CurrencyCode;
      }
    }

    // Format 2: Check if the string itself is a valid currency code (2-5 letters for crypto)
    const upperCaseValue = value.toUpperCase();
    if (CURRENCY_CODES.includes(upperCaseValue as CurrencyCode)) {
      return upperCaseValue as CurrencyCode;
    }

    // Format 3: Try to look up by currency name
    const currency = getCurrencyByName(value);
    if (currency) {
      return currency.code;
    }
  }

//   // Default to USD if we can't determine the currency
  return 'USD';
}

// // Function to normalize benefits text with a maximum length
function normalizeBenefits(value: unknown): string | null {
  if (!value) {
    return null;
  }

//   // Convert to string if it's not already
  const benefitsText = String(value).trim();

  // If empty after trimming, return null
  if (!benefitsText) {
    return null;
  }

//   // Trim to maximum 1000 characters for safety
  const MAX_BENEFITS_LENGTH = 1000;
  if (benefitsText.length > MAX_BENEFITS_LENGTH) {
    return benefitsText.substring(0, MAX_BENEFITS_LENGTH).trim();
  }

  return benefitsText;
}

// // Function to normalize application requirements with a maximum length
function normalizeApplicationRequirements(value: unknown): string | null {
  if (!value) {
    return null;
  }

//   // Convert to string if it's not already
  const requirementsText = String(value).trim();

//   // If empty after trimming, return null
  if (!requirementsText) {
    return null;
  }

//   // Trim to maximum 1000 characters for safety
  const MAX_REQUIREMENTS_LENGTH = 1000;
  if (requirementsText.length > MAX_REQUIREMENTS_LENGTH) {
    return requirementsText.substring(0, MAX_REQUIREMENTS_LENGTH).trim();
  }

  return requirementsText;
}

// // Function to normalize visa sponsorship field
function normalizeVisaSponsorship(
  value: unknown
): 'Yes' | 'No' | 'Not specified' {
  if (!value) {
    return 'Not specified';
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim();

    // Case-insensitive check for yes
    if (/^yes$/i.test(normalizedValue)) {
      return 'Yes';
    }

    // Case-insensitive check for no
    if (/^no$/i.test(normalizedValue)) {
      return 'No';
    }
  }

  return 'Not specified';
}



export async function testConnection() {
  try {
    const datasheet = apitable.datasheet(DATASHEET_ID);
    const response = await datasheet.records.query({ maxRecords: 1 });
    return response.success && response.data.records.length > 0;
  } catch (error) {
    console.error('APITable connection test failed:', error);
    return false;
  } 
}

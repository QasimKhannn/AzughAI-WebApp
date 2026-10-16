import { Country } from "../types";

/**
 * Maps common country names to their standardized format
 * This helps ensure consistency when saving location data
 */
export const mapCountryNameToCode = (countryName: string): Country => {
  const countryMappings: Record<string, { name: string; code: string }> = {
    // North America
    "United States": { name: "United States", code: "US" },
    "USA": { name: "United States", code: "US" },
    "Canada": { name: "Canada", code: "CA" },
    "Mexico": { name: "Mexico", code: "MX" },

    // Europe
    "United Kingdom": { name: "United Kingdom", code: "GB" },
    "UK": { name: "United Kingdom", code: "GB" },
    "Germany": { name: "Germany", code: "DE" },
    "France": { name: "France", code: "FR" },
    "Italy": { name: "Italy", code: "IT" },
    "Spain": { name: "Spain", code: "ES" },
    "Netherlands": { name: "Netherlands", code: "NL" },
    "Belgium": { name: "Belgium", code: "BE" },
    "Switzerland": { name: "Switzerland", code: "CH" },
    "Austria": { name: "Austria", code: "AT" },
    "Sweden": { name: "Sweden", code: "SE" },
    "Norway": { name: "Norway", code: "NO" },
    "Denmark": { name: "Denmark", code: "DK" },
    "Finland": { name: "Finland", code: "FI" },
    "Poland": { name: "Poland", code: "PL" },
    "Czech Republic": { name: "Czech Republic", code: "CZ" },
    "Hungary": { name: "Hungary", code: "HU" },
    "Portugal": { name: "Portugal", code: "PT" },
    "Greece": { name: "Greece", code: "GR" },
    "Ireland": { name: "Ireland", code: "IE" },

    // Middle East
    "United Arab Emirates": { name: "United Arab Emirates", code: "AE" },
    "UAE": { name: "United Arab Emirates", code: "AE" },
    "Saudi Arabia": { name: "Saudi Arabia", code: "SA" },
    "Qatar": { name: "Qatar", code: "QA" },
    "Kuwait": { name: "Kuwait", code: "KW" },
    "Bahrain": { name: "Bahrain", code: "BH" },
    "Oman": { name: "Oman", code: "OM" },
    "Lebanon": { name: "Lebanon", code: "LB" },
    "Jordan": { name: "Jordan", code: "JO" },
    "Israel": { name: "Israel", code: "IL" },

    // Asia
    "Japan": { name: "Japan", code: "JP" },
    "China": { name: "China", code: "CN" },
    "South Korea": { name: "South Korea", code: "KR" },
    "Singapore": { name: "Singapore", code: "SG" },
    "India": { name: "India", code: "IN" },
    "Thailand": { name: "Thailand", code: "TH" },
    "Malaysia": { name: "Malaysia", code: "MY" },
    "Indonesia": { name: "Indonesia", code: "ID" },
    "Philippines": { name: "Philippines", code: "PH" },
    "Vietnam": { name: "Vietnam", code: "VN" },

    // Oceania
    "Australia": { name: "Australia", code: "AU" },
    "New Zealand": { name: "New Zealand", code: "NZ" },

    // Africa
    "South Africa": { name: "South Africa", code: "ZA" },
    "Egypt": { name: "Egypt", code: "EG" },
    "Morocco": { name: "Morocco", code: "MA" },
    "Nigeria": { name: "Nigeria", code: "NG" },
    "Kenya": { name: "Kenya", code: "KE" },

    // South America
    "Brazil": { name: "Brazil", code: "BR" },
    "Argentina": { name: "Argentina", code: "AR" },
    "Chile": { name: "Chile", code: "CL" },
    "Colombia": { name: "Colombia", code: "CO" },
    "Peru": { name: "Peru", code: "PE" },
  };

  const mapping = countryMappings[countryName];
  
  if (mapping) {
    return mapping;
  }

  // Fallback: return the original name with a generated code
  return {
    name: countryName,
    code: countryName.substring(0, 2).toUpperCase()
  };
};

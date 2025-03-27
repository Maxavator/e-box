// Regular expression for SA ID validation - 13 digits
export const isSaId = (input: string): boolean => {
  const saIdRegex = /^\d{13}$/;
  return saIdRegex.test(input);
};

// Function to create email format from SA ID for authentication
export const formatSaIdToEmail = (saId: string): string => {
  return `${saId}@said.auth`;
};

// Function to format SA ID into password - always returns the standard password
export const formatSaIdPassword = (saId: string): string => {
  // All SA ID logins use this standard password
  return "StaffPass123!";
};

// Basic SA ID validation (could be expanded)
export const validateSaId = (saId: string): { isValid: boolean; message?: string } => {
  if (!saId || saId.trim() === '') {
    return { isValid: false, message: "SA ID number is required" };
  }
  
  if (!isSaId(saId)) {
    return { isValid: false, message: "SA ID must be exactly 13 digits" };
  }
  
  return { isValid: true };
};

// Extract and return the date of birth from a South African ID number
export const extractDateFromSAID = (saId: string): Date | null => {
  if (!saId || saId.length !== 13) {
    return null;
  }
  
  try {
    // Extract year, month, day
    let year = parseInt(saId.substring(0, 2));
    const month = parseInt(saId.substring(2, 4));
    const day = parseInt(saId.substring(4, 6));
    
    // Determine century based on current year
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100);
    const currentYearInCentury = currentYear % 100;
    
    // If the ID year is greater than the current year in this century,
    // assume it's from the previous century
    if (year > currentYearInCentury) {
      year = (currentCentury - 1) * 100 + year;
    } else {
      year = currentCentury * 100 + year;
    }
    
    // Create and return the date
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error('Error extracting date from SA ID:', error);
    return null;
  }
};

// Determine the province from the citizenship digit in SA ID
export const getProvinceFromSAID = (saId: string): string | null => {
  if (!saId || saId.length !== 13) {
    return null;
  }
  
  try {
    // Extract citizenship/province digit (7th digit)
    const provinceDigit = parseInt(saId.substring(10, 11));
    
    // Map province codes to province names
    const provinces: Record<number, string> = {
      0: 'Cape of Good Hope',
      1: 'Transvaal',
      2: 'Natal',
      3: 'Orange Free State',
      4: 'Eastern Cape',
      5: 'Mpumalanga',
      6: 'Northern Cape',
      7: 'Limpopo',
      8: 'North West',
      9: 'Western Cape',
      // Modern codes
      10: 'Gauteng',
      11: 'KwaZulu-Natal'
    };
    
    return provinces[provinceDigit] || 'South Africa';
  } catch (error) {
    console.error('Error extracting province from SA ID:', error);
    return null;
  }
};

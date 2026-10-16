/**
 * Extracts 2-letter initials from a user's first and last name
 * Handles cases with multiple first names and last names
 * 
 * @param firstName - The first name(s) of the user
 * @param lastName - The last name(s) of the user
 * @returns A 2-character string with uppercase initials
 */
export function getUserInitials(firstName: string, lastName: string): string {
    // Handle empty or undefined inputs
    if (!firstName?.trim() && !lastName?.trim()) {
        return 'UU';
    }
    
    // Extract first initial from first name
    const firstInitial = firstName?.trim().charAt(0).toUpperCase() || '';
    
    // Extract first initial from last name
    const lastInitial = lastName?.trim().charAt(0).toUpperCase() || '';
    
    // If we have both initials, return them
    if (firstInitial && lastInitial) {
        return firstInitial + lastInitial;
    }
    
    // If we only have first name, try to get two initials from it
    if (firstInitial && !lastInitial) {
        const firstNameParts = firstName.trim().split(/\s+/);
        if (firstNameParts.length > 1) {
            const secondInitial = firstNameParts[1].charAt(0).toUpperCase();
            return firstInitial + secondInitial;
        }
        // If only one word in first name, duplicate the initial
        return firstInitial + firstInitial;
    }
    
    // If we only have last name, try to get two initials from it
    if (lastInitial && !firstInitial) {
        const lastNameParts = lastName.trim().split(/\s+/);
        if (lastNameParts.length > 1) {
            const secondInitial = lastNameParts[1].charAt(0).toUpperCase();
            return lastInitial + secondInitial;
        }
        // If only one word in last name, duplicate the initial
        return lastInitial + lastInitial;
    }
    
    // Fallback
    return 'UU';
}
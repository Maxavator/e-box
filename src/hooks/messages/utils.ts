
// Helper function to format timestamp without seconds
export const formatMessageTimestamp = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Check if timestamp is a date string or ISO string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If it's already a formatted string, just return it
      return dateString;
    }
    
    // Format date to show only hours and minutes (no seconds)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return dateString; // Return original if there's an error
  }
};

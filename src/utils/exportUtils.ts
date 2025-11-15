/**
 * Export Utilities
 * Functions for exporting data to CSV, PDF, etc.
 */

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  filename?: string;
}

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], headers: string[], filename: string = 'export.csv'): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map((row) => {
    return headers.map((header) => {
      const value = row[header] || '';
      // Escape commas and quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  const csvContent = [csvHeaders, ...csvRows].join('\n');
  return csvContent;
};

/**
 * Export data to JSON
 */
export const exportToJSON = (data: any[], filename: string = 'export.json'): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Download file (for web) or share (for mobile)
 */
export const downloadFile = async (content: string, filename: string, mimeType: string) => {
  // For React Native, use sharing API
  if (typeof navigator !== 'undefined' && navigator.share) {
    // Mobile - use share API
    const blob = new Blob([content], { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });
    
    if (navigator.share) {
      await navigator.share({
        title: filename,
        files: [file],
      });
    }
  } else {
    // Web - create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export users to CSV
 */
export const exportUsers = (users: any[]): string => {
  const headers = ['id', 'name', 'email', 'role', 'phone', 'isActive', 'createdAt'];
  return exportToCSV(users, headers, 'users.csv');
};

/**
 * Export providers to CSV
 */
export const exportProviders = (providers: any[]): string => {
  const headers = ['id', 'name', 'type', 'email', 'phone', 'rating', 'totalReviews', 'isActive'];
  return exportToCSV(providers, headers, 'providers.csv');
};

/**
 * Export bookings to CSV
 */
export const exportBookings = (bookings: any[]): string => {
  const headers = ['id', 'date', 'startTime', 'endTime', 'status', 'serviceName', 'providerName', 'customerName'];
  return exportToCSV(bookings, headers, 'bookings.csv');
};


export const brandColors = {
  primary: {
    500: '#3B82F6',
    600: '#2563EB',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const getTrustColor = (score) => {
  if (score >= 8) return '#22C55E';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
};

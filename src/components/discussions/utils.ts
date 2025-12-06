import { formatDistanceToNow } from 'date-fns';

export const getRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};

export const getUserIdentifier = (userName?: string): string => {
  // Generate or retrieve a unique identifier for like tracking
  const storedId = localStorage.getItem('rarehelp_user_identifier');
  if (storedId) return storedId;
  
  const newId = userName || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('rarehelp_user_identifier', newId);
  return newId;
};

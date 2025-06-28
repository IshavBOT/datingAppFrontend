export const formatMessageTime = (timestamp) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInHours = (now - messageDate) / (1000 * 60 * 60);

  // If less than 24 hours, show time
  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // If less than 7 days, show day name
  if (diffInHours < 168) {
    return messageDate.toLocaleDateString([], { weekday: 'short' });
  }
  
  // If less than 1 year, show date
  if (diffInHours < 8760) {
    return messageDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // If more than 1 year, show full date
  return messageDate.toLocaleDateString([], { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatChatTime = (timestamp) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInHours = (now - messageDate) / (1000 * 60 * 60);

  // If less than 24 hours, show time
  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // If less than 7 days, show day name
  if (diffInHours < 168) {
    return messageDate.toLocaleDateString([], { weekday: 'short' });
  }
  
  // If less than 1 year, show date
  if (diffInHours < 8760) {
    return messageDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // If more than 1 year, show full date
  return messageDate.toLocaleDateString([], { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  });
}; 
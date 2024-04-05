export const formatTimeSince = (time: number) => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 360000) / 60000); 
  const seconds = Math.floor((time % 60000) / 1000); 
  
  // Format the minutes and seconds with leading zeros if needed
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
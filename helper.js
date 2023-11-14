const generateOTP = () => {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string to ensure a 6-digit format
  };

  const isOTPExpired = (userEmail,userStorage) => {
    const userData = userStorage.get(userEmail);
  
    if (userData) {
      const { expirationTime } = userData;
      const currentTime = new Date();
  
      // Compare the current time with the expiration time
      return currentTime > expirationTime;
    }
  
    // If user data doesn't exist, consider it as expired
    return true;
  };

  module.exports = { generateOTP , isOTPExpired}
// hooks/useActiveUsers.js
import { useState, useEffect } from 'react';
import { getActiveUsers } from '../utils/firestoreUtils'; // Adjust the path to point to the correct location

const useActiveUsers = (videoId) => {
  const [activeUsers, setActiveUsers] = useState([]);

  const fetchActiveUsers = async () => {
    const users = await getActiveUsers(videoId);
    setActiveUsers(users);
  };

  useEffect(() => {
    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [videoId]);

  return { activeUsers, fetchActiveUsers };
};

export default useActiveUsers;

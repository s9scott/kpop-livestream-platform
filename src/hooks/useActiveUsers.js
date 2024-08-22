import { useState, useEffect } from 'react';
import { getActiveUsers } from '../utils/firestoreUtils'; // Adjust the path to point to the correct location

/**
 * Custom hook to manage and fetch active users for a given video.
 * 
 * @param {string} videoId - The ID of the video to fetch active users for.
 * @returns {Object} An object containing:
 * - `activeUsers`: The list of active users for the specified video.
 * - `fetchActiveUsers`: A function to manually fetch the active users.
 */
const useActiveUsers = (videoId) => {
  const [activeUsers, setActiveUsers] = useState([]);

  /**
   * Fetches active users from the backend and updates state.
   */
  const fetchActiveUsers = async () => {
    const users = await getActiveUsers(videoId);
    setActiveUsers(users);
  };

  useEffect(() => {
    // Fetch active users when the component mounts or videoId changes
    fetchActiveUsers();
    // Set up an interval to refresh active users every minute
    const interval = setInterval(fetchActiveUsers, 60000); // Update every minute

    // Cleanup interval on component unmount or videoId change
    return () => clearInterval(interval);
  }, [videoId]);

  return { activeUsers, fetchActiveUsers };
};

export default useActiveUsers;

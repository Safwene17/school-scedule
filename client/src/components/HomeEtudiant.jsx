import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from './Sidebar';

const HomeEtudiant = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [userDetails, setUserDetails] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetailsAndTimetable = async () => {
      try {
        // Fetch user details
        const response = await fetch(`http://localhost:5500/etudiants/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.statusText}`);
        }
        const userData = await response.json();
        setUserDetails(userData);
        console.log("User details fetched:", userData);

        // Fetch timetable based on class name
        const className = userData.classe.nom;
        const timetableData = await fetchTimetable(className);
        console.log("Timetable fetched:", timetableData);
        setTimetable(timetableData);
      } catch (error) {
        setError(error.message || "An error occurred");
        console.error("Error:", error);
      }
    };

    if (userId) {
      fetchUserDetailsAndTimetable();
    }
  }, [userId]);

  const fetchTimetable = async (className) => {
    try {
      const response = await fetch(`http://localhost:5500/timetable/get/${className}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch timetable: ${response.statusText}`);
      }
      const data = await response.json();
      return data; // Return the fetched timetable data
    } catch (error) {
      console.error("Error fetching timetable:", error);
      throw error;
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!userId) {
    return <div className="text-yellow-500">No user ID provided. Please log in again.</div>;
  }

  if (!userDetails || !timetable) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome, {userDetails.nom}</h1>
      <p className="text-lg text-gray-700 mb-6">Your class is: <span className="font-semibold">{userDetails.classe.nom}</span></p>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Timetable:</h2>

      <div className="overflow-x-auto mt-4 shadow-md border border-gray-200 rounded-lg">
        <div className="grid grid-cols-7 gap-4 p-4">
          {/* Empty space for the first column */}
          <div className="flex justify-center items-center"></div>

          {/* Days header */}
          {timetable.days.map((day, index) => (
            <div key={index} className="text-center font-medium text-gray-800 bg-blue-100 py-2 rounded-lg">
              {day}
            </div>
          ))}

          {/* Time slots and subjects */}
          {timetable.times.map((time, timeIndex) => (
            <React.Fragment key={timeIndex}>
              {/* Time slots */}
              <div className="text-center font-medium text-gray-700 bg-gray-100 py-2 rounded-lg">
                {time}
              </div>
              {/* Subjects for each time slot */}
              {timetable.subjects.map((subjects, subjectIndex) => (
                <div
                  key={subjectIndex + timeIndex}
                  className="text-center text-gray-600 py-2 border-t border-gray-200"
                >
                  {subjects[timeIndex] || "No class"}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeEtudiant;

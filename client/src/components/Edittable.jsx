import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; 

import Navbar from "./Navbar"; 
import Footer from "./Footer";
const Edittable = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [error, setError] = useState("");
  const [editingTimetable, setEditingTimetable] = useState(false);

  useEffect(() => {
    // Fetch all classes when the component mounts
    axios
      .get("http://localhost:5500/classes/all")
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        setError("Failed to fetch classes");
      });
  }, []);

  useEffect(() => {
    // If a class is selected, fetch its timetable
    if (selectedClass) {
      axios
        .get(`http://localhost:5500/timetable/get/${selectedClass}`)
        .then((response) => {
          setTimetable(response.data);
        })
        .catch((error) => {
          console.error("Error fetching timetable:", error);
          setError("Failed to fetch timetable");
        });
    }
  }, [selectedClass]); // Only fetch when selectedClass changes

  const handleClassSelect = (e) => {
    setSelectedClass(e.target.value);
    setTimetable(null); // Reset timetable when class is changed
    setEditingTimetable(false); // Reset editing mode
  };

  const handleSubjectChange = (dayIndex, timeIndex, newSubject) => {
    // Update the timetable with the new subject
    const updatedTimetable = { ...timetable };
    updatedTimetable.subjects[dayIndex][timeIndex] = newSubject;
    setTimetable(updatedTimetable);
  };

  const handleSave = () => {
    // Send the updated timetable to the server
    axios
      .put(`http://localhost:5500/timetable/update/${selectedClass}`, timetable)
      .then((response) => {
        console.log("Timetable updated:", response.data);
        setEditingTimetable(false);
        setError(""); // Clear error message if successful
      })
      .catch((error) => {
        console.error("Error updating timetable:", error);
        setError("Failed to update timetable");
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
      <Sidebar /> {/* Add Sidebar here */}
      <div className="flex-1 p-6">

        {/* Class Selection Dropdown */}
        <div className="flex justify-center text-black items-center mb-6">
          <label htmlFor="class" className="mr-4 text-lg font-medium text-gray-700">
            Choisir une Classe:
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={handleClassSelect}
            className="border border-gray-400 p-2 rounded w-full text-black"
          >
            <option value="">Sélectionner une classe</option>
            {classes.length === 0 ? (
              <option value="">Aucune classe disponible</option>
            ) : (
              classes.map((classe) => (
                <option key={classe._id} value={classe.name}>
                  {classe.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Display Timetable if selected */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {selectedClass && !timetable && !error && (
          <div className="text-gray-500">Loading timetable for {selectedClass}...</div>
        )}

        {timetable && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Timetable for {selectedClass}:</h2>

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
                    {timetable.subjects.map((subjects, dayIndex) => (
                      <div
                        key={dayIndex + timeIndex}
                        className="text-center text-gray-600 py-2 border-t border-gray-200"
                      >
                        {editingTimetable ? (
                          <input
                            type="text"
                            value={subjects[timeIndex] || ""}
                            onChange={(e) =>
                              handleSubjectChange(dayIndex, timeIndex, e.target.value)
                            }
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          subjects[timeIndex] || "No class"
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Save Button */}
            {editingTimetable ? (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setEditingTimetable(true)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
                >
                  Edit Timetable
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Edittable;

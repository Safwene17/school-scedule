import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const subjects = [
  "Math",
  "Science",
  "Physics",
  "sport",
  "English",
  "History",
  "Geography",
];

const Timetable = () => {
  const [timetable, setTimetable] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(5).fill(""))
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);

  const days = ["Monday", "Tuesday", " wednesday", "Thursday", "Friday", "Saturday"];
  const times = ["8:00-12:00", "14:00-17:00"];

  useEffect(() => {
    axios
      .get("http://localhost:5500/classes/all")
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  const handleClassSelect = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleCellChange = (dayIndex, timeIndex, subject) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[dayIndex][timeIndex] = subject;
    setTimetable(updatedTimetable);
  };

  const saveTimetableToDatabase = async () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const timetableData = {
      className: selectedClass,
      days: days,
      times: times,
      subjects: timetable,
    };

    try {
      const response = await axios.post(
        "http://localhost:5500/timetable/add",
        timetableData
      );
      console.log("Timetable saved:", response.data);
      alert("Emploi du temps enregistré avec succès.");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Erreur lors de l'enregistrement de l'emploi du temps.");
    }
  };

  const downloadPDF = () => {
    if (!selectedClass) {
      alert(
        "Veuillez sélectionner une classe avant de télécharger l'emploi du temps."
      );
      return;
    }

    const doc = new jsPDF("landscape");
    doc.setFontSize(16);
    doc.text("Time Table", 140, 10, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Classe: ${selectedClass}`, 20, 20);

    const tableHeaders = ["Heure", ...days];
    const tableBody = times.map((time, timeIndex) => [
      time,
      ...timetable.map((day) => day[timeIndex]),
    ]);

    doc.autoTable({
      head: [tableHeaders],
      body: tableBody,
      startY: 30,
      styles: {
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [100, 149, 237],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save("emploi_du_temps.pdf");

    // Save timetable to database as well
    saveTimetableToDatabase();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">
            Time Table
          </h1>

          <div className="flex justify-center text-black items-center mb-6">
            <label
              htmlFor="class"
              className="mr-4 text-lg font-medium text-gray-700"
            >
              chose a class:
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={handleClassSelect}
              className="border border-gray-400 p-2 rounded w-full text-black"
            >
              <option value="">Choose a class</option>
              {classes.length === 0 ? (
                <option value="">no class was found</option>
              ) : (
                classes.map((classe) => (
                  <option key={classe._id} value={classe.name}>
                    {classe.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <table className="border-collapse border w-full text-center shadow-lg rounded-md overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 font-medium">Heure</th>
                {days.map((day, index) => (
                  <th key={index} className="p-4 font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, timeIndex) => (
                <tr
                  key={timeIndex}
                  className={`${
                    timeIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-blue-100 transition duration-150`}
                >
                  <td className="p-3 text-gray-800 font-semibold border-b">
                    {time}
                  </td>
                  {days.map((_, dayIndex) => (
                    <td key={dayIndex} className="p-3 border-b">
                      <select
                        value={timetable[dayIndex][timeIndex]}
                        onChange={(e) =>
                          handleCellChange(dayIndex, timeIndex, e.target.value)
                        }
                        className="border border-gray-300 p-2 rounded w-full text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white mt-6 px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-200"
          >
            download PDF
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Timetable;

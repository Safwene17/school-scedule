import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Carousel from "./Carousel";

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [className, setClassName] = useState("");
  const [currentClass, setCurrentClass] = useState(null);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5500/classes/all");
      setClasses(response.data);
      setFilteredClasses(response.data);
    } catch (err) {
      setError("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(
      (classe) =>
        classe.name &&
        classe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [searchTerm, classes]);

  const handleDeleteClasse = async (classeId) => {
    try {
      await axios.delete(`http://localhost:5500/classes/${classeId}`);
      toast.success("Class deleted successfully");
      fetchClasses(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete class");
    }
  };

  const handleAddClasse = async () => {
    if (!className.trim()) {
      toast.error("Please enter a class name");
      return;
    }

    try {
      await axios.post("http://localhost:5500/classes/create", {
        nom: className,
      });
      toast.success("Class added successfully");
      setClassName("");
      setModalVisible(false);
      fetchClasses(); // Refresh data
    } catch (error) {
      toast.error("Failed to add class");
    }
  };

  const handleEditClasse = async () => {
    if (!className.trim()) {
      toast.error("Please enter a class name");
      return;
    }

    try {
      await axios.put(`http://localhost:5500/classes/${currentClass._id}`, {
        nom: className,
      });
      toast.success("Class updated successfully");
      setClassName("");
      setCurrentClass(null);
      setEditModalVisible(false);
      fetchClasses(); // Refresh data
    } catch (error) {
      toast.error("Failed to update class");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>
          <Carousel />
          <div className="mb-4">
            <button
              onClick={() => setModalVisible(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5"
            >
              Add Class
            </button>
          </div>
          {modalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Add New Class
                </h2>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter class name"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddClasse}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Class
                  </button>
                </div>
              </div>
            </div>
          )}
          {editModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Edit Class
                </h2>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter class name"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setEditModalVisible(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditClasse}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update Class
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 bg-white rounded-lg border shadow-lg">
            <table className="w-full table-auto text-sm">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Class Name</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((classe) => (
                    <tr
                      key={classe._id}
                      className="hover:bg-gray-100 transition duration-150"
                    >
                      <td className="px-6 py-4 text-gray-700">{classe.name}</td>
                      <td className="px-6 py-4 flex items-center justify-start space-x-2">
                        <button
                          onClick={() => {
                            setCurrentClass(classe);
                            setClassName(classe.name);
                            setEditModalVisible(true);
                          }}
                          className=" hover:text-blue-500 transition duration-200 btn btn-secondary"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClasse(classe._id)}
                          className="hover:text-red-600 transition duration-200 btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <ToastContainer />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

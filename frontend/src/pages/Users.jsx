import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiUserAdd } from "react-icons/ti";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Users = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const openModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${selectedId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setUsers(users.filter((u) => u._id !== selectedId));
      closeModal();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/users/register", {
        username,
        password,
      })
      .then((response) => {
        setUsername("");
        setPassword("");
        navigate("/dashboard");
        setUsers([...users, response.data]);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="users p-6">
        <form onSubmit={handleSubmit} className="useraction-container mb-6">
          <label className="block mb-2">
            Username:
            <input
              type="text"
              placeholder="username"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Password:
            <input
              type="text"
              placeholder="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create user <TiUserAdd />
          </button>
        </form>
        <hr />
        <div className="users-container mt-6">
          <input
            type="search"
            placeholder="Search user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <table className="w-full mt-4 text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Username</th>
                <th className="p-2">Created at</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 flex justify-center">
                      <button
                        onClick={() => openModal(user._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    User not found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete the user?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;

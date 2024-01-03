import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sortAgeGroups = (ageGroups) => {
    return ageGroups.sort((a, b) => a.localeCompare(b));
  };


  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const sortUsersByName = (users) => {
    return users.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdateUser = () => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) =>
        user.id === editingUser.id
          ? { ...user, ...formData, ageGroup: determineAgeGroup(formData.age) }
          : user
      );
    });
    setEditingUser(null);
    setShowModal(false);
  };

  const handleAddUser = () => {
    setUsers([
      ...users,
      {
        ...formData,
        id: users.length,
        ageGroup: determineAgeGroup(formData.age),
      },
    ]);
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", age: "" });
  };

  const handleDeleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const determineAgeGroup = (age) => {
    age = parseInt(age);
    if (age >= 1 && age <= 18) return "1-18";
    if (age >= 19 && age <= 25) return "19-25";
    if (age >= 26 && age <= 45) return "26-45";
    return "45+";
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const onDrop = (e, ageGroup) => {
    let id = e.dataTransfer.getData("id");

    let usersCopy = users.map((user) => {
      if (user.id.toString() === id) {
        user.ageGroup = ageGroup;
        user.age = getMinimumAgeForGroup(ageGroup);
      }
      return user;
    });

    setUsers(usersCopy);
  };

  const getMinimumAgeForGroup = (ageGroup) => {
    switch (ageGroup) {
      case "1-18":
        return 1;
      case "19-25":
        return 19;
      case "26-45":
        return 26;
      case "45+":
        return 45;
      default:
        return 0;
    }
  };

  return (
    <div className="App">
      <h1>Box Draggable</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
      />

      <button onClick={() => setShowModal(true)}>Add</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Age"
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
            <button onClick={editingUser ? handleUpdateUser : handleAddUser}>
              {editingUser ? "Update" : "Add"}
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="age-groups">
        {sortAgeGroups(["1-18", "19-25", "26-45", "45+"]).map((group) => (
          <div
            key={group}
            className="age-group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, group)}
          >
            <h2>Age {group}</h2>
            {sortUsersByName(
              users
                .filter((user) => user.ageGroup === group && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            ).map((user) => (
              <div
                key={user.id}
                className="card"
                draggable
                onDragStart={(e) => onDragStart(e, user.id)}
              >
                <p>
                  {user.name} - {user.email} {user.phone} ({user.age})
                </p>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

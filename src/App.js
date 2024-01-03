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

  const determineAgeGroup = (age) => {
    age = parseInt(age);
    if (age >= 1 && age <= 18) return "1-18";
    if (age >= 19 && age <= 25) return "19-25";
    if (age >= 26 && age <= 45) return "26-45";
    return "45+";
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

  return (
    <div className="App">
      <h1>Box Draggable</h1>
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
            <button onClick={handleAddUser}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="age-groups">
        {["1-18", "19-25", "26-45", "45+"].map((group) => (
          <div
            key={group}
            className="age-group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, group)}
          >
            <h2>Age {group}</h2>
            {users
              .filter((user) => user.ageGroup === group)
              .map((user) => (
                <div
                  key={user.id}
                  className="card"
                  draggable
                  onDragStart={(e) => onDragStart(e, user.id)}
                >
                  <p>
                    {user.name} - {user.email} ({user.age})
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: ""
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8084/students")
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar estudiantes: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8084/students", newStudent)
      .then(res => {
        setStudents([...students, res.data]);
        setNewStudent({ name: "", email: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar estudiante: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar este estudiante?")) {
      axios.delete(`http://127.0.0.1:8084/students/${id}`)
        .then(() => {
          setStudents(students.filter(s => s.id !== id));
        })
        .catch(err => setError("Error al eliminar estudiante: " + err.message));
    }
  };

  if (loading) return <p>Cargando estudiantes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Estudiantes</h2>
      <button onClick={() => setShowPopup(true)}>+ Agregar Estudiante</button>

      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={newStudent.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              type="email"
              name="email"
              value={newStudent.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setShowPopup(false)}>Cancelar</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button className="action" onClick={() => handleDelete(s.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;

import React, { useEffect, useState } from "react";
import axios from "axios";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: ""
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8084/teachers")
      .then(res => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar profesores: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8084/teachers", newTeacher)
      .then(res => {
        setTeachers([...teachers, res.data]);
        setNewTeacher({ name: "", email: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar profesor: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar este profesor?")) {
      axios.delete(`http://127.0.0.1:8084/teachers/${id}`)
        .then(() => {
          setTeachers(teachers.filter(t => t.id !== id));
        })
        .catch(err => setError("Error al eliminar profesor: " + err.message));
    }
  };

  if (loading) return <p>Cargando profesores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Profesores</h2>
      <button onClick={() => setShowPopup(true)}>+ Agregar Profesor</button>

      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={newTeacher.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              type="email"
              name="email"
              value={newTeacher.email}
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
          {teachers.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>
                <button className="action" onClick={() => handleDelete(t.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Teachers;

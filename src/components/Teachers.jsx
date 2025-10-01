import "../styles/teachers.css";
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
  const [editPopup, setEditPopup] = useState(false);
  const [editTeacher, setEditTeacher] = useState({ id: null, name: "", email: "" });
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");

  useEffect(() => {
    axios.get("http://44.199.207.193:8084/teachers")
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTeacher({ ...editTeacher, [name]: value });
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTeacher.name.trim()) {
      setFormError("El nombre es obligatorio.");
      return;
    }
    if (!newTeacher.email.trim()) {
      setFormError("El email es obligatorio.");
      return;
    }
    if (!validateEmail(newTeacher.email)) {
      setFormError("El email no tiene un formato válido.");
      return;
    }
    setFormError("");
    axios.post("http://44.199.207.193:8084/teachers", newTeacher)
      .then(res => {
        setTeachers([...teachers, res.data]);
        setNewTeacher({ name: "", email: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar profesor: " + err.message));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editTeacher.name.trim()) {
      setEditFormError("El nombre es obligatorio.");
      return;
    }
    if (!editTeacher.email.trim()) {
      setEditFormError("El email es obligatorio.");
      return;
    }
    if (!validateEmail(editTeacher.email)) {
      setEditFormError("El email no tiene un formato válido.");
      return;
    }
    setEditFormError("");
    axios.put(`http://44.199.207.193:8084/teachers/${editTeacher.id}`, editTeacher)
      .then(res => {
        setTeachers(teachers.map(t => t.id === editTeacher.id ? res.data : t));
        setEditPopup(false);
      })
      .catch(err => setError("Error al editar profesor: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar este profesor?")) {
      axios.delete(`http://44.199.207.193:8084/teachers/${id}`)
        .then(() => {
          setTeachers(teachers.filter(t => t.id !== id));
        })
        .catch(err => setError("Error al eliminar profesor: " + err.message));
    }
  };

  const openEditPopup = (teacher) => {
    setEditTeacher(teacher);
    setEditPopup(true);
  };

  if (loading) return <p>Cargando profesores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="teachers-index">
      <h2 className="section-title">👨‍🏫 Profesores</h2>
      <div className="index-actions">
        <button className="add-teacher-btn" onClick={() => setShowPopup(true)}>+ Agregar Profesor</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agregar Profesor</h3>
            <form className="popup-form" onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newTeacher.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-teacher-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Profesor</h3>
            <form className="popup-form" onSubmit={handleEditSubmit}>
              {editFormError && <div className="form-error">{editFormError}</div>}
              <div className="form-group">
                <label htmlFor="edit-name">Nombre</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editTeacher.name}
                  onChange={handleEditChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editTeacher.email}
                  onChange={handleEditChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-teacher-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setEditPopup(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="styled-table">
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
                  <button className="action edit-btn" title="Editar" onClick={() => openEditPopup(t)}>✏️</button>
                  <button className="action delete-btn" title="Eliminar" onClick={() => handleDelete(t.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teachers;

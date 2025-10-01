import "../styles/students.css";
import React, { useEffect, useState } from "react"; 
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);  //Variable de estado para guardar la lista de estudiantes
  const [loading, setLoading] = useState(true); // Variable de estado para indicar si los datos están cargando
  const [error, setError] = useState(null); // Variable de estado para manejar errores
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: ""
  }); // Estado para el nuevo estudiante
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar/ocultar el popup de agregar estudiante
  const [editPopup, setEditPopup] = useState(false); // Estado para mostrar/ocultar el popup de editar estudiante
  const [editStudent, setEditStudent] = useState({ id: null, name: "", email: "" }); // Estado para el estudiante que se está editando
  const [formError, setFormError] = useState(""); // Estado para errores en el formulario de agregar
  const [editFormError, setEditFormError] = useState(""); // Estado para errores en el formulario de editar

  useEffect(() => {
    axios.get("http://44.199.207.193:8084/students")
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar estudiantes: " + err.message);
        setLoading(false);
      });
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent({ ...editStudent, [name]: value });
  };

  const validateEmail = (email) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name.trim()) {
      setFormError("El nombre es obligatorio.");
      return;
    }
    if (!newStudent.email.trim()) {
      setFormError("El email es obligatorio.");
      return;
    }
    if (!validateEmail(newStudent.email)) {
      setFormError("El email no tiene un formato válido.");
      return;
    }
    setFormError("");
    axios.post("http://44.199.207.193:8084/students", newStudent)
      .then(res => {
        setStudents([...students, res.data]);
        setNewStudent({ name: "", email: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar estudiante: " + err.message));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editStudent.name.trim()) {
      setEditFormError("El nombre es obligatorio.");
      return;
    }
    if (!editStudent.email.trim()) {
      setEditFormError("El email es obligatorio.");
      return;
    }
    if (!validateEmail(editStudent.email)) {
      setEditFormError("El email no tiene un formato válido.");
      return;
    }
    setEditFormError("");
    axios.put(`http://44.199.207.193:8084/students/${editStudent.id}`, editStudent)
      .then(res => {
        setStudents(students.map(s => s.id === editStudent.id ? res.data : s));
        setEditPopup(false);
      })
      .catch(err => setError("Error al editar estudiante: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar este estudiante?")) {
      axios.delete(`http://44.199.207.193:8084/students/${id}`)
        .then(() => {
          setStudents(students.filter(s => s.id !== id));
        })
        .catch(err => setError("Error al eliminar estudiante: " + err.message));
    }
  };

  const openEditPopup = (student) => {
    setEditStudent(student);
    setEditPopup(true);
  };

  if (loading) return <p>Cargando estudiantes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="students-index">
      <h2 className="section-title">🎓 Estudiantes</h2>
      <div className="index-actions">
        <button className="add-student-btn" onClick={() => setShowPopup(true)}>+ Agregar Estudiante</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agregar Estudiante</h3>
            <form className="popup-form" onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newStudent.name}
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
                  value={newStudent.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-student-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Estudiante</h3>
            <form className="popup-form" onSubmit={handleEditSubmit}>
              {editFormError && <div className="form-error">{editFormError}</div>}
              <div className="form-group">
                <label htmlFor="edit-name">Nombre</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editStudent.name}
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
                  value={editStudent.email}
                  onChange={handleEditChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-student-btn">Guardar</button>
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
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>
                  <button className="action edit-btn" title="Editar" onClick={() => openEditPopup(s)}>✏️</button>
                  <button className="action delete-btn" title="Eliminar" onClick={() => handleDelete(s.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;

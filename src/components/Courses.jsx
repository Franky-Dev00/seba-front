import "../styles/courses.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    teacher_id: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [editCourse, setEditCourse] = useState({ id: null, title: "", teacher_id: "" });

  useEffect(() => {
    axios.get("http://44.199.207.193:8084/courses")
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar cursos: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCourse({ ...editCourse, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://44.199.207.193:8084/courses", newCourse)
      .then(res => {
        setCourses([...courses, res.data]);
        setNewCourse({ title: "", teacher_id: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar curso: " + err.message));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://44.199.207.193:8084/courses/${editCourse.id}`, editCourse)
      .then(res => {
        setCourses(courses.map(c => c.id === editCourse.id ? res.data : c));
        setEditPopup(false);
      })
      .catch(err => setError("Error al editar curso: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar este curso?")) {
      axios.delete(`http://44.199.207.193:8084/courses/${id}`)
        .then(() => {
          setCourses(courses.filter(c => c.id !== id));
        })
        .catch(err => setError("Error al eliminar curso: " + err.message));
    }
  };

  const openEditPopup = (course) => {
    setEditCourse(course);
    setEditPopup(true);
  };

  if (loading) return <p>Cargando cursos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="courses-index">
      <h2 className="section-title">📘 Cursos</h2>
      <div className="index-actions">
        <button className="add-course-btn" onClick={() => setShowPopup(true)}>+ Agregar Curso</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agregar Curso</h3>
            <form className="popup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCourse.title}
                  onChange={handleChange}
                  placeholder="Nombre del curso"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="teacher_id">ID Profesor</label>
                <input
                  type="text"
                  id="teacher_id"
                  name="teacher_id"
                  value={newCourse.teacher_id}
                  onChange={handleChange}
                  placeholder="ID del profesor"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-course-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Curso</h3>
            <form className="popup-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-title">Título</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editCourse.title}
                  onChange={handleEditChange}
                  placeholder="Nombre del curso"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-teacher_id">ID Profesor</label>
                <input
                  type="text"
                  id="edit-teacher_id"
                  name="teacher_id"
                  value={editCourse.teacher_id}
                  onChange={handleEditChange}
                  placeholder="ID del profesor"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-course-btn">Guardar</button>
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
              <th>Título</th>
              <th>ID Profesor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.teacher_id}</td>
                <td>
                  <button className="action edit-btn" title="Editar" onClick={() => openEditPopup(c)}>✏️</button>
                  <button className="action delete-btn" title="Eliminar" onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Courses;

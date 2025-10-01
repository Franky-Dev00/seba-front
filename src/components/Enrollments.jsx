import "../styles/enrollments.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEnrollment, setNewEnrollment] = useState({
    student_id: "",
    course_id: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [editEnrollment, setEditEnrollment] = useState({ id: null, student_id: "", course_id: "" });

  useEffect(() => {
    axios.get("http://44.199.207.193:8084/enrollments")
      .then(res => {
        setEnrollments(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar inscripciones: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEnrollment({ ...newEnrollment, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEnrollment({ ...editEnrollment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://44.199.207.193:8084/enrollments", newEnrollment)
      .then(res => {
        setEnrollments([...enrollments, res.data]);
        setNewEnrollment({ student_id: "", course_id: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar inscripción: " + err.message));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://44.199.207.193:8084/enrollments/${editEnrollment.id}`, editEnrollment)
      .then(res => {
        setEnrollments(enrollments.map(enr => enr.id === editEnrollment.id ? res.data : enr));
        setEditPopup(false);
      })
      .catch(err => setError("Error al editar inscripción: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar esta inscripción?")) {
      axios.delete(`http://44.199.207.193:8084/enrollments/${id}`)
        .then(() => {
          setEnrollments(enrollments.filter(e => e.id !== id));
        })
        .catch(err => setError("Error al eliminar inscripción: " + err.message));
    }
  };

  const openEditPopup = (enrollment) => {
    setEditEnrollment(enrollment);
    setEditPopup(true);
  };

  if (loading) return <p>Cargando inscripciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="enrollments-index">
      <h2 className="section-title">📝 Inscripciones</h2>
      <div className="index-actions">
        <button className="add-enrollment-btn" onClick={() => setShowPopup(true)}>+ Agregar Inscripción</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agregar Inscripción</h3>
            <form className="popup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="student_id">ID Estudiante</label>
                <input
                  type="text"
                  id="student_id"
                  name="student_id"
                  value={newEnrollment.student_id}
                  onChange={handleChange}
                  placeholder="ID del estudiante"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="course_id">ID Curso</label>
                <input
                  type="text"
                  id="course_id"
                  name="course_id"
                  value={newEnrollment.course_id}
                  onChange={handleChange}
                  placeholder="ID del curso"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-enrollment-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Inscripción</h3>
            <form className="popup-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-student_id">ID Estudiante</label>
                <input
                  type="text"
                  id="edit-student_id"
                  name="student_id"
                  value={editEnrollment.student_id}
                  onChange={handleEditChange}
                  placeholder="ID del estudiante"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-course_id">ID Curso</label>
                <input
                  type="text"
                  id="edit-course_id"
                  name="course_id"
                  value={editEnrollment.course_id}
                  onChange={handleEditChange}
                  placeholder="ID del curso"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-enrollment-btn">Guardar</button>
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
              <th>ID Estudiante</th>
              <th>ID Curso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.student_id}</td>
                <td>{e.course_id}</td>
                <td>
                  <button className="action edit-btn" title="Editar" onClick={() => openEditPopup(e)}>✏️</button>
                  <button className="action delete-btn" title="Eliminar" onClick={() => handleDelete(e.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Enrollments;

import "../styles/grades.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newGrade, setNewGrade] = useState({
    student_id: "",
    course_id: "",
    grade: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [editGrade, setEditGrade] = useState({ id: null, student_id: "", course_id: "", grade: "" });

  useEffect(() => {
    axios.get("http://44.199.207.193:8084/grades")
      .then(res => {
        setGrades(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar notas: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGrade({ ...newGrade, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditGrade({ ...editGrade, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://44.199.207.193:8084/grades", newGrade)
      .then(res => {
        setGrades([...grades, res.data]);
        setNewGrade({ student_id: "", course_id: "", grade: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar nota: " + err.message));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://44.199.207.193:8084/grades/${editGrade.id}`, editGrade)
      .then(res => {
        setGrades(grades.map(g => g.id === editGrade.id ? res.data : g));
        setEditPopup(false);
      })
      .catch(err => setError("Error al editar nota: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar esta nota?")) {
      axios.delete(`http://44.199.207.193:8084/grades/${id}`)
        .then(() => {
          setGrades(grades.filter(g => g.id !== id));
        })
        .catch(err => setError("Error al eliminar nota: " + err.message));
    }
  };

  const openEditPopup = (grade) => {
    setEditGrade(grade);
    setEditPopup(true);
  };

  if (loading) return <p>Cargando notas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grades-index">
      <h2 className="section-title">🏆 Notas</h2>
      <div className="index-actions">
        <button className="add-grade-btn" onClick={() => setShowPopup(true)}>+ Agregar Nota</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agregar Nota</h3>
            <form className="popup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="student_id">ID Estudiante</label>
                <input
                  type="text"
                  id="student_id"
                  name="student_id"
                  value={newGrade.student_id}
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
                  value={newGrade.course_id}
                  onChange={handleChange}
                  placeholder="ID del curso"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="grade">Nota</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={newGrade.grade}
                  onChange={handleChange}
                  placeholder="Nota"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-grade-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Nota</h3>
            <form className="popup-form" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-student_id">ID Estudiante</label>
                <input
                  type="text"
                  id="edit-student_id"
                  name="student_id"
                  value={editGrade.student_id}
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
                  value={editGrade.course_id}
                  onChange={handleEditChange}
                  placeholder="ID del curso"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-grade">Nota</label>
                <input
                  type="text"
                  id="edit-grade"
                  name="grade"
                  value={editGrade.grade}
                  onChange={handleEditChange}
                  placeholder="Nota"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="add-grade-btn">Guardar</button>
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
              <th>Nota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{g.student_id}</td>
                <td>{g.course_id}</td>
                <td>{g.grade}</td>
                <td>
                  <button className="action edit-btn" title="Editar" onClick={() => openEditPopup(g)}>✏️</button>
                  <button className="action delete-btn" title="Eliminar" onClick={() => handleDelete(g.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Grades;

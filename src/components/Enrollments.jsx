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

  useEffect(() => {
    axios.get("http://127.0.0.1:8084/enrollments")
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8084/enrollments", newEnrollment)
      .then(res => {
        setEnrollments([...enrollments, res.data]);
        setNewEnrollment({ student_id: "", course_id: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar inscripción: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar esta inscripción?")) {
      axios.delete(`http://127.0.0.1:8084/enrollments/${id}`)
        .then(() => {
          setEnrollments(enrollments.filter(e => e.id !== id));
        })
        .catch(err => setError("Error al eliminar inscripción: " + err.message));
    }
  };

  if (loading) return <p>Cargando inscripciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Inscripciones</h2>
      <button onClick={() => setShowPopup(true)}>+ Agregar Inscripción</button>

      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="student_id"
              value={newEnrollment.student_id}
              onChange={handleChange}
              placeholder="ID Estudiante"
              required
            />
            <input
              type="number"
              name="course_id"
              value={newEnrollment.course_id}
              onChange={handleChange}
              placeholder="ID Curso"
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
                <button className="action" onClick={() => handleDelete(e.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Enrollments;

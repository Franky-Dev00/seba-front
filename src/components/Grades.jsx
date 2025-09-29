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

  useEffect(() => {
    axios.get("http://127.0.0.1:8084/grades")
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8084/grades", newGrade)
      .then(res => {
        setGrades([...grades, res.data]);
        setNewGrade({ student_id: "", course_id: "", grade: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar nota: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar esta nota?")) {
      axios.delete(`http://127.0.0.1:8084/grades/${id}`)
        .then(() => {
          setGrades(grades.filter(g => g.id !== id));
        })
        .catch(err => setError("Error al eliminar nota: " + err.message));
    }
  };

  if (loading) return <p>Cargando notas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Notas</h2>
      <button onClick={() => setShowPopup(true)}>+ Agregar Nota</button>

      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="student_id"
              value={newGrade.student_id}
              onChange={handleChange}
              placeholder="ID Estudiante"
              required
            />
            <input
              type="number"
              name="course_id"
              value={newGrade.course_id}
              onChange={handleChange}
              placeholder="ID Curso"
              required
            />
            <input
              type="number"
              step="0.01"
              name="grade"
              value={newGrade.grade}
              onChange={handleChange}
              placeholder="Nota"
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
                <button className="action" onClick={() => handleDelete(g.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Grades;

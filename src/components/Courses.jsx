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

  useEffect(() => {
    axios.get("http://127.0.0.1:8084/courses")
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8084/courses", newCourse)
      .then(res => {
        setCourses([...courses, res.data]);
        setNewCourse({ title: "", teacher_id: "" });
        setShowPopup(false);
      })
      .catch(err => setError("Error al agregar curso: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro de eliminar este curso?")) {
      axios.delete(`http://127.0.0.1:8084/courses/${id}`)
        .then(() => {
          setCourses(courses.filter(c => c.id !== id));
        })
        .catch(err => setError("Error al eliminar curso: " + err.message));
    }
  };

  if (loading) return <p>Cargando cursos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Cursos</h2>
      <button onClick={() => setShowPopup(true)}>+ Agregar Curso</button>

      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={newCourse.title}
              onChange={handleChange}
              placeholder="Título"
              required
            />
            <input
              type="number"
              name="teacher_id"
              value={newCourse.teacher_id}
              onChange={handleChange}
              placeholder="ID Profesor"
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
                <button className="action" onClick={() => handleDelete(c.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Courses;

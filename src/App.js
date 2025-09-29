import React, { useState } from "react";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Courses from "./components/Courses";
import Enrollments from "./components/Enrollments";
import Grades from "./components/Grades";

function App() {
  const [active, setActive] = useState("students");

  const renderComponent = () => {
    switch (active) {
      case "students": return <Students />;
      case "teachers": return <Teachers />;
      case "courses": return <Courses />;
      case "enrollments": return <Enrollments />;
      case "grades": return <Grades />;
      default: return <Students />;
    }
  };

  return (
    <div className="app-container">
      <h1>📚 Sistema Académico</h1>
      <nav className="navbar">
        <button onClick={() => setActive("students")}>Students</button>
        <button onClick={() => setActive("teachers")}>Teachers</button>
        <button onClick={() => setActive("courses")}>Courses</button>
        <button onClick={() => setActive("enrollments")}>Enrollments</button>
        <button onClick={() => setActive("grades")}>Grades</button>
      </nav>
      <div className="content">{renderComponent()}</div>
    </div>
  );
}

export default App;

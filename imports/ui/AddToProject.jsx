import React from "react";

const AddToProject = ({ hash }) => {
  const { projects, task } = hash;

  return (
    <select
      name="project"
      className="dark-select"
      value={
        projects.find((project) => project._id === task.projectId)?._id || ""
      }
    >
      <option value="">Select a project</option>
      {projects.map((project) => {
        return (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        );
      })}
    </select>
  );
};

export default AddToProject;

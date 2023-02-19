import React from "react";

const ProjectsCount = ({ hash }) => {
  const { isLoading, projects, projectsCountInTasks } = hash;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex gap-20 flex-wrap"
      onClick={() => console.log("trigger")}
    >
      {projects.map((project) => {
        return (
          <div key={project._id}>
            {project.name} {`(${projectsCountInTasks[project._id] || 0})`}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsCount;

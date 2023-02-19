import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { TasksCollection } from "/imports/db/TasksCollection";
import { ProjectsCollection } from "/imports/db/ProjectsCollection";
import "/imports/api/tasksMethods";
import "/imports/api/tasksPublications";
import "/imports/api/projectsMethods";
import "/imports/api/projectsPublications";

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const insertProject = (projectName, user) =>
  ProjectsCollection.insert({
    name: projectName,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = "admin";
const SEED_PASSWORD = "password";

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach((taskText) => insertTask(taskText, user));
  }

  if (ProjectsCollection.find().count() === 0) {
    ["Todo", "In Progress", "Review", "Done"].forEach((projectName) =>
      insertProject(projectName, user)
    );
  }
});

import { Template } from "meteor/templating";
import { TasksCollection } from "/imports/db/TasksCollection";
import { ProjectsCollection } from "/imports/db/ProjectsCollection";
import { ReactiveDict } from "meteor/reactive-dict";
import { renderReactComponent } from "./react-helpers";
import "./App.html";
import "./Task.js";
import "./Login.js";
import ProjectsCount from "./ProjectsCount";

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    hideCompleted: false,
  });

  const tasksHandler = Meteor.subscribe("tasks");
  Tracker.autorun(() => {
    this.state.set("isTasksLoading", !tasksHandler.ready());
  });

  const projectsHandler = Meteor.subscribe("projects");
  Tracker.autorun(() => {
    this.state.set("isProjectsLoading", !projectsHandler.ready());
  });
});

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
};

const getTasks = () => {
  const instance = Template.instance();
  const hideCompleted = instance.state.get("hideCompleted");

  const { pendingOnlyFilter, userFilter } = getTasksFilter();

  if (!isUserLogged()) {
    return [];
  }

  return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
    sort: { createdAt: -1 },
  }).fetch();
};

const getProjectsFilter = () => {
  const user = getUser();

  const userFilter = user ? { userId: user._id } : {};

  return { userFilter };
};

const getProjects = () => {
  const { userFilter } = getProjectsFilter();

  if (!isUserLogged()) {
    return [];
  }

  return ProjectsCollection.find(userFilter, {
    sort: { createdAt: -1 },
  }).fetch();
};

Template.mainContainer.helpers({
  tasks() {
    return getTasks();
  },
  projects() {
    return getProjects();
  },
  hideCompleted() {
    return Template.instance().state.get("hideCompleted");
  },
  incompleteCount() {
    if (!isUserLogged()) {
      return "";
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount =
      TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : "";
  },
  isUserLogged() {
    return isUserLogged();
  },
  getUser() {
    return getUser();
  },
  isTasksLoading() {
    const instance = Template.instance();
    return instance.state.get("isTasksLoading");
  },
  isProjectsLoading() {
    const instance = Template.instance();
    return instance.state.get("isProjectsLoading");
  },
  projectsCountInTasks() {
    const tasks = getTasks();
    const projects = getProjects();

    const projectsCount = projects.reduce((acc, project) => {
      const tasksCount = tasks.filter(
        (task) => task.projectId === project._id
      ).length;
      return { ...acc, [project._id]: tasksCount };
    }, {});

    return projectsCount;
  },
  renderReactComponent,
  ProjectsCount() {
    return ProjectsCount;
  },
});

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get("hideCompleted");
    instance.state.set("hideCompleted", !currentHideCompleted);
  },
  "click .logout"() {
    Meteor.logout();
  },
});

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call("tasks.insert", text);

    // Clear form
    target.text.value = "";
  },
});

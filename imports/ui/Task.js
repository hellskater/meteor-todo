import { Template } from "meteor/templating";

import AddToProject from "./AddToProject";
import { renderReactComponent } from "./react-helpers";

import "./Task.html";

Template.task.events({
  "click .toggle-checked"() {
    // Set the checked property to the opposite of its current value
    Meteor.call("tasks.setIsChecked", this.ctx._id, !this.ctx.isChecked);
  },

  "click .delete"() {
    Meteor.call("tasks.remove", this.ctx._id);
  },

  "change .dark-select"(e) {
    const projectId = e.target.value;
    const taskId = this.ctx._id;

    Meteor.call("tasks.updateProjectId", taskId, projectId);
  },
});

Template.task.helpers({
  renderReactComponent,
  AddToProject() {
    return AddToProject;
  },
});

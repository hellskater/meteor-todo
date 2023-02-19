import { Meteor } from "meteor/meteor";
import { ProjectsCollection } from "/imports/db/ProjectsCollection";

Meteor.publish("projects", function publishProjects() {
  return ProjectsCollection.find({ userId: this.userId });
});

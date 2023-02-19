import { check } from "meteor/check";
import { ProjectsCollection } from "/imports/db/ProjectsCollection";

Meteor.methods({
  "projects.insert"(name) {
    check(name, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    ProjectsCollection.insert({
      name,
      createdAt: new Date(),
      userId: this.userId,
    });
  },
});

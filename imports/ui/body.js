import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
import { Tasks } from "../api/tasks.js";

import "./task.js";
import "./body.html";

Template.body.onCreated(() => {
  const instance = Template.instance();
  instance.state = new ReactiveDict();
});

Template.body.helpers({
  ending() {
    return Tasks.find({ checked: { $ne: true } }).count() == 1 ? "" : "s";
  },
  count() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  tasks() {
    const instance = Template.instance();
    if (instance.state.get("hideCompleted")) {
      return Tasks.find(
        { checked: { $ne: true } },
        { sort: { createdAt: -1 } }
      );
    }
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  }
});

Template.body.events({
  "change .hide-completed input"(event, instance) {
    instance.state.set("hideCompleted", event.target.checked);
  },
  "submit .new-task"(e) {
    e.preventDefault();

    const target = e.target;
    const text = target.text.value;

    Tasks.insert({
      text,
      createdAt: new Date()
    });

    target.text.value = "";
  }
});

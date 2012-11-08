if(typeof corona == "undefined" || !corona) {
    corona = {};
    corona.stash = {};
}

corona.groups = {};

corona.groups.getAllGroups = function(runTests, baseCall) {
	baseCall.url = "/manage/groups";
	baseCall.type = "GET";
	baseCall.beforeSend = corona.basicAuth;
	if(runTests) {
		var origSuccess = baseCall.success;
		var origError = baseCall.error;
		baseCall.success = function(data) {
			ok(true, "Fetched all groups");
			if(origSuccess) {
				origSuccess.call(this, data);
			}
		};
		baseCall.error = function(j, t, error) {
			ok(false, "Fetched all groups");
			if(origError) {
				origError.call(this, j, t, error);
			}
		};
	}
	$.ajax(baseCall);
};

corona.groups.deleteAllGroups = function(runTests, baseCall) {
	baseCall.url = "/manage/groups";
	baseCall.type = "DELETE";
	baseCall.beforeSend = corona.basicAuth;
	if(runTests) {
		var origSuccess = baseCall.success;
		var origError = baseCall.error;
		baseCall.success = function(data) {
			ok(true, "Delete all groups");
			if(origSuccess) {
				origSuccess.call(this, data);
			}
		};
		baseCall.error = function(j, t, error) {
			ok(false, "Delete all groups");
			if(origError) {
				origError.call(this, j, t, error);
			}
		};
	}
	$.ajax(baseCall);
};

corona.groups.createGroup = function(groupName, parameters, runTests, baseCall) {
	baseCall.url = "/manage/group/" + groupName;
	baseCall.type = "POST";
	baseCall.data = parameters;
	baseCall.beforeSend = corona.basicAuth;
	if(runTests) {
		var origSuccess = baseCall.success;
		var origError = baseCall.error;
		baseCall.success = function(data) {
			ok(true, "Group '" + groupName + "' created");
			corona.groups.getGroup(groupName, true, {
				success: origSuccess
			}, {}); // XXX - pass arguments
		};
		baseCall.error = function(j, t, error) {
			ok(false, "Group '" + groupName + "' created");
			if(origError) {
				origError.call(this, j, t, error);
			}
		};
	}
	$.ajax(baseCall);
};

corona.groups.getGroup = function(groupName, runTests, baseCall, creationParams) {
	baseCall.url = "/manage/group/" + groupName;
	baseCall.type = "GET";
	baseCall.beforeSend = corona.basicAuth;
	if(runTests) {
		var origSuccess = baseCall.success;
		var origError = baseCall.error;
		baseCall.success = function(data) {
			ok(true, "Group '" + groupName + "' fetched");
			equals(data.groupName, groupName, "Group name set to: " + groupName);
			if(creationParams) {
				// XXX - do the comparisons
			}
			if(origSuccess) {
				origSuccess.call(this, data);
			}
		};
		baseCall.error = function(j, t, error) {
			ok(false, "Group '" + groupName + "' fetched");
			if(origError) {
				origError.call(this, j, t, error);
			}
		};
	}
	$.ajax(baseCall);
};

corona.groups.deleteGroup = function(groupName, runTests, baseCall) {
	baseCall.url = "/manage/group/" + groupName;
	baseCall.type = "DELETE";
	baseCall.beforeSend = corona.basicAuth;
	if(runTests) {
		var origSuccess = baseCall.success;
		var origError = baseCall.error;
		baseCall.success = function(data) {
			ok(true, "Group '" + groupName + "' deleted");
			corona.groups.getAllGroups(true, {
				success: function(data) {
					var found = false;
					var i;
					for(i = 0; i < data.length; i += 1) {
						var group = data[i];
						if(group.groupName === name) {
							found = true;
						}
					}
					ok(!found, "Group '" + groupName + "' was actually deleted.");

					if(origSuccess) {
						origSuccess.call(this, data);
					}
				}
			});
		};
		baseCall.error = function(j, t, error) {
			ok(false, "Group '" + groupName + "' deleted");
			if(origError) {
				origError.call(this, j, t, error);
			}
		};
	}
	$.ajax(baseCall);
};


$(document).ready(function() {
    module("Group Management");
    asyncTest("Creating group: foo", function() {
		corona.groups.deleteAllGroups(true, {
			success: function() {
				var parameters = {
					"parentGroup": "admin-store",
					"URIPrefix": "/articles/"
				};
				corona.groups.createGroup("foo", parameters, true, {
					success: function() {
						corona.groups.deleteGroup("foo", true, {
							complete: function() { start(); }
						});
					}
				});
			}
		});
	});
});

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
			corona.groups.getGroup(groupName, true, parameters, {
				success: origSuccess
			});
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

/*
{
	"groupName": "foo",
	"subgroups": ["public","admin-store","admin-store-any-uri"],
	"URIPrefixes": ["/articles/"]'
}
*/
corona.groups.getGroup = function(groupName, runTests, creationParams, baseCall) {
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
				if(creationParams.parentGroup && typeof creationParams.parentGroup === "string") {
					var found = false;
					var i;
					for(i = 0; i < data.subgroups.length; i += 1) {
						if(data.subgroups[i] === creationParams.parentGroup) {
							found = true;
						}
					}
					ok(found, "Group parent '" + creationParams.parentGroup + "' was found.");
				}
				else if(creationParams.parentGroup) {
					var found = false;
					var i;
					var j;
					for(i = 0; i < creationParams.parentGroup.length; i += 1) {
						for(j = 0; j < data.subgroups.length; j += 1) {
							if(creationParams.parentGroup[i] === data.subgroups[j]) {
								found = true;
							}
						}
						ok(found, "Group parent '" + creationParams.parentGroup[i] + "' was found.");
					}
				}

				if(creationParams.URIPrefix && typeof creationParams.URIPrefix === "string") {
					var found = false;
					var i;
					for(i = 0; i < data.URIPrefixes.length; i += 1) {
						if(data.URIPrefixes[i] === creationParams.URIPrefix) {
							found = true;
						}
					}
					ok(found, "Group URI prefix '" + creationParams.URIPrefix + "' was found.");
				}
				else if(creationParams.URIPrefix) {
					var found = false;
					var i;
					var j;
					for(i = 0; i < creationParams.URIPrefix.length; i += 1) {
						for(j = 0; j < data.URIPrefixes.length; j += 1) {
							if(creationParams.URIPrefix[i] === data.URIPrefixes[j]) {
								found = true;
							}
						}
						ok(found, "Group URI prefix '" + creationParams.URIPrefix[i] + "' was found.");
					}
				}
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

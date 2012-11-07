if(typeof corona == "undefined" || !corona) {
    corona = {};
    corona.stash = {};
}

corona.testGroupCreation = function(name) {
    asyncTest("Creating group: " + name, function() {
        $.ajax({
            url: "/manage/group/" + name,
            type: 'POST',
			beforeSend: corona.basicAuth,
            success: function() {
                ok(true, "Group created");
				$.ajax({
					url: "/manage/group/" + name,
					type: 'GET',
					beforeSend: corona.basicAuth,
					success: function(data) {
						ok(true, "Get group");
						equals(data.groupName, name, "Group name set to: " + name);

						$.ajax({
							url: "/manage/group/" + name,
							type: 'DELETE',
							beforeSend: corona.basicAuth,
							success: function() {
								ok(true, "Deleted group: " + name);
								$.ajax({
									url: "/manage/groups",
									type: 'GET',
									beforeSend: corona.basicAuth,
									success: function(data) {
										var i = 0;
										for(i = 0; i < data.length; i += 1) {
											var group = data[i];
											if(group.groupName === name) {
												ok(false, "Group was suppose to be deleted, still exists.");
											}
										}
									},
									error: function(j, t, error) {
										ok(false, "Get group");
									},
									complete: function() { start(); }
								});
							},
							error: function(j, t, error) {
								ok(false, "Deleted group: " + name);
							}
						});
					},
					error: function(j, t, error) {
						ok(false, "Get group");
					}
                    // complete: function() { start(); }
                });
            },
            error: function(j, t, error) {
                ok(false, "Group created");
            }
        });
    });
};


$(document).ready(function() {
    module("Group Management");
	corona.testGroupCreation("foo");
});

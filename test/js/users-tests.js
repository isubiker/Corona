if(typeof corona == "undefined" || !corona) {
    corona = {};
    corona.stash = {};
}

corona.testUserCreation = function(name) {
    asyncTest("Creating user: " + name, function() {
        $.ajax({
            url: "/user",
            type: 'POST',
			data: {
				"username": name,
				"email": name + "@foo.com",
				"password": "asdf",
				"userDocument": JSON.stringify({"bar": "baz"})
			},
            success: function(data) {
				equals(data.username, name, "User name properly set");
				equals(data.primaryEmail.address, name + "@foo.com", "User email properly set");
				equals(data.primaryEmail.verified, false, "User email not verified");

				var userId = data.id;
				var varificationCode = data.primaryEmail.verificationCode;
				var sessionToken = data.session.token;

				$.ajax({
					url: "/user",
					type: 'GET',
					data: {
						"email": name + "@foo.com",
						"validateEmailCode": varificationCode
					},
					success: function() {
						ok(true, "Validated email address");
						$.ajax({
							url: "/user/" + userId,
							type: 'POST',
							data: {
								"sessionToken": sessionToken,
								"username": name + "bar",
								"email": name + "bar@foo.com",
								"password": "asdf1234",
								"userDocument": JSON.stringify({"baz": "yaz"})
							},
							success: function(data) {
								$.ajax({
									url: "/logout",
									type: 'POST',
									data: {
										"sessionToken": sessionToken
									},
									success: function(data) {
										ok(true, "Loggout user");
										$.ajax({
											url: "/login",
											type: 'GET',
											data: {
												"username": name + "bar",
												"password": "asdf1234"
											},
											success: function(data) {
												ok(true, "User logged in");
												notEqual(data.sessionToken, sessionToken, "Got a new session token");
												sessionToken = data.sessionToken;

												$.ajax({
													url: "/user?username=" + name + "bar&password=asdf1234",
													type: 'DELETE',
													success: function() {
														ok(true, "Deleted user: " + name + "bar");
														$.ajax({
															url: "/user?username=" + name + "bar",
															type: 'GET',
															success: function(data) {
																ok(false, "Could not fetch deleted user");
															},
															error: function(j, t, error) {
																ok(true, "Could not fetch deleted user");
															},
															complete: function() { start(); }
														});
													},
													error: function(j, t, error) {
														ok(false, "Deleted user: " + name);
													}
												});
											},
											error: function(j, t, error) {
												ok(false, "User logged in");
											}
										});
									},
									error: function(j, t, error) {
										ok(false, "Loggout user");
									}
								});
							},
							error: function(j, t, error) {
								ok(false, "User info not updated");
							}
						});
					},
					error: function(j, t, error) {
						ok(false, "Validated email address");
					}
				});
            },
            error: function(j, t, error) {
                ok(false, "User created");
            }
        });
    });
};


$(document).ready(function() {
    module("Users");
	corona.testUserCreation("foo");
});

if(typeof corona == "undefined" || !corona) {
    corona = {};
    corona.stash = {};
}

corona.basicAuth = function(xhr) {
	xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
};

corona.fetchInfo = function(callback) {
    asyncTest("Fetching Corona state", function() {
        $.ajax({
            url: "/manage",
            success: function(data) {
                ok(true, "Fetched Corona state");
                callback.call(this, data);
            },
            error: function(j, t, error) {
                ok(false, "Fetched Corona state");
                console.log("Could not fetch /manage: " + error);
            },
            complete: function() { start(); }
        });
    });
};

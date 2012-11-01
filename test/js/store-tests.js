if(typeof corona == "undefined" || !corona) {
    corona = {};
    corona.stash = {};
}

corona.queue = {};


corona.setup = function(callback) {
    asyncTest("Test setup", function() {
		$.ajax({
			url: "/manage/group/foogroup",
			type: 'POST',
			success: function() {
				$.ajax({
					url: "/manage/group/bargroup",
					type: 'POST',
					success: function() {
						console.log("Setup: complete");
						callback.call(this);
					},
					error: function(j, t, error) {
						console.log("Setup: could not create group");
					},
					complete: function() {
						start();
					}
				});
			},
			error: function(j, t, error) {
				console.log("Setup: could not create group");
			}
		});
	});
};

corona.teardown = function() {
	if(corona.torndown === true) {
		return;
	}
	corona.torndown = true;

    asyncTest("Test teardown", function() {
		$.ajax({
			url: "/manage/group/foogroup",
			type: 'DELETE',
			success: function() {
				$.ajax({
					url: "/manage/group/bargroup",
					type: 'DELETE',
					success: function() {
						console.log("Teardown: complete");
					},
					error: function(j, t, error) {
						console.log("Teardown: could not delete group");
					},
					complete: function() {
						start();
					}
				});
			},
			error: function(j, t, error) {
				console.log("Teardown: could not delete group");
			}
		});
	});
}

corona.documents = [
    {
        "type": "binary",
        "uri": "/doc-store-test-1.jpg",
        "content": "Mary had a little binary document.",
        "contentForBinary": '{"tagline": "Mary had a little binary document."}',
        "outputFormat": "json"
    },
    {
        "type": "text",
        "uri": "/doc-store-test-1.text",
        "content": "Mary had a little text document.",
        "outputFormat": "json"
    },
    {
        "type": "json",
        "uri": "/doc-store-test-1.json",
        "content": {
            "foo": "bar"
        }
    },
    {
        "type": "json",
        "uri": "/doc-store-test-2.json",
        "permissions": [
            {"name": "public", "type": "group", "permissions": ["read", "update"]},
            {"name": "foogroup", "type": "group", "permissions": ["read", "update"]},
            {"name": "bargroup", "type": "group", "permissions": ["read"]}
        ],
        "content": {
            "foo": "bar"
        }
    },
    {
        "type": "json",
        "uri": "/doc-store-test-3.json",
        "properties": {
            "state": "published",
            "active": "yes",
            "publishedOn": "January 15th, 2011"
        },
        "content": {
            "foo": "bar"
        }
    },
    {
        "type": "json",
        "uri": "/doc-store-test-4.json",
        "collections": [
            "published",
            "active"
        ],
        "content": {
            "foo": "bar"
        }
    },
    {
        "type": "json",
        "uri": "/doc-store-test-5.json",
        "quality": 5,
        "content": {
            "foo": "bar"
        }
    },

    {
        "type": "xml",
        "uri": "/doc-store-test-1.xml",
        "content": "<foo>bar</foo>"
    },
    {
        "type": "xml",
        "uri": "/doc-store-test-2.xml",
        "permissions": [
            {"name": "public", "type": "group", "permissions": ["read", "update"]},
            {"name": "foogroup", "type": "group", "permissions": ["read", "update"]},
            {"name": "bargroup", "type": "group", "permissions": ["read"]}
        ],
        "content": "<foo>bar</foo>"
    },
    {
        "type": "xml",
        "uri": "/doc-store-test-3.xml",
        "properties": {
            "state": "published",
            "active": "yes"
        },
        "content": "<foo>bar</foo>"
    },
    {
        "type": "xml",
        "uri": "/doc-store-test-4.xml",
        "collections": [
            "published",
            "active"
        ],
        "content": "<foo>bar</foo>"
    },
    {
        "type": "xml",
        "uri": "/doc-store-test-5.xml",
        "quality": 5,
        "content": "<foo>bar</foo>"
    },
    {
        "type": "xml",
        "uri": "/doc-with-date.xml",
        "content": "<foo>bar</foo>",
        "applyTransform": "adddate"
    },
    {
        "type": "xml",
        "uri": "/doc-store-test-6.xml",
        "permissions": [
            {"name": "nonexistant", "type": "group", "permissions": ["read"]},
        ],
        "content": "<foo>bar</foo>",
        "shouldSucceed": false
    },
    {
        "type": "xml",
        "uri": "",
        "content": "<foo>bar</foo>",
        "shouldSucceed": false
    }
];

corona.pushQueue = function(id) {
	corona.queue[id] = true;
};

corona.popQueue = function(id) {
	delete corona.queue[id];

	if(jQuery.isEmptyObject(corona.queue)) {
		corona.teardown();
	}
};


corona.constructURL = function(verb, doc, prefix, processExtras, includeOutputFormat, staticExtras) {
    var extras = [];
    if(staticExtras) {
        extras.push(staticExtras);
    }

    var permissionArg = "permission";
    var propertyArg = "property";
    var collectionArg = "collection";
    if(processExtras === "add") {
        permissionArg = "addPermission";
        propertyArg = "addProperty";
        collectionArg = "addCollection";
    }
    if(processExtras === "remove") {
        permissionArg = "removePermission";
        propertyArg = "removeProperty";
        collectionArg = "removeCollection";
    }

    if(processExtras !== "ignore") {
        if(doc.permissions !== undefined) {
			var i;
			for(i = 0; i < doc.permissions.length; i += 1) {
				var entity = doc.permissions[i];
				if(entity.type === "group" && entity.name === "public" && permissionArg === "removePermission") {
					continue;
				}
				var roles = entity.permissions;
				var j = 0;
				for(j = 0; j < roles.length; j += 1) {
					extras.push(permissionArg + "=" + entity.type + ":" + entity.name + ":" + roles[j]);
				}
			}
        }
        if(doc.properties !== undefined) {
            for(var property in doc.properties) {
                if(!(doc.properties[property] instanceof Function)) {
                    var value = doc.properties[property];
                    if(propertyArg === "removeProperty") {
                        extras.push(propertyArg + "=" + property);
                    }
                    else {
                        extras.push(propertyArg + "=" + property + ":" + value);
                    }
                }
            }
        }
        if(doc.collections !== undefined) {
            var j = 0;
            for(j = 0; j < doc.collections.length; j += 1) {
                extras.push(collectionArg + "=" + doc.collections[j]);
            }
        }
        if(doc.quality !== undefined) {
            extras.push("quality=" + doc.quality);
        }
    }

    if(includeOutputFormat && doc.outputFormat) {
        extras.push("outputFormat=" + doc.outputFormat);
    }

    if((verb === "PUT" || verb === "POST") && doc.contentForBinary) {
        extras.push("contentForBinary=" + doc.contentForBinary);
    }

    if((verb === "PUT" || verb === "POST") && doc.applyTransform) {
        extras.push("applyTransform=" + doc.applyTransform);
        extras.push("respondWithContent=true");
    }

    extras.push("uri=" + encodeURIComponent(prefix + doc.uri));
    return "/store?" + extras.join("&");
};

corona.compareJSONDocuments = function(model, actual, withExtras) {
    if(withExtras) {
        if(model.permissions !== undefined) {
			equal(actual.permissions.length, model.permissions.length, "Number of permissions matches");

			var i = 0;
			var j = 0;
			for(i = 0; i < model.permissions.length; i += 1) {
				var modelPerms = model.permissions[i];
				var found = false;
				for(j = 0; j < actual.permissions.length; j += 1) {
					var actualPerms = actual.permissions[j];
					if(actualPerms.name === modelPerms.name && actualPerms.type === modelPerms.type) {
						found = true;
						actualPerms.permissions.sort();
						modelPerms.permissions.sort();
						
						deepEqual(actualPerms.permissions, modelPerms.permissions, "Permissions for " + actualPerms.name + " match");
					}
				}
				ok(found, "Found the " + modelPerms.name + " permission");
			}
        }
        if(model.properties !== undefined) {
            deepEqual(actual.properties, model.properties, "Properties match");
        }
        if(model.collections !== undefined) {
            deepEqual(actual.collections.sort(), model.collections.sort(), "Collections match");
        }
        if(model.quality !== undefined) {
            equal(actual.quality, model.quality, "Quality matches");
        }
    }
    else {
		if(actual.permissions && actual.permissions.length === 1) {
			if(actual.permissions[0].name === "public" && actual.permissions[0].type === "group") {
				actual.permissions = [];
			}
		}

		if(actual.permissions && actual.permissions.public) {
			delete actual.permissions["public"];
		}

        deepEqual(actual.permissions, [], "No permisssions");
        deepEqual(actual.properties, {}, "No properties");
        deepEqual(actual.collections, [], "No collections");
    }

    deepEqual(model.content, actual.content, "Content matches");
};

corona.compareTextDocuments = function(model, actual, withExtras) {
    equal(model.content, actual.content, "Contet matches");
};

corona.compareXMLDocuments = function(model, xmlAsString, withExtras) {
    var parser = new DOMParser();
    var actual = parser.parseFromString(xmlAsString, "text/xml");

    if(withExtras) {
        if(model.permissions !== undefined) {
            // deepEqual(model.permissions, actual.permissions, "Permissions match");
        }
        if(model.properties !== undefined) {
            // deepEqual(model.properties, actual.properties, "Properties match");
        }
        if(model.collections !== undefined) {
            // deepEqual(model.collections.sort(), actual.collections.sort(), "Collections match");
        }
        if(model.quality !== undefined) {
            // equal(model.quality, actual.quality, "Quality matches");
        }
    }

    // deepEqual(model.content, actual.content, "Content matches");
};


corona.insertDocuments = function(prefix, withExtras) {
    var i = 0;
    for(i = 0; i < corona.documents.length; i += 1) {
        if((corona.documents[i].type === "json" && corona.stash.status.features.JSONDocs === false) || corona.documents[i].shouldSucceed === false) {
            continue;
        }

        var wrapper = function(index) {
			var requestId = Math.random() + "";
			corona.pushQueue(requestId);
            var doc = corona.documents[index];

            asyncTest("Inserting document: " + prefix + doc.uri, function() {
                var docContent = doc.content;
                if(doc.type === "json") {
                    docContent = JSON.stringify(docContent);
                }
                var processExtras = "ignore";
                if(withExtras) {
                    processExtras = "set";
                }

                $.ajax({
                    url: corona.constructURL("PUT", doc, prefix, processExtras, false),
                    type: 'PUT',
                    data: docContent,
                    context: doc,
                    success: function() {
                        ok(true, "Inserted document");
                        $.ajax({
                            url: corona.constructURL("GET", doc, prefix, "ignore", true, doc.type === "binary" ? undefined : "include=all"),
                            type: 'GET',
                            context: this,
                            success: function(data) {
                                if(this.type === "json") {
                                    corona.compareJSONDocuments(this, data, withExtras);
                                }
                                else if(this.type === "text") {
                                    corona.compareTextDocuments(this, data, withExtras);
                                }
                                else {
                                    corona.compareXMLDocuments(this, data, true);
                                }

                                if(withExtras === false) {
                                    corona.setExtras(prefix, this, requestId);
                                }
                                else {
                                    corona.deleteDocument(prefix, this, requestId);
                                }
                            },
                            error: function(j, t, error) {
                                ok(false, "Could not fetch inserted document");
								corona.popQueue(requestId);
                            },
                            complete: function() {
                                start();
                            }
                        });
                    },
                    error: function(j, t, error) {
                        ok(false, "Could not insert document");
						corona.popQueue(requestId);
                    }
                });
            });
        }.call(this, i);
    }
};

corona.insertAndMoveDocuments = function(prefix) {
    var i = 0;
    for(i = 0; i < corona.documents.length; i += 1) {
        if((corona.documents[i].type === "json" && corona.stash.status.features.JSONDocs === false) || corona.documents[i].shouldSucceed === false) {
            continue;
        }

        var wrapper = function(index) {
			var requestId = Math.random() + "";
			corona.pushQueue(requestId);

            var doc = corona.documents[index];

            asyncTest("Inserting document: " + prefix + doc.uri, function() {
                var docContent = doc.content;
                if(doc.type === "json") {
                    docContent = JSON.stringify(docContent);
                }
                processExtras = "set";
                $.ajax({
                    url: corona.constructURL("PUT", doc, prefix, processExtras, false),
                    type: 'PUT',
                    data: docContent,
                    context: doc,
                    success: function() {
                        ok(true, "Inserted document");
                        $.ajax({
                            url: "/store",
                            data: {
                                "uri": prefix + doc.uri,
                                "moveTo": "/moved" + doc.uri
                            },
                            type: 'POST',
                            context: this,
                            success: function(data) {
                                $.ajax({
                                    url: corona.constructURL("GET", doc, "/moved", "ignore", true, doc.type === "binary" ? undefined : "include=all"),
                                    type: 'GET',
                                    context: this,
                                    success: function(data) {
                                        if(this.type === "json") {
                                            corona.compareJSONDocuments(this, data, true);
                                        }
                                        else if(this.type === "text") {
                                            corona.compareTextDocuments(this, data, true);
                                        }
                                        else {
                                            corona.compareXMLDocuments(this, data, true);
                                        }

                                        corona.deleteDocument("/moved", this, requestId);
                                    },
                                    error: function(j, t, error) {
                                        ok(false, "Could not fetch moved document");
										corona.popQueue(requestId);
                                    },
                                    complete: function() {
                                        start();
                                    }
                                });
                            },
                            error: function(j, t, error) {
                                corona.deleteDocument("/moved", this);
                                corona.deleteDocument(prefix, this);
								corona.popQueue(requestId);
                                ok(false, "Could not move document");
                            },
                            complete: function() {
                                start();
                            }
                        });
                    },
                    error: function(j, t, error) {
                        ok(false, "Could not insert document");
						corona.popQueue(requestId);
                    }
                });
            });
        }.call(this, i);
    }
};

corona.runFailingTests = function(prefix) {
    var i = 0;
    for(i = 0; i < corona.documents.length; i += 1) {
        if((corona.documents[i].type === "json" && corona.stash.status.features.JSONDocs === false) || corona.documents[i].shouldSucceed === undefined || corona.documents[i].shouldSucceed === true) {
            continue;
        }

        var wrapper = function(index) {
			var requestId = Math.random() + "";
			corona.pushQueue(requestId);

            var doc = corona.documents[index];
            var uri = "";
            if(doc.uri.length > 0) {
                uri = prefix;
            }

            asyncTest("Inserting document: " + uri, function() {
                var docContent = doc.content;
                if(doc.type === "json") {
                    docContent = JSON.stringify(docContent);
                }
                $.ajax({
                    url: corona.constructURL("PUT", doc, uri, true, false),
                    type: 'PUT',
                    data: docContent,
                    context: doc,
                    success: function() {
                        ok(false, "Test succeeded when it should have failed");
						corona.popQueue(requestId);
                    },
                    error: function(j, t, error) {
                        ok(true, "Test failed, as expected");
						corona.popQueue(requestId);
                    },
                    complete: function() {
                        start();
                    }
                });
            });
        }.call(this, i);
    }
};

corona.setExtras = function(prefix, doc, requestId) {
    asyncTest("Setting document extras: " + prefix + doc.uri, function() {
        $.ajax({
            url: corona.constructURL("POST", doc, prefix, "set", false),
            type: 'POST',
            context: doc,
            success: function() {
                ok(true, "Updated document extras");
                $.ajax({
                    url:  corona.constructURL("GET", doc, prefix, "ignore", true, doc.type === "binary" ? undefined : "include=all"),
                    type: 'GET',
                    context: this,
                    success: function(data) {
                        if(this.type === "json") {
                            corona.compareJSONDocuments(this, data, true);
                        }
                        else if(this.type === "text") {
                            corona.compareTextDocuments(this, data, true);
                        }
                        else {
                            corona.compareXMLDocuments(this, data, true);
                        }
                        corona.removeExtras(prefix, doc, requestId);
                    },
                    error: function(j, t, error) {
                        ok(false, "Could not fetch document");
						corona.popQueue(requestId);
                    },
                    complete: function() {
                        start();
                    }
                });
            },
            error: function(j, t, error) {
                ok(false, "Could not update document extras");
				corona.popQueue(requestId);
            }
        });
    });
};

corona.removeExtras = function(prefix, doc, requestId) {
    asyncTest("Removing document extras: " + prefix + doc.uri, function() {
        $.ajax({
            url: corona.constructURL("POST", doc, prefix, "remove", false),
            type: 'POST',
            context: doc,
            success: function() {
                ok(true, "Updated document extras");
                $.ajax({
                    url:  corona.constructURL("GET", doc, prefix, "ignore", true, doc.type === "binary" ? undefined : "include=all"),
                    type: 'GET',
                    context: this,
                    success: function(data) {
                        if(this.type === "json") {
                            corona.compareJSONDocuments(this, data, false);
                        }
                        else if(this.type === "text") {
                            corona.compareTextDocuments(this, data, false);
                        }
                        else {
                            corona.compareXMLDocuments(this, data, false);
                        }
                        corona.addExtras(prefix, doc, requestId);
                    },
                    error: function(j, t, error) {
                        ok(false, "Could not fetch document");
						corona.popQueue(requestId);
                    },
                    complete: function() {
                        start();
                    }
                });
            },
            error: function(j, t, error) {
                ok(false, "Could not update document extras");
				corona.popQueue(requestId);
            }
        });
    });
};

corona.addExtras = function(prefix, doc, requestId) {
    asyncTest("Adding document extras: " + prefix + doc.uri, function() {
        $.ajax({
            url: corona.constructURL("POST", doc, prefix, "add", false),
            type: 'POST',
            context: doc,
            success: function() {
                ok(true, "Updated document extras");
                $.ajax({
                    url:  corona.constructURL("GET", doc, prefix, "ignore", true, doc.type === "binary" ? undefined : "include=all"),
                    type: 'GET',
                    context: this,
                    success: function(data) {
                        if(this.type === "json") {
                            corona.compareJSONDocuments(this, data, true);
                        }
                        else if(this.type === "text") {
                            corona.compareTextDocuments(this, data, true);
                        }
                        else {
                            corona.compareXMLDocuments(this, data, true);
                        }
                        corona.deleteDocument(prefix, doc, requestId);
                    },
                    error: function(j, t, error) {
                        ok(false, "Could not fetch document");
						corona.popQueue(requestId);
                    },
                    complete: function() {
                        start();
                    }
                });
            },
            error: function(j, t, error) {
                ok(false, "Could not update document extras");
				corona.popQueue(requestId);
            }
        });
    });
};

corona.deleteDocument = function(prefix, doc, requestId) {
    asyncTest("Deleting document: " + prefix + doc.uri, function() {
        $.ajax({
            url: corona.constructURL("DELETE", doc, prefix, "ignore", true),
            type: 'DELETE',
            context: doc,
            success: function() {
                ok(true, "Deleted document");
                $.ajax({
                    url:  corona.constructURL("GET", doc, prefix, "ignore", true, doc.type === "binary" ? undefined : "include=all"),
                    type: 'GET',
                    context: this,
                    success: function(data) {
                        ok(false, "Document not truly deleted");
						corona.popQueue(requestId);
                    },
                    error: function(j, t, error) {
                        ok(true, "Document truly deleted");
						corona.popQueue(requestId);
                    },
                    complete: function() {
                        start();
                    }
                });
            },
            error: function(j, t, error) {
                ok(false, "Could not delete document");
				corona.popQueue(requestId);
            }
        });
    });
};

$(document).ready(function() {
	corona.setup(function() {
		module("Store");
		corona.fetchInfo(function(info) {
			corona.stash.status = info;
			corona.insertDocuments("/no-extras", false);
			corona.insertDocuments("/extras", true);
			corona.insertAndMoveDocuments("/moveme");
			corona.runFailingTests("/failures");
		});
	});
});

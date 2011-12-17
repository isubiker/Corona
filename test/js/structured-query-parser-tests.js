if(typeof corona == "undefined" || !corona) {
    corona = {};
    corona.stash = {};
}

corona.queries = [
    /* Contains */
    {
        "query": { 
            "key": "foo",
            "contains": "bar"
        },
        "xmlQuery": '<constraint><key>foo</key><contains>bar</contains></constraint>',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text></cts:element-word-query>',
        "purpose": "Simple JSON contains query"
    },
    {
        "query": {
            "element": "foo",
            "contains": "bar"
        },
        "xmlQuery": '<constraint><element>foo</element><contains>bar</contains></constraint>',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:text xml:lang="en">bar</cts:text></cts:element-word-query>',
        "purpose": "Simple XML element contains query"
    },
    {
        "query": {
            "element": "testns:foo",
            "contains": "bar"
        },
        "xmlQuery": '<constraint><element>testns:foo</element><contains>bar</contains></constraint>',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:foo</cts:element> <cts:text xml:lang="en">bar</cts:text></cts:element-word-query>',
        "purpose": "Simple XML namespaced element contains query"
    },
    {
        "query": {
            "element": "foo",
            "attribute": "bar",
            "contains": "baz"
        },
        "xmlQuery": '<constraint><element>foo</element><attribute>bar</attribute><contains>baz</contains></constraint>',
        "result": '<cts:element-attribute-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:attribute>bar</cts:attribute> <cts:text xml:lang="en">baz</cts:text></cts:element-attribute-word-query>',
        "purpose": "Simple XML namespaced element/attribute contains query"
    },
    {
        "query": {
            "key": "foo",
            "contains": "bar",
            "caseSensitive": true,
            "diacriticSensitive": true,
            "punctuationSensitve": true,
            "whitespaceSensitive": true,
            "stemmed": false,
            "wildcarded": true,
            "weight": 10
        },
        "xmlQuery": '<constraint><key>foo</key><contains>bar</contains><caseSensitive>true</caseSensitive><diacriticSensitive>true</diacriticSensitive><punctuationSensitve>true</punctuationSensitve><whitespaceSensitive>true</whitespaceSensitive><stemmed>false</stemmed><wildcarded>true</wildcarded><weight>10</weight></constraint>',
        "result": '<cts:element-word-query weight="10" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> <cts:option>case-sensitive</cts:option> <cts:option>diacritic-sensitive</cts:option> <cts:option>punctuation-sensitive</cts:option> <cts:option>whitespace-sensitive</cts:option> <cts:option>unstemmed</cts:option> <cts:option>wildcarded</cts:option></cts:element-word-query>',
        "purpose": "Extract word options"
    },
    {
        "query": {
            "key": "foo",
            "contains": ["bar", "baz"]
        },
        "xmlQuery": '<constraint><key>foo</key><contains><value>bar</value><value>baz</value></contains></constraint>',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> <cts:text xml:lang="en">baz</cts:text></cts:element-word-query>',
        "purpose": "Value as an array"
    },

    /* Equals */
    {
        "query": {
            "key": "foo",
            "equals": "bar"
        },
        "xmlQuery": '<constraint><key>foo</key><equals>bar</equals></constraint>',
        "result": '<cts:element-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text></cts:element-value-query>',
        "purpose": "Simple JSON equals query (string)"
    },
    {
        "query": {
            "key": "foo",
            "equals": true
        },
        "xmlQuery": '<constraint><key>foo</key><equals type="boolean">true</equals></constraint>',
        "result": '<cts:element-attribute-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:attribute>boolean</cts:attribute> <cts:text xml:lang="en">true</cts:text></cts:element-attribute-value-query>',
        "purpose": "Simple JSON equals query (boolean)"
    },
    {
        "query": {
            "key": "foo",
            "equals": 10
        },
        "xmlQuery": '<constraint><key>foo</key><equals type="number">10</equals></constraint>',
        "result": '<cts:element-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">10</cts:text></cts:element-value-query>',
        "purpose": "Simple JSON equals query (number)"
    },
    {
        "query": {
            "key": "foo::date",
            "equals": "November 10th, 1980"
        },
        "result": '<cts:element-attribute-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:text xml:lang="en">1980-11-10T00:00:00-07:00</cts:text></cts:element-attribute-value-query>',
        "purpose": "Simple JSON equals query (date)"
    },
    {
        "query": {
            "element": "foo",
            "equals": "bar"
        },
        "xmlQuery": '<constraint><element>foo</element><equals>bar</equals></constraint>',
        "result": '<cts:element-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:text xml:lang="en">bar</cts:text></cts:element-value-query>',
        "purpose": "Simple XML element equals query"
    },
    {
        "query": {
            "element": "testns:foo",
            "equals": "bar"
        },
        "xmlQuery": '<constraint><element>testns:foo</element><equals>bar</equals></constraint>',
        "result": '<cts:element-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:foo</cts:element> <cts:text xml:lang="en">bar</cts:text></cts:element-value-query>',
        "purpose": "Simple XML namespaced element equals query"
    },
    {
        "query": {
            "element": "foo",
            "attribute": "bar",
            "equals": "baz"
        },
        "xmlQuery": '<constraint><element>foo</element><attribute>bar</attribute><equals>baz</equals></constraint>',
        "result": '<cts:element-attribute-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:attribute>bar</cts:attribute> <cts:text xml:lang="en">baz</cts:text></cts:element-attribute-value-query>',
        "purpose": "Simple XML attribute equals query"
    },

    /* WordAnywhere */
    {
        "query": { "wordAnywhere": "foo" },
        "xmlQuery": '<constraint><wordAnywhere>foo</wordAnywhere></constraint>',
        "result": '<cts:word-query xmlns:cts="http://marklogic.com/cts"> <cts:text xml:lang="en">foo</cts:text></cts:word-query>',
        "purpose": "Simple wordAnywhere query"
    },
    {
        "query": { "wordAnywhere": ["foo", "bar"] },
        "xmlQuery": '<constraint><wordAnywhere><value>foo</value><value>bar</value></wordAnywhere></constraint>',
        "result": '<cts:word-query xmlns:cts="http://marklogic.com/cts"> <cts:text xml:lang="en">foo</cts:text> <cts:text xml:lang="en">bar</cts:text></cts:word-query>',
        "purpose": "wordAnywhere query with array"
    },
    {
        "query": {
            "wordAnywhere": "foo",
            "weight": 2
        },
        "xmlQuery": '<constraint><wordAnywhere>foo</wordAnywhere><weight>2</weight></constraint>',
        "result": '<cts:word-query weight="2" xmlns:cts="http://marklogic.com/cts"> <cts:text xml:lang="en">foo</cts:text></cts:word-query>',
        "purpose": "wordAnywhere query with weight"
    },

    /* wordInBinary */
    {
        "query": { "wordInBinary": "foo" },
        "xmlQuery": '<constraint><wordInBinary>foo</wordInBinary></constraint>',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:corona="http://marklogic.com/corona">corona:extractedPara</cts:element> <cts:text xml:lang="en">foo</cts:text></cts:element-word-query>',
        "purpose": "Simple wordInBinary query"
    },
    {
        "query": { "wordInBinary": ["foo", "bar"] },
        "xmlQuery": '<constraint><wordInBinary><value>foo</value><value>bar</value></wordInBinary></constraint>',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:corona="http://marklogic.com/corona">corona:extractedPara</cts:element> <cts:text xml:lang="en">foo</cts:text> <cts:text xml:lang="en">bar</cts:text></cts:element-word-query>',
        "purpose": "wordInBinary query with array"
    },
    {
        "query": {
            "wordInBinary": "foo",
            "weight": 2
        },
        "xmlQuery": '<constraint><wordInBinary>foo</wordInBinary><weight>2</weight></constraint>',
        "result": '<cts:element-word-query weight="2" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:corona="http://marklogic.com/corona">corona:extractedPara</cts:element> <cts:text xml:lang="en">foo</cts:text></cts:element-word-query>',
        "purpose": "wordInBinary query with weight"
    },

    /* inTextDocument */
    {
        "query": { "inTextDocument": "foo" },
        "xmlQuery": '<constraint><inTextDocument>foo</inTextDocument></constraint>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:term-query> <cts:key>2328177500544466626</cts:key> </cts:term-query> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query></cts:and-query>',
        "purpose": "Simple inTextDocument query"
    },
    {
        "query": { "inTextDocument": ["foo", "bar"] },
        "xmlQuery": '<constraint><inTextDocument><value>foo</value><value>bar</value></inTextDocument></constraint>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:term-query> <cts:key>2328177500544466626</cts:key> </cts:term-query> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:and-query>',
        "purpose": "inTextDocument query with array"
    },
    {
        "query": {
            "inTextDocument": "foo",
            "weight": 2
        },
        "xmlQuery": '<constraint><inTextDocument>foo</inTextDocument><weight>2</weight></constraint>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:term-query> <cts:key>2328177500544466626</cts:key> </cts:term-query> <cts:word-query weight="2"> <cts:text xml:lang="en">foo</cts:text> </cts:word-query></cts:and-query>',
        "purpose": "inTextDocument query with weight"
    },

    /* contentType */
    {
        "query": {
            "contentType": "json"
        },
        "xmlQuery": '<constraint><contentType>json</contentType></constraint>',
        "result": '<cts:term-query xmlns:cts="http://marklogic.com/cts"> <cts:key>13332737702526692693</cts:key></cts:term-query>',
        "purpose": "contentType json"
    },
    {
        "query": {
            "contentType": "text"
        },
        "xmlQuery": '<constraint><contentType>text</contentType></constraint>',
        "result": '<cts:term-query xmlns:cts="http://marklogic.com/cts"> <cts:key>2328177500544466626</cts:key></cts:term-query>',
        "purpose": "contentType text"
    },
    {
        "query": {
            "contentType": "binary"
        },
        "xmlQuery": '<constraint><contentType>binary</contentType></constraint>',
        "result": '<cts:term-query xmlns:cts="http://marklogic.com/cts"> <cts:key>7908746777995149422</cts:key></cts:term-query>',
        "purpose": "contentType binary"
    },

    /* And */
    {
        "query": { "and": [
            {
                "key": "foo",
                "equals": "bar"
            },
            {
                "key": "foo",
                "equals": "baz"
            }
        ]},
        "xmlQuery": '<and><constraint><key>foo</key><equals>bar</equals></constraint><constraint><key>foo</key><equals>baz</equals></constraint></and>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> </cts:element-value-query> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">baz</cts:text> </cts:element-value-query></cts:and-query>',
        "purpose": "And query"
    },

    /* Or */
    {
        "query": { "or": [
            {
                "key": "foo",
                "equals": "bar"
            },
            {
                "key": "foo",
                "equals": "baz"
            }
        ]},
        "xmlQuery": '<or><constraint><key>foo</key><equals>bar</equals></constraint><constraint><key>foo</key><equals>baz</equals></constraint></or>',
        "result": '<cts:or-query xmlns:cts="http://marklogic.com/cts"> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> </cts:element-value-query> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">baz</cts:text> </cts:element-value-query></cts:or-query>',
        "purpose": "Or query"
    },

    /* Not */
    {
        "query": { "not": 
            {
                "key": "foo",
                "equals": "bar"
            }
        },
        "xmlQuery": '<not><constraint><key>foo</key><equals>bar</equals></constraint></not>',
        "result": '<cts:not-query xmlns:cts="http://marklogic.com/cts"> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> </cts:element-value-query></cts:not-query>',
        "purpose": "Not query"
    },

    /* And Not */
    {
        "query": { "andNot": {
            "positive": {
                "key": "foo",
                "equals": "bar"
            },
            "negative": {
                "key": "foo",
                "equals": "baz"
            }
        }},
        "xmlQuery": '<andNot><positive><constraint><key>foo</key><equals>bar</equals></constraint></positive><negative><constraint><key>foo</key><equals>baz</equals></constraint></negative></andNot>',
        "result": '<cts:and-not-query xmlns:cts="http://marklogic.com/cts"> <cts:positive> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> </cts:element-value-query> </cts:positive> <cts:negative> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">baz</cts:text> </cts:element-value-query> </cts:negative></cts:and-not-query>',
        "purpose": "And not query"
    },

    /* Near */
    {
        "query": {
            "near": [
                {
                    "key": "foo",
                    "equals": "bar"
                },
                {
                    "key": "foo",
                    "equals": "baz"
                }
            ],
            "ordered": true,
            "distance": 15,
            "weight": 2
        },
        "xmlQuery": '<constraint><near><constraint><key>foo</key><equals>bar</equals></constraint><constraint><key>foo</key><equals>baz</equals></constraint></near><ordered>true</ordered><distance>15</distance><weight>2</weight></constraint>',
        "result": '<cts:near-query weight="2" distance="15" xmlns:cts="http://marklogic.com/cts"> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> </cts:element-value-query> <cts:element-value-query> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:text xml:lang="en">baz</cts:text> </cts:element-value-query> <cts:option>ordered</cts:option></cts:near-query>',
        "purpose": "Near query"
    },

    /* isNULL */
    {
        "query": { "isNULL": "foo" },
        "xmlQuery": '<isNULL>foo</isNULL>',
        "result": '<cts:element-attribute-value-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:attribute>type</cts:attribute> <cts:text xml:lang="en">null</cts:text></cts:element-attribute-value-query>',
        "purpose": "isNULL query"
    },

    /* keyExists */
    {
        "query": { "keyExists": "foo" },
        "xmlQuery": '<keyExists>foo</keyExists>',
        "result": '<cts:element-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:and-query/></cts:element-query>',
        "purpose": "keyExists query"
    },

    /* elementExists */
    {
        "query": { "elementExists": "foo" },
        "xmlQuery": '<elementExists>foo</elementExists>',
        "result": '<cts:element-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:and-query/></cts:element-query>',
        "purpose": "elementExists query"
    },

    /* Collection */
    {
        "query": { "collection": "foo" },
        "xmlQuery": '<collection>foo</collection>',
        "result": '<cts:collection-query xmlns:cts="http://marklogic.com/cts"> <cts:uri>foo</cts:uri></cts:collection-query>',
        "purpose": "Collection query"
    },
    {
        "query": { "collection": ["foo", "bar"] },
        "xmlQuery": '<collection><value>foo</value><value>bar</value></collection>',
        "result": '<cts:collection-query xmlns:cts="http://marklogic.com/cts"> <cts:uri>foo</cts:uri> <cts:uri>bar</cts:uri></cts:collection-query>',
        "purpose": "Collection query with an array of values"
    },

    /* Directory */
    {
        "query": { "directory": "/foo" },
        "xmlQuery": '<constraint><directory>/foo</directory></constraint>',
        "result": '<cts:directory-query xmlns:cts="http://marklogic.com/cts"> <cts:uri>/foo</cts:uri></cts:directory-query>',
        "purpose": "Directory query"
    },
    {
        "query": { "directory": "/foo", "descendants": true},
        "xmlQuery": '<constraint><directory>/foo</directory><descendants>true</descendants></constraint>',
        "result": '<cts:directory-query depth="infinity" xmlns:cts="http://marklogic.com/cts"> <cts:uri>/foo</cts:uri></cts:directory-query>',
        "purpose": "Directory query with a depth"
    },

    /* Properties */
    {
        "query": {
            "property": "foo",
            "equals": "bar"
        },
        "xmlQuery": '<constraint><property>foo</property><equals>bar</equals></constraint>',
        "result": '<cts:properties-query xmlns:cts="http://marklogic.com/cts"> <cts:element-value-query> <cts:element xmlns:corona="http://marklogic.com/corona">corona:foo</cts:element> <cts:text xml:lang="en">bar</cts:text> </cts:element-value-query></cts:properties-query>',
        "purpose": "Property query"
    },

    /* Places */
    {
        "query": {
            "place": "place1",
            "contains": "bar"
        },
        "xmlQuery": '<constraint><place>place1</place><equals>bar</equals></constraint>',
        "result": '<cts:field-word-query xmlns:cts="http://marklogic.com/cts"> <cts:field>corona-field-place1</cts:field> <cts:text xml:lang="en">bar</cts:text></cts:field-word-query>',
        "purpose": "Place query"
    },

    /* UnderKey */
    {
        "query": {
            "underKey": "foo",
            "query": "bar"
        },
        "xmlQuery": '<constraint><underKey>foo</underKey><query>bar</query></constraint>',
        "result": '<cts:element-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:element-query>',
        "purpose": "underKey query"
    },
    {
        "query": {
            "underKey": "foo",
            "query": {
                "wordAnywhere": "bar"
            }
        },
        "xmlQuery": '<constraint><underKey>foo</underKey><query><constraint><wordAnywhere>bar</wordAnywhere></constraint></query></constraint>',
        "result": '<cts:element-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:foo</cts:element> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:element-query>',
        "purpose": "underKey complex query"
    },

    /* UnderElement */
    {
        "query": {
            "underElement": "foo",
            "query": "bar"
        },
        "xmlQuery": '<constraint><underElement>foo</underElement><query>bar</query></constraint>',
        "result": '<cts:element-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:element-query>',
        "purpose": "underElement query"
    },
    {
        "query": {
            "underElement": "foo",
            "query": {
                "wordAnywhere": "bar"
            }
        },
        "xmlQuery": '<constraint><underElement>foo</underElement><query><constraint><wordAnywhere>bar</wordAnywhere></constraint></query></constraint>',
        "result": '<cts:element-query xmlns:cts="http://marklogic.com/cts"> <cts:element>foo</cts:element> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:element-query>',
        "purpose": "underElement complex query"
    },

    /* boolean */
    {
        "query": {
            "boolean": true
        },
        "xmlQuery": '<boolean>true</boolean>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"/>',
        "purpose": "boolean true query"
    },
    {
        "query": {
            "boolean": false
        },
        "xmlQuery": '<boolean>false</boolean>',
        "result": '<cts:or-query xmlns:cts="http://marklogic.com/cts"/>',
        "purpose": "boolean false query"
    },

    {
        "query": {
            "namedQuery": "zip:94402"
        },
        "xmlQuery": '<namedQuery>zip:94402</namedQuery>',
        "result": '<cts:element-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:latLongKey</cts:element> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">37.554167,-122.31306</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-geospatial-query>',
        "purpose": "Named query"
    },

    /* Range */
    {
        "query": {
            "range": "list",
            "value": "foo"
        },
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:list</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/codepoint</cts:option></cts:element-range-query>',
        "purpose": "Range index with collation"
    },
    {
        "query": {
            "range": "range1",
            "value": "November 17th 1980"
        },
        "result": '<cts:element-attribute-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:date1_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">1980-11-17T00:00:00-07:00</cts:value></cts:element-attribute-range-query>',
        "purpose": "JSON date range query"
    },
    {
        "query": {
            "range": "range1",
            "from": "November 17th 1980",
            "to": "November 17th 1981"
        },
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-attribute-range-query operator="&gt;="> <cts:element xmlns:json="http://marklogic.com/json">json:date1_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">1980-11-17T00:00:00-07:00</cts:value> </cts:element-attribute-range-query> <cts:element-attribute-range-query operator="&lt;="> <cts:element xmlns:json="http://marklogic.com/json">json:date1_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">1981-11-17T00:00:00-07:00</cts:value> </cts:element-attribute-range-query></cts:and-query>',
        "purpose": "JSON date range query with from and to"
    },
    {
        "query": {
            "range": "range2",
            "value": "foo"
        },
        "xmlQuery": '<constraint><range>range2</range><value>foo</value></constraint>',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:rangeKey</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-range-query>',
        "purpose": "JSON string range query"
    },
    {
        "query": {
            "range": "range4",
            "value": "foo"
        },
        "xmlQuery": '<constraint><range>range4</range><value>foo</value></constraint>',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element>rangeKey</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-range-query>',
        "purpose": "XML element string range query"
    },
    {
        "query": {
            "range": "range5",
            "value": "foo"
        },
        "xmlQuery": '<constraint><range>range5</range><value>foo</value></constraint>',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:rangeEl</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-range-query>',
        "purpose": "XML namespaced element string range query"
    },
    {
        "query": {
            "range": "range6",
            "value": "foo"
        },
        "xmlQuery": '<constraint><range>range6</range><value>foo</value></constraint>',
        "result": '<cts:element-attribute-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:rangeEl</cts:element> <cts:attribute>rangeAttrib</cts:attribute> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-attribute-range-query>',
        "purpose": "XML namespaced element attribute string range query"
    },
    {
        "query": {
            "range": "range7",
            "value": "2011-11-22T17:30:00"
        },
        "xmlQuery": '<constraint><range>range7</range><value>2011-11-22T17:30:00</value></constraint>',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:rangeEl</cts:element> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">2011-11-22T17:30:00</cts:value></cts:element-range-query>',
        "purpose": "XML namespaced element dateTime range query"
    },
    {
        "query": {
            "range": "range1",
            "value": "November 17th 1980",
            "operator": "ne"
        },
        "result": '<cts:element-attribute-range-query operator="!=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:date1_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">1980-11-17T00:00:00-07:00</cts:value></cts:element-attribute-range-query>',
        "purpose": "Range query operator override"
    },
    {
        "query": {
            "range": "fromBucket",
            "bucketLabel": "G-M",
        },
        "xmlQuery": '<constraint><range>fromBucket</range><bucketLabel>G-M</bucketLabel></constraint>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-range-query operator="&gt;="> <cts:element xmlns:json="http://marklogic.com/json">json:fromPersonal</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">G</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-range-query> <cts:element-range-query operator="&lt;"> <cts:element xmlns:json="http://marklogic.com/json">json:fromPersonal</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">N</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-range-query></cts:and-query>',
        "purpose": "JSON bucketed range label query"
    },
    {
        "query": {
            "range": "fromBucketXML",
            "bucketLabel": "G-M",
        },
        "xmlQuery": '<constraint><range>fromBucketXML</range><bucketLabel>G-M</bucketLabel></constraint>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-attribute-range-query operator="&gt;="> <cts:element>from</cts:element> <cts:attribute>personal</cts:attribute> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">G</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-attribute-range-query> <cts:element-attribute-range-query operator="&lt;"> <cts:element>from</cts:element> <cts:attribute>personal</cts:attribute> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">N</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-attribute-range-query></cts:and-query>',
        "purpose": "XML bucketed range label query"
    },
    {
        "query": {
            "range": "messageDate",
            "bucketLabel": "Sep 01 2010 - Oct 01 2010",
        },
        "xmlQuery": '<constraint><range>messageDate</range><bucketLabel>Sep 01 2010 - Oct 01 2010</bucketLabel></constraint>',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-attribute-range-query operator="&gt;="> <cts:element xmlns:json="http://marklogic.com/json">json:date_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">2010-09-01T00:00:00</cts:value> </cts:element-attribute-range-query> <cts:element-attribute-range-query operator="&lt;"> <cts:element xmlns:json="http://marklogic.com/json">json:date_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">2010-10-01T00:00:00</cts:value> </cts:element-attribute-range-query></cts:and-query>',
        "purpose": "JSON auto bucketed range label query"
    },
    {
        "query": {
            "range": "messageDate",
            "bucketLabel": "Sep 01 2010 - Oct 01 2010",
        },
        "ignoreRange": "messageDate",
        "result": '',
        "purpose": "Ignore range paramater"
    },

    /* Geo */
    {
        "query": { 
            "geo": "geokey",
            "region": {
                "point": {
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geokey</geo><region><point><latitude>10</latitude><longitude>-10</longitude></point></region></constraint>',
        "result": '<cts:element-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:latLongKey</cts:element> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-geospatial-query>',
        "purpose": "Geo query with JSON key"
    },
    {
        "query": {
            "geo": "geoelement",
            "region": {
                "point": {
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geoelement</geo><region><point><latitude>10</latitude><longitude>-10</longitude></point></region></constraint>',
        "result": '<cts:element-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element>latLongElement</cts:element> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-geospatial-query>',
        "purpose": "Geo query with XML element"
    },
    {
        "query": {
            "geo": "geochildkey",
            "region": {
                "point": {
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geochildkey</geo><region><point><latitude>10</latitude><longitude>-10</longitude></point></region></constraint>',
        "result": '<cts:element-child-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:parentKey</cts:element> <cts:child xmlns:json="http://marklogic.com/json">json:latLongKey</cts:child> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-child-geospatial-query>',
        "purpose": "Geo query with parent and child JSON keys"
    },
    {
        "query": {
            "geo": "geochildelement",
            "region": {
                "point": {
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geochildelement</geo><region><point><latitude>10</latitude><longitude>-10</longitude></point></region></constraint>',
        "result": '<cts:element-child-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element>parentElement</cts:element> <cts:child>latLongElement</cts:child> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-child-geospatial-query>',
        "purpose": "Geo query with parent and child XML elements"
    },
    {
        "query": {
            "geo": "geochildpairkey",
            "region": {
                "point": {
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geochildpairkey</geo><region><point><latitude>10</latitude><longitude>-10</longitude></point></region></constraint>',
        "result": '<cts:element-pair-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:parentKey</cts:element> <cts:latitude xmlns:json="http://marklogic.com/json">json:latKey</cts:latitude> <cts:longitude xmlns:json="http://marklogic.com/json">json:longKey</cts:longitude> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-pair-geospatial-query>',
        "purpose": "Geo query with parent, lat and long JSON keys"
    },
    {
        "query": {
            "geo": "geochildpairelement",
            "region": {
                "point": {
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geochildpairelement</geo><region><point><latitude>10</latitude><longitude>-10</longitude></point></region></constraint>',
        "result": '<cts:element-pair-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element>parentElement</cts:element> <cts:latitude>latElement</cts:latitude> <cts:longitude>longElement</cts:longitude> <cts:region xsi:type="cts:point" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-pair-geospatial-query>',
        "purpose": "Geo query with parent, lat and long XML elements"
    },
    {
        "query": {
            "geo": "geokey",
            "region": {
                "circle": {
                    "radius": 15,
                    "latitude": 10,
                    "longitude": -10
                }
            }
        },
        "xmlQuery": '<constraint><geo>geokey</geo><region><circle><radius>15</radius><latitude>10</latitude><longitude>-10</longitude></circle></region></constraint>',
        "result": '<cts:element-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:latLongKey</cts:element> <cts:region xsi:type="cts:circle" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">@15 10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-geospatial-query>',
        "purpose": "Geo circle construction"
    },
    {
        "query": {
            "geo": "geokey",
            "region": {
                "box": {
                    "north": 1,
                    "south": -1,
                    "east": 2,
                    "west": -2 
                }
            }
        },
        "xmlQuery": '<constraint><geo>geokey</geo><region><box><radius>15</radius><north>1</north><south>-1</south><east>2</east><west>-2</west></box></region></constraint>',
        "result": '<cts:element-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:latLongKey</cts:element> <cts:region xsi:type="cts:box" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">[-1, -2, 1, 2]</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-geospatial-query>',
        "purpose": "Geo box construction"
    },
    {
        "query": {
            "geo": "geokey",
            "region": {
                "polygon": [
                    {
                        "latitude": 10,
                        "longitude": -10
                    },
                    {
                        "latitude": 11,
                        "longitude": -9
                    },
                    {
                        "latitude": 12,
                        "longitude": -8
                    }
                ]
            }
        },
        "xmlQuery": '<constraint><geo>geokey</geo><region><polygon><point><latitude>10</latitude><longitude>-10</longitude></point><point><latitude>11</latitude><longitude>-9</longitude></point><point><latitude>12</latitude><longitude>-8</longitude></point></polygon></region></constraint>',
        "result": '<cts:element-geospatial-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:latLongKey</cts:element> <cts:region xsi:type="cts:polygon" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10,-10 11,-9 12,-8 10,-10</cts:region> <cts:option>coordinate-system=wgs84</cts:option></cts:element-geospatial-query>',
        "purpose": "Geo polygon construction"
    },
];

$(document).ready(function() {
    module("Structured Queries");
    corona.fetchInfo(function(info) {
        if(info.features.JSONDocs) {
            corona.runTest("json");
        }
        corona.runTest("xml");
    });
});

corona.runTest = function(mode) {
    $(corona.queries).each(function(index, test) {
        if(test.xmlQuery === undefined && mode === "xml") {
            return;
        }

        asyncTest(test.purpose, function() {
            var data;
            if(mode === "json") {
                data = {"q": JSON.stringify(test.query)};
            }
            else {
                data = {"q": test.xmlQuery};
            }

            if(test.ignoreRange !== undefined) {
                data.ignoreRange = test.ignoreRange;
            }
            $.ajax({
                url: '/test/xq/parse-structured-query.xqy',
                data: data,
                success: function(data, t, j) {
                    if(test.error !== undefined) {
                        equals(data, test.error, test.purpose);
                    }
                    else if(test.result !== undefined) {
                        equals(data, test.result, test.purpose);
                    }
                },
                error: function(j, t, e) {
                    ok(false, e);
                    console.log(e);
                },
                complete: function() { start(); }
            });
        });
    });
};

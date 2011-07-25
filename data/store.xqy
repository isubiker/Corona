(:
Copyright 2011 MarkLogic Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
:)

xquery version "1.0-ml";

import module namespace reststore="http://marklogic.com/reststore" at "lib/reststore.xqy";
import module namespace rest="http://marklogic.com/appservices/rest" at "lib/rest/rest.xqy";
import module namespace endpoints="http://marklogic.com/mljson/endpoints" at "/config/endpoints.xqy";

declare option xdmp:mapping "false";

let $params := rest:process-request(endpoints:request("/data/store.xqy"))
let $uri := map:get($params, "uri")
let $requestMethod := xdmp:get-request-method()
let $bodyContent := xdmp:get-request-body("text")/text()

where exists($uri)
return
    if($requestMethod = "GET")
    then reststore:getDocument($uri)
    else if($requestMethod = "DELETE")
    then reststore:deleteDocument($uri)
    else if($requestMethod = "PUT")
    then reststore:insertDocument($uri, $bodyContent)
    else if($requestMethod = "POST")
    then
        if(empty(doc($uri)) and exists($bodyContent))
        then reststore:insertDocument($uri, $bodyContent)
        else (
            if(exists($bodyContent))
            then reststore:updateDocumentContent($uri, $bodyContent)
            else (),
            reststore:setProperties($uri, reststore:propertiesFromRequest()),
            reststore:setPermissions($uri, reststore:permissionsFromRequest()),
            reststore:setCollections($uri, reststore:collectionsFromRequest()),
            reststore:setQuality($uri, reststore:qualityFromRequest())
        )
    else ()

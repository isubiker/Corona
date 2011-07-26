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

import module namespace manage="http://marklogic.com/mljson/manage" at "../lib/manage.xqy";
import module namespace common="http://marklogic.com/mljson/common" at "../lib/common.xqy";
import module namespace json="http://marklogic.com/json" at "../lib/json.xqy";

import module namespace prop="http://xqdev.com/prop" at "../lib/properties.xqy";
import module namespace rest="http://marklogic.com/appservices/rest" at "../lib/rest/rest.xqy";
import module namespace endpoints="http://marklogic.com/mljson/endpoints" at "/config/endpoints.xqy";
import module namespace admin = "http://marklogic.com/xdmp/admin" at "/MarkLogic/admin.xqy";

declare option xdmp:mapping "false";


(: let $params := rest:process-request(endpoints:request("/data/manage/range.xqy")) :)
let $name := xdmp:get-request-field("name")[1]
let $requestMethod := xdmp:get-request-method()

let $config := admin:get-configuration()
let $existing := manage:getRange($name)

return
    if($requestMethod = "GET")
    then
        if(exists($existing))
        then json:xmlToJSON($existing)
        else common:error(404, "Range index not found", "json")

    else if($requestMethod = "POST")
    then
        if(exists(manage:validateIndexName($name)))
        then common:error(500, manage:validateIndexName($name), "json")
        else if(exists($existing))
        then common:error(500, "Range index with this configuration already exists", "json")
        else
            let $key := xdmp:get-request-field("key")[1]
            let $type := xdmp:get-request-field("type")[1]
            let $operator := xdmp:get-request-field("operator")[1]
            return manage:createRange($name, $key, $type, $operator, $config)

    else if($requestMethod = "DELETE")
    then
        if(exists($existing))
        then manage:deleteRange($name, $config)
        else common:error(404, "Range index not found", "json")
    else ()


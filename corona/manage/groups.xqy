(:
Copyright 2012 Ryan Grimm

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

import module namespace manage="http://marklogic.com/corona/manage" at "../lib/manage.xqy";
import module namespace common="http://marklogic.com/corona/common" at "../lib/common.xqy";
import module namespace json="http://marklogic.com/json" at "../lib/json.xqy";

import module namespace rest="http://marklogic.com/appservices/rest" at "../lib/rest/rest.xqy";
import module namespace endpoints="http://marklogic.com/corona/endpoints" at "/config/endpoints.xqy";

declare option xdmp:mapping "false";


let $params := rest:process-request(endpoints:request("/corona/manage/groups.xqy"))
let $groupName := map:get($params, "group")
let $parentGroups := map:get($params, "parentGroups")
let $addSubgroup := map:get($params, "addSubgroup")
let $removeSubgroup := map:get($params, "removeSubgroup")
let $requestMethod := xdmp:get-request-method()
let $set := xdmp:set-response-code(if($requestMethod = "GET") then 200 else 204, "Group")

return common:output(
    if($requestMethod = "GET")
    then
        if(string-length($groupName))
        then
            if(manage:groupExists($groupName))
            then manage:getGroup($groupName)
            else common:error("corona:GROUP-NOT-FOUND", "Group not found", "json")
        else json:array(manage:getGroups())

	(: Non-GET requests need to be authenticated as an admin user :)
	else if(common:isCoronaAdmin() = false())
	then common:error("corona:INSUFFICIENT-PERMISSIONS", "You don't have permission to execute this request")

    else if($requestMethod = "POST")
    then
        if(string-length($groupName))
        then
            if(manage:groupExists($groupName))
			then
				if(string-length($addSubgroup))
				then manage:addGroupSubsgroups($groupName, $addSubgroup)
				else if(string-length($removeSubgroup))
				then manage:removeGroupSubgroups($groupName, $removeSubgroup)
				else common:error("corona:INVALID-PARAMETER", "This group already exists. Can specify a subgroup to add to it or remove from it.", "json")
			else
				if(not(matches($groupName, "^[A-Za-z][A-Za-z0-9_-]*$")))
				then common:error("corona:INVALID-PARAMETER", "Invalid group name. Must start with a letter, be alphanumeric and can contain underscores and dashes.", "json")
				else manage:addGroup($groupName, $parentGroups)
        else common:error("corona:INVALID-PARAMETER", "Must specify a group", "json")

    else if($requestMethod = "DELETE")
    then
        if(string-length($groupName))
        then
            if(manage:groupExists($groupName))
            then manage:removeGroup($groupName)
            else common:error("corona:GROUP-NOT-FOUND", "Group not found", "json")
        else common:error("corona:INVALID-PARAMETER", "Must specify a group", "json")
    else common:error("corona:UNSUPPORTED-METHOD", concat("Unsupported method: ", $requestMethod), "json")
)


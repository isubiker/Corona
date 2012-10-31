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

import module namespace common="http://marklogic.com/corona/common" at "lib/common.xqy";
import module namespace user="http://marklogic.com/corona/user" at "lib/user.xqy";
import module namespace const="http://marklogic.com/corona/constants" at "lib/constants.xqy";
import module namespace json="http://marklogic.com/json" at "lib/json.xqy";

import module namespace rest="http://marklogic.com/appservices/rest" at "lib/rest/rest.xqy";
import module namespace endpoints="http://marklogic.com/corona/endpoints" at "/config/endpoints.xqy";

declare namespace corona="http://marklogic.com/corona";

declare option xdmp:mapping "false";


let $params := rest:process-request(endpoints:request("/corona/user.xqy"))

let $requestMethod := xdmp:get-request-method()
let $userId := map:get($params, "userId")
let $username := map:get($params, "username")
let $email := map:get($params, "email")
let $resetPasswordVia := map:get($params, "resetPasswordVia")
let $validateEmailCode := map:get($params, "validateEmailCode")
let $password := map:get($params, "password")
let $sessionToken := map:get($params, "sessionToken")
let $checkSessionToken := map:get($params, "checkSessionToken")
let $userDocument := map:get($params, "userDocument")
let $group := map:get($params, "group")
let $addToGroup := map:get($params, "addToGroup")
let $removeFromGroup := map:get($params, "removeFromGroup")

let $outputFormat := common:getOutputFormat((), map:get($params, "outputFormat"))

let $userId := if(string-length($userId) = 0) then () else $userId

return common:output(
    if($requestMethod = "GET")
    then try {
		if(exists($userId) and empty($checkSessionToken))
		then user:outputUser(user:getById($userId), $outputFormat)
		else if(exists($userId) and exists($checkSessionToken))
		then
			if($outputFormat = "xml")
			then <corona:response>
				<corona:userId>{ $userId }</corona:userId>
				<corona:sessionToken>{ $sessionToken }</corona:sessionToken>
				<corona:validSessionToken>{ user:checkSessionToken($userId, $checkSessionToken) }</corona:validSessionToken>
			</corona:response>
			else json:object((
				"userId", $userId,
				"sessionToken", $sessionToken,
				"validSessionToken", user:checkSessionToken($userId, $checkSessionToken)
			))
		else if(exists($username))
		then user:outputUser(user:getByUsername($username), $outputFormat)
		else if(exists($email) and empty($validateEmailCode))
		then user:outputUser(user:getByEmail($email), $outputFormat)
		else if(exists($resetPasswordVia))
		then user:resetPassword($userId, $resetPasswordVia)
		else if(exists($email) and exists($validateEmailCode))
		then user:validateEmail($email, $validateEmailCode)
		else error(xs:QName("corona:INVALID-PARAMETER"), "Users may be fetched by their userId, username or email")
    }
    catch ($e) {
        common:errorFromException($e, $outputFormat)
    }

    else if($requestMethod = "POST")
    then try {(
		if(empty($userId) and exists($username) and exists($email) and exists($password))
		then (
			xdmp:set-response-code(204, "User created"),
			user:outputUser(user:createUser($username, $email, $password, ($group, $addToGroup), $userDocument, $sessionToken), $outputFormat)
		)
		else if(empty($userId))
		then error(xs:QName("corona:MISSING-PARAMETER"), "Must supply a username, email and password when creating a user")

		else if(exists($userId) and exists(($group, $addToGroup, $removeFromGroup)))
		then
			if(exists($group))
			then user:setGroups($userId, $sessionToken, $group)
			else if(exists($addToGroup))
			then user:addGroups($userId, $sessionToken, $addToGroup)
			else if(exists($removeFromGroup))
			then user:removeGroups($userId, $sessionToken, $removeFromGroup)
			else ()

		else if(exists($userId))
		then user:updateUser($userId, $sessionToken, $username, $email, $password, $userDocument)
		else ()
    )}
    catch ($e) {
        common:errorFromException($e, $outputFormat)
    }

    else if($requestMethod = "DELETE")
    then try {
		if(exists($password))
		then
			if(exists($userId))
			then user:deleteById($userId, $password)
			else if(exists($username))
			then user:deleteByUsername($username, $password)
			else if(exists($email))
			then user:deleteByEmail($email, $password)
			else error(xs:QName("corona:MISSING-PARAMETER"), "Users may be deleted by their userId, username or email")
		else if(exists($sessionToken))
		then
			if(exists($userId))
			then user:deleteByIdAsAdmin($userId, $sessionToken)
			else if(exists($username))
			then user:deleteByUsernameAsAdmin($username, $sessionToken)
			else if(exists($email))
			then user:deleteByEmailAsAdmin($email, $sessionToken)
			else error(xs:QName("corona:MISSING-PARAMETER"), "Users may be deleted by their userId, username or email")
		else error(xs:QName("corona:MISSING-PARAMETER"), "Deleting a user requires either the user password or an app admin session token")
    }
    catch ($e) {
        common:errorFromException($e, $outputFormat)
    }

    else common:error("corona:UNSUPPORTED-METHOD", concat("Unsupported method: ", $requestMethod), $outputFormat)
)

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

module namespace user="http://marklogic.com/corona/user";

import module namespace json="http://marklogic.com/json" at "json.xqy";
import module namespace common="http://marklogic.com/corona/common" at "common.xqy";
import module namespace const="http://marklogic.com/corona/constants" at "constants.xqy";
import module namespace store="http://marklogic.com/corona/store" at "store.xqy";
import module namespace manage="http://marklogic.com/corona/manage" at "manage.xqy";

declare namespace corona="http://marklogic.com/corona";
declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare variable $user:xsltEval := try { xdmp:function(xs:QName("xdmp:xslt-eval")) } catch ($e) {};
declare variable $user:xsltIsSupported := try { xdmp:apply($xsltEval, <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"/>, <foo/>)[3], true() } catch ($e) { false() };

declare function user:outputUser(
	$user as element(corona:user),
	$outputFormat as xs:string
) as element()
{
	if($outputFormat = "xml")
	then <corona:user>
		{ $user/@* except $user/@securityUsername }
		{ $user/corona:session }
		<corona:userContent>{
			if($user/corona:userContent/@type = "xml")
			then ($user/corona:userContent/*)[1]
			else if($user/corona:userContent/@type = "json")
			then json:serialize(($user/corona:userContent/*)[1])
			else ()
		}</corona:userContent>
	</corona:user>
	else json:object((
		"id", $user/@id,
		"username", $user/@username,
		"createdAt::date", xs:dateTime($user/@createdAt),
		"session", json:object((
			"token", $user/corona:session/@token,
			"issuedOn::date", xs:dateTime($user/corona:session/@issuedOn)
		)),
		"primaryEmail", json:object((
			"address", $user/corona:primaryEmail/@address,
			"verified", xs:boolean($user/corona:primaryEmail/@verified),
			"verificationCode", $user/corona:primaryEmail/@verificationCode,
			"verificationEmailSentOn::date", xs:dateTime($user/corona:primaryEmail/@verificationEmailSentOn)
		)),
		if($user/corona:userContent/@type = "xml")
		then ("userContent::xml", ($user/corona:userContent/*)[1])
		else if($user/corona:userContent/@type = "json")
		then ("userContent", ($user/corona:userContent/*)[1])
		else ()
	))
};

declare function user:getById(
	$userId as xs:string
) as element(corona:user)
{
	let $userDoc := /corona:user[@id = $userId]
	return
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the id '", $userId, "' does not exist"))
		else $userDoc
};

declare function user:getByUsername(
	$username as xs:string
) as element(corona:user)
{
	let $userDoc := /corona:user[@username = $username]
	return
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the username '", $username, "' does not exist"))
		else $userDoc
};

declare function user:getByEmail(
	$email as xs:string
) as element(corona:user)
{
	let $userDoc := /corona:user[corona:primaryEmail/@address = $email]
	return
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the email '", $email, "' does not exist"))
		else $userDoc
};

declare function user:getBySessionToken(
	$sessionToken as xs:string
) as element(corona:user)
{
	let $userDoc := (/corona:user[corona:session/@token = $sessionToken])[1]
	return
		if(empty($userDoc))
		then error(xs:QName("corona:SESSION-DOES-NOT-EXIST"), concat("A session with the token '", $sessionToken, "' does not exist"))
		else $userDoc
};

declare function user:resetPassword(
	$userId as xs:string,
	$method as xs:string
) as empty-sequence()
{
	let $userDoc := user:getById($userId)
	let $transformerName := manage:getEnvVar("resetPasswordMessageTransformer")
    let $transformer := manage:getTransformer($transformerName)
	let $test :=
		if(empty($transformerName) or empty($transformer))
		then error(xs:QName("corona:NOT-CONFIGURED"), "Password reset isn't configured (missing transformer)")
		else ()
	return user:sendMessage($userDoc, $method, $transformer)
};

declare function user:createUser(
	$username as xs:string,
	$email as xs:string,
	$password as xs:string,
	$groups as xs:string*,
	$userContent as xs:string?,
	$sessionToken as xs:string?
) as element(corona:user)
{
	let $test :=
		if(exists(/corona:user[@username = $username]))
		then error(xs:QName("corona:USER-EXISTS"), concat("A user with the username '", $username, "' exists"))
		else ()
	let $test :=
		if(exists($groups) and user:isAdminToken($sessionToken) = false())
		then error(xs:QName("corona:INSUFFICIENT-PERMISSIONS"), "Must be an administrator to create a user in specific groups")
		else ()

	let $groups := <groups>{ for $group in $groups return <group>{ $group }</group> }</groups>

	let $securityUsername := string(xdmp:random())
	(: Create the user first :)
	let $userId :=
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;
			declare variable $password as xs:string external;
			declare variable $groups as element(groups) external;

			let $groups := ("corona::public", for $group in $groups where string-length($group) return concat("corona::", string($group)))
			let $userId := sec:create-user($username, (), $password, $groups, (), ())
			let $userGroupName := concat("coronauser::", $userId)
			let $create := sec:create-role($userGroupName, (), "corona::public", (), ())
			return $userId
		', (xs:QName("username"), $securityUsername, xs:QName("password"), $password, xs:QName("groups"), $groups),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>)

	let $addUserToUserGroup :=
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;
			declare variable $userId as xs:unsignedLong external;

			let $userGroupName := concat("coronauser::", $userId)
			let $set := sec:user-set-default-permissions($username, (
				xdmp:permission($userGroupName, "read"),
				xdmp:permission($userGroupName, "update")
			))
			return sec:user-add-roles($username, $userGroupName)
		', (xs:QName("username"), $securityUsername, xs:QName("userId"), $userId),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database><user-id>{ $userId }</user-id></options>)


	let $userContentType := common:xmlOrJSON($userContent)
	let $userContentType := if(empty($userContentType)) then "null" else $userContentType

	let $userDoc := <corona:user securityUsername="{ $securityUsername }" id="{ $userId }" username="{ $username }" createdAt="{ current-dateTime() }">
		{ user:constructSessionToken() }
		{ user:constructEmailElement("primary", $email) }
		<corona:userContent type="{ $userContentType }">{
			if($userContentType = "xml")
			then store:unquoteXML($userContent, false())
			else if($userContentType = "json")
			then json:parse($userContent)
			else ()
		}</corona:userContent>
	</corona:user>
	let $uri := concat("_/user/", $userId, ".xml")
	let $insert := xdmp:document-insert($uri, $userDoc, xdmp:default-permissions(), $const:UsersCollection)

	let $transformerName := manage:getEnvVar("welcomeUserMessageTransformer")
    let $transformer := manage:getTransformer($transformerName)
	let $run :=
		if(exists($transformerName) and exists($transformer))
		then user:sendMessage(user:outputUser($userDoc, "xml"), "email", $transformer)
		else ()
	return $userDoc
};

declare function user:validateEmail(
	$email as xs:string,
	$code as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[corona:primaryEmail/@address = $email][corona:primaryEmail/@verificationCode = $code]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:INVALID-VERIFICATION-CODE"), concat("The email address '", $email, "' can not be verified with the code '", $code, "'"))
		else ()
	return (
		xdmp:node-replace($userDoc/corona:primaryEmail/@verified, attribute {"verified"} {"true"}),
		xdmp:node-replace($userDoc/corona:primaryEmail/@verificationEmailSentOn, attribute {"verifiedOn"} {current-dateTime()}),
		xdmp:node-delete($userDoc/corona:primaryEmail/@verificationCode)
	)
};

declare function user:updateUser(
	$userId as xs:string,
	$sessionToken as xs:string,
	$username as xs:string?,
	$email as xs:string?,
	$password as xs:string?,
	$userContent as xs:string?
) as empty-sequence()
{
	let $userDoc := /corona:user[@id = $userId]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the id '", $userId, "' does not exist"))
		else ()
	let $test :=
		if($userDoc/corona:session/@token != $sessionToken)
		then error(xs:QName("corona:INCORRECT-SESSION"), "The provided session token does not belong to the user")
		else ()
	let $update :=
		if(exists($username) and $userDoc/@username != $username)
		then xdmp:node-replace($userDoc/@username, attribute {"username"} {$username})
		else ()
	let $update :=
		if(exists($password))
		then xdmp:eval('
				import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
				declare variable $username as xs:string external;
				declare variable $password as xs:string external;

				sec:user-set-password($username, $password)
			', (xs:QName("username"), $userDoc/@securityUsername, xs:QName("password"), $password),
			<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>)
		else ()
	let $update :=
		if(exists($email) and $userDoc/corona:primaryEmail/@address != $email)
		then xdmp:node-replace($userDoc/corona:primaryEmail, user:constructEmailElement("primary", $email))
		else ()
	let $userContentType := common:xmlOrJSON($userContent)
	let $userContentType := if(empty($userContentType)) then "null" else $userContentType
	let $update :=
		if(exists($userContent))
		then xdmp:node-replace($userDoc/corona:userContent, 
			<corona:userContent type="{ $userContentType }">{
				if($userContentType = "xml")
				then store:unquoteXML($userContent, false())
				else if($userContentType = "json")
				then json:parse($userContent)
				else ()
			}</corona:userContent>
		)
		else ()
	return ()
};

declare function user:setGroups(
	$userId as xs:string,
	$sessionToken as xs:string,
	$groups as xs:string*
) as empty-sequence()
{
	let $userDoc := user:getById($userId)
	let $test :=
		if(exists($groups) and user:isAdminToken($sessionToken) = false())
		then error(xs:QName("corona:INSUFFICIENT-PERMISSIONS"), "Must be an administrator to modify the groups a user is in")
		else ()

	let $roles := <roles>{ for $group in $groups where string-length($group) return <role>{ concat("corona::", $group) }</role> }</roles>
	let $set :=
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;
			declare variable $roles as element(roles) external;

			let $roles := ("corona::pubic", for $role in $roles return string($role))
			return sec:user-set-roles($username, $roles)
		', (xs:QName("username"), string($userDoc/@securityUsername), xs:QName("roles"), $roles),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>)
	return ()
};

declare function user:addGroups(
	$userId as xs:string,
	$sessionToken as xs:string,
	$groups as xs:string*
) as empty-sequence()
{
	let $userDoc := user:getById($userId)
	let $test :=
		if(exists($groups) and user:isAdminToken($sessionToken) = false())
		then error(xs:QName("corona:INSUFFICIENT-PERMISSIONS"), "Must be an administrator to modify the groups a user is in")
		else ()

	let $roles := <roles>{ for $group in $groups where string-length($group) return <role>{ concat("corona::", $group) }</role> }</roles>
	let $set :=
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;
			declare variable $roles as element(roles) external;

			let $roles := for $role in $roles where $role != "corona::public" return string($role)
			return sec:user-add-roles($username, $roles)
		', (xs:QName("username"), string($userDoc/@securityUsername), xs:QName("roles"), $roles),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>)
	return ()
};

declare function user:removeGroups(
	$userId as xs:string,
	$sessionToken as xs:string,
	$groups as xs:string*
) as empty-sequence()
{
	let $userDoc := user:getById($userId)
	let $test :=
		if(exists($groups) and user:isAdminToken($sessionToken) = false())
		then error(xs:QName("corona:INSUFFICIENT-PERMISSIONS"), "Must be an administrator to modify the groups a user is in")
		else ()

	let $roles := <roles>{ for $group in $groups where string-length($group) return <role>{ concat("corona::", $group) }</role> }</roles>
	let $set :=
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;
			declare variable $roles as element(roles) external;

			let $roles := for $role in $roles where $role != "corona::public" return string($role)
			return sec:user-remove-roles($username, $roles)
		', (xs:QName("username"), string($userDoc/@securityUsername), xs:QName("roles"), $roles),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>)
	return ()
};

(: Make sure calling user is either an app admin or the owner of the account :)
declare function user:deleteById(
	$userId as xs:string,
	$password as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[@id = $userId]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the id '", $userId, "' does not exist"))
		else ()
	let $success := xdmp:login($userDoc/@securityUsername, $password)
	let $test :=
		if($success = false())
		then error(xs:QName("corona:LOGIN-FAILED"), "Incorrect password")
		else ()
	return user:deleteByUserDoc($userDoc)
};

declare function user:deleteByUsername(
	$username as xs:string,
	$password as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[@username = $username]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the username '", $username, "' does not exist"))
		else ()
	let $success := xdmp:login($userDoc/@securityUsername, $password)
	let $test :=
		if($success = false())
		then error(xs:QName("corona:LOGIN-FAILED"), "Incorrect password")
		else ()
	return user:deleteByUserDoc($userDoc)
};

declare function user:deleteByEmail(
	$email as xs:string,
	$password as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[corona:primaryEmail/@address = $email]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the email '", $email, "' does not exist"))
		else ()
	let $success := xdmp:login($userDoc/@securityUsername, $password)
	let $test :=
		if($success = false())
		then error(xs:QName("corona:LOGIN-FAILED"), "Incorrect password")
		else ()
	return user:deleteByUserDoc($userDoc)
};

declare function user:deleteByIdAsAdmin(
	$userId as xs:string,
	$sessionToken as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[@id = $userId]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the id '", $userId, "' does not exist"))
		else ()
	let $adminUserDoc := user:getBySessionToken($sessionToken)
	let $test :=
		if(user:isAdmin($userDoc))
		then error(xs:QName("corona:USER-IS-NOT-ADMIN"), concat("The user with session token '", $sessionToken, "' is not an app admin"))
		else ()
	return user:deleteByUserDoc($userDoc)
};

declare function user:deleteByUsernameAsAdmin(
	$username as xs:string,
	$sessionToken as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[@username = $username]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the username '", $username, "' does not exist"))
		else ()
	let $adminUserDoc := user:getBySessionToken($sessionToken)
	let $test :=
		if(user:isAdmin($userDoc))
		then error(xs:QName("corona:USER-IS-NOT-ADMIN"), concat("The user with session token '", $sessionToken, "' is not an app admin"))
		else ()
	return user:deleteByUserDoc($userDoc)
};

declare function user:deleteByEmailAsAdmin(
	$email as xs:string,
	$sessionToken as xs:string
) as empty-sequence()
{
	let $userDoc := /corona:user[corona:primaryEmail/@address = $email]
	let $test :=
		if(empty($userDoc))
		then error(xs:QName("corona:USER-DOES-NOT-EXIST"), concat("A user with the email '", $email, "' does not exist"))
		else ()
	let $adminUserDoc := user:getBySessionToken($sessionToken)
	let $test :=
		if(user:isAdmin($userDoc))
		then error(xs:QName("corona:USER-IS-NOT-ADMIN"), concat("The user with session token '", $sessionToken, "' is not an app admin"))
		else ()
	return user:deleteByUserDoc($userDoc)
};


declare function user:isAdmin(
	$userDoc as element(corona:user)?
) as xs:boolean
{
	xdmp:user-roles($userDoc/@securityUsername) = xdmp:role($const:AppAdminRole) or common:isCoronaAdmin()
};

declare function user:isAdminToken(
	$sessionToken as xs:string?
) as xs:boolean
{
	if(exists($sessionToken))
	then xdmp:user-roles(user:getBySessionToken($sessionToken)/@securityUsername) = xdmp:role($const:AppAdminRole) or common:isCoronaAdmin()
	else common:isCoronaAdmin()
};

declare function user:loginByUsername(
	$username as xs:string,
	$password as xs:string
) as xs:string
{
	let $userDoc := user:getByUsername($username)
	let $success := xdmp:login($userDoc/@securityUsername, $password)
	let $test :=
		if($success = false())
		then error(xs:QName("corona:LOGIN-FAILED"), "Incorrect username or password")
		else ()
	let $session := ($userDoc/corona:session, user:constructSessionToken())[1]
	let $update :=
		if(empty($userDoc/corona:session))
		then xdmp:node-insert-child((/corona:user[@username = $username])[1], $session)
		else ()
	return string($session/@token)
};

declare function user:loginByEmail(
	$email as xs:string,
	$password as xs:string
) as xs:string
{
	user:loginByUsername(user:getByEmail($email)/@username, $password)
};

declare function user:loginBySessionToken(
	$sessionToken as xs:string?
) as xs:boolean
{
	if(empty($sessionToken))
	then false()
	else xdmp:login(user:getBySessionToken($sessionToken)/@securityUsername)
};

declare function user:checkSessionToken(
	$userId as xs:string,
	$sessionToken as xs:string
) as xs:boolean
{
	exists(/corona:user[@id = $userId][corona:session/@token = $sessionToken])
};

declare function user:logout(
	$sessionToken as xs:string
) as empty-sequence()
{
	xdmp:node-delete(user:getBySessionToken($sessionToken)/corona:session)
};


declare private function user:constructSessionToken(
) as element(corona:session)
{
	<corona:session token="{ xdmp:base64-encode(concat(xdmp:random(), xdmp:random())) }" issuedOn="{ current-dateTime() }"/>
};

declare private function user:constructEmailElement(
	$type as xs:string,
	$email as xs:string
) as element()
{
	if($type = "primary")
	then <corona:primaryEmail address="{ $email }" verified="false" verificationCode="{ xdmp:md5(string(xdmp:random())) }" verificationEmailSentOn="{ current-dateTime() }"/>
	else ()
};

declare private function user:deleteByUserDoc(
	$userDoc as element(corona:user)
) as empty-sequence()
{
	(
		xdmp:document-delete(base-uri($userDoc)),
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;

			sec:remove-role(concat("coronauser::", xdmp:user($username)))

		', (xs:QName("username"), string($userDoc/@securityUsername)),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>),
		xdmp:eval('
			import module namespace sec="http://marklogic.com/xdmp/security" at "/MarkLogic/security.xqy";
			declare variable $username as xs:string external;

			sec:remove-user($username)

		', (xs:QName("username"), string($userDoc/@securityUsername)),
		<options xmlns="xdmp:eval"><database>{ xdmp:database("Security") }</database></options>)
	)
};

declare private function user:sendMessage(
	$userDoc as element(corona:user),
	$method as xs:string,
	$transformer as item()
) as empty-sequence()
{
	let $test :=
		if($method != "email")
		then error(xs:QName("corona:UNSUPPORTED-MESSAGE-METHOD"), concat("Unsupported message method '", $method, "'. Only 'email' is suported at this time."))
		else ()

	let $message :=
        if(exists($transformer/*) and $user:xsltIsSupported)
        then xdmp:apply($user:xsltEval, $transformer/*, $userDoc, ())
        else if(exists($transformer/text()))
        then xdmp:eval(string($transformer), (xs:QName("content"), $userDoc, xs:QName("requestParameters"), (), xs:QName("testMode"), false()), <options xmlns="xdmp:eval"><isolation>same-statement</isolation></options>)
        else error(xs:QName("corona:INVALID-TRANSFORMER"), "XSLT transformations are not supported in this version of MarkLogic, upgrade to 5.0 or later")
	return xdmp:email($message)
};

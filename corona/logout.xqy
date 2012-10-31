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
import module namespace json="http://marklogic.com/json" at "lib/json.xqy";

import module namespace rest="http://marklogic.com/appservices/rest" at "lib/rest/rest.xqy";
import module namespace endpoints="http://marklogic.com/corona/endpoints" at "/config/endpoints.xqy";

declare namespace corona="http://marklogic.com/corona";

declare option xdmp:mapping "false";


let $params := rest:process-request(endpoints:request("/corona/logout.xqy"))

let $requestMethod := xdmp:get-request-method()
let $sessionToken := map:get($params, "sessionToken")

let $outputFormat := common:getOutputFormat((), map:get($params, "outputFormat"))

return common:output(
    if($requestMethod = "POST")
    then try {
		let $test :=
			if(empty($sessionToken))
			then error("corona:INVALID-PARAMETER", "Must supply a session token")
			else ()
		return user:logout($sessionToken)
    }
    catch ($e) {
        common:errorFromException($e, $outputFormat)
    }

    else common:error("corona:UNSUPPORTED-METHOD", concat("Unsupported method: ", $requestMethod), $outputFormat)
)

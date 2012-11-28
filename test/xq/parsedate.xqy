import module namespace dateparser="http://marklogic.com/dateparser" at "/corona/lib/date-parser.xqy";

let $parsed := dateparser:parse(xdmp:get-request-field("date"))
let $casted := xs:dateTime(xdmp:get-request-field("value"))
return
	if($parsed = $casted)
	then "true"
	else concat("false - parsed the string '", xdmp:get-request-field("date"), "' as '", $parsed , "' when it should have been '", $casted, "'")

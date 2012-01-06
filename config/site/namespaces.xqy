(:
Copyright 2012 MarkLogic Corporation

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

import module namespace template="http://marklogic.com/corona/template" at "/corona/htools/template.xqy";

template:apply(
    <div>
        <h2>XML Namespaces</h2>
        <div id="jscontent"><!-- --></div>
    </div>,
    "XML Namespaces - Corona",
    (
        <li><h4><a href="/config/search">Search</a></h4></li>,
        <li><h4><a href="/config/namespaces">XML Namespaces</a></h4></li>,
        <li><h4><a href="/config/transformers">Transformers</a></h4></li>,
        <li><h4><a href="/config/env">Environment Vars</a></h4></li>
    ),
    2,
    (
        <script src="/corona/htools/js/DataTables-1.8.2/js/jquery.dataTables.min.js"><!-- --></script>,
        <script src="/corona/htools/js/DataTables-1.8.2/js/jquery.jeditable.js"><!-- --></script>,
        <script src="/corona/htools/js/DataTables-1.8.2/js/jquery.dataTables.editable.js"><!-- --></script>,
        <script src="/corona/htools/js/namespaces.js"><!-- --></script>
    ),
    (
        <link rel="stylesheet" href="/corona/htools/js/DataTables-1.8.2/css/demo_table.css" type="text/css" media="screen, projection" />
    )
)

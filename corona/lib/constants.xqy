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

module namespace const="http://marklogic.com/corona/constants";


declare variable $const:version as xs:string := "1.0";

declare variable $const:PublicRole as xs:string := "corona::public";
declare variable $const:AdminRole as xs:string := "corona::admin";
declare variable $const:AdminUsersRole as xs:string := "corona::admin-users";
declare variable $const:AdminUsersDeleteRole as xs:string := "corona::admin-users-delete";
declare variable $const:AdminUsersGroupsRole as xs:string := "corona::admin-users-groups";

declare variable $const:AdminStoreRole as xs:string := "corona::admin-store";
declare variable $const:AdminStoreAnyURIRole as xs:string := "corona::admin-store-any-uri";

declare variable $const:ProtectedRoles as xs:string+ := ($const:PublicRole, $const:AdminRole, $const:AdminUsersRole, $const:AdminUsersDeleteRole, $const:AdminUsersGroupsRole, $const:AdminStoreRole, $const:AdminStoreAnyURIRole);

declare variable $const:TransformerReadRole as xs:string := $const:PublicRole;

declare variable $const:TransformersCollection as xs:string := "corona-transformers";
declare variable $const:StoredQueriesCollection as xs:string := "corona-stored-queries";
declare variable $const:UsersCollection as xs:string := "corona-users";

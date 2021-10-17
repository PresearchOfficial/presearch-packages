#!/bin/bash

if [ ! -d "./packages/$1" ]; then
  echo "Creating package: $1"
  mkdir "./packages/$1"
  cd "./packages/$1"
  touch index.js
  printf "'use strict';\n\nasync function $1(query, API_KEY) {\n\t// returns a random integer between 0 and 9\n\tconst randomNumber = Math.floor(Math.random() * 10);\n\t// here you need to return HTML code for your package. You can use <style> and <script> tags\n\t// you need to keep <div id=\"presearchPackage\"> here, you can remove everything else\n\treturn \`\n\t<div id=\"presearchPackage\">\n\t\t<span class=\"mycolor\">Random number: \${randomNumber}</span>\n\t</div>\n\t<!-- example styles - remember to use #presearchPackage before each class -->\n\t<style>\n\t\t/* styles for dark mode should have .dark before */\n\t\t.dark #presearchPackage .mycolor {\n\t\t\tcolor: yellow;\n\t\t}\n\t\t#presearchPackage .mycolor {\n\t\t\tcolor: green;\n\t\t\tcursor: pointer;\n\t\t}\n\t</style>\n\t<!-- example javascript -->\n\t<script>\n\t\tdocument.querySelector(\".mycolor\").addEventListener(\"click\", () => alert(\"clicked!\"));\n\t</script>\n\t\`;\n}\n\n//	here you should check, if the query should trigger your package\n//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice\nasync function trigger(query) {\n\tif (query) {\n\t\t// convert query to lower case, to trigger the package with queries like 'Random number', 'RANDOM NUMBER' etc.\n\t\tquery = query ? query.toLowerCase() : \"\";\n\t\tif (query === \"random number\") return true;\n\t}\n\t// you need to return false when the query should not trigger your package\n\treturn false;\n}\n\nmodule.exports = { $1, trigger };" > index.js
fi

if [ -d "./packages/$1" ]; then
  echo "Package with the same name already exisits, please choose another name"
fi

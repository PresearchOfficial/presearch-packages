'use strict';

/*
  helper tagged template function - sanitize
  helper css classes
  X create package command - npm run create-pacakge <somePackageName>
    if does not exist
      create dir
      create index.js
      create readme.md
      run npm init
      provide information for package.json
  test package command - npm run test <packageName>
  run merge dependencies every git push
*/

async function test() {
  return render`
    <div class="red">
      <h1>Test!</h1>
    </div>
    <style>
      .red {
        background-color: blue;
      }
    </style>
    <script>
      console.log('Hello, world!');
    </script>
  `;
}

async function trigger(query) {
  return query.toLowerCase() === 'test';
}

module.exports = { test, trigger };

'use strict';

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

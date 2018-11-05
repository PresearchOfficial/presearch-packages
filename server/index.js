'use strict';

const express = require('express');

const packageObject = require(`${__dirname}/../index`);

const app = express();
const PORT = 4000;

app.get('/', (req, res) => res.send('Nothing.'));

app.get('/package', async (req, res) => {
  const packageKey = req.query.packageKey;
  const query = req.query.query;
  if (packageKey in packageObject) {
    const trigger = await packageObject[packageKey].trigger(query);
    if (trigger) {
      const result = await packageObject[packageKey][packageKey](query);
      console.log(result, query, packageKey);
      res.send(result);
    }
  }
  else {
    res.status('400');
    res.send('Bad request, package key does not exist or package was not triggered for specified query');
  }
});

app.listen(PORT, () => console.log(`Server listening on: ${PORT}!`));

# Unit Conversion Presearch Package

The purpose of this package is to provide a quick conversion between units.

## How to upgrade and add new units ?

the mechanism is simple:

- Open converter.config.js
- There are two possible ways to create a unity
- Calculation ratio:

```js
const unitName = {
    'method' : 'ratio',
    'base' : 'base unit',
    'convert' : {
      'base unit': 1,
      'value of unit two based on base unit': 5,
      'value of unit three based on the base unit': 0.45,
    }
}
```

 - Calculation formula:

```js
const unitName = {
  method: 'formula',
  convert: {
    unitOne: {
      unitOneValueFromUnitOne: (from) => Number(from),
      unitTwoValueFromUnitOne: (from) => Number(from) * 4 / 5,
    },
    unitTwo: {
      unitTwoValueFromUnitTwo: (from) => Number(from),
      unitOneValueFromUnitTwo: (from) => Number(from) * 5 / 4,
    },
  }
}
```

- Then just add the unity to others:

```js
const units = {
  lengths,
  area,
  temperature,
  theNewUnity // new unity added
}
```

You have just added a new unit, you just have to test it :)

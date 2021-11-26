const lengths = {
  method: 'ratio',
  base: 'meter',
  convert: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    micrometer: 1000000,
    nanometer: 1000000000,
    mile: 0.0006213689,
    yard: 1.0936132983,
    foot: 3.280839895,
    inch: 39.37007874,
    'light year': 1.057008707E-16,
  }
}

const area = {
  method: 'ratio',
  base: 'square meter',
  convert: {
    'square meter': 1,
    'square kilometer': 0.001,
    'square centimeter': 10000,
    'square millimeter': 1000000,
    'square micrometer': 1000000000000,
    'hectare': 0.0001,
    'square mile': 3.861018768E-7,
    'square yard': 1.1959900463,
    'square foot': 10.763910417,
    'square inch': 1550.0031,
    'acre': 0.0002471054,
  }
}

const temperature = {
  method: 'formula',
  convert: {
    celcius: {
      celcius: (from) => Number(from),
      kelvin: (from) => Number(from) + 273.15,
      fahrenheit: (from) => 9 * Number(from) / 5 + 32,
    },
    kelvin: {
      kelvin: (from) => Number(from),
      celcius: (from) => Number(from) - 273.15,
      fahrenheit: (from) => 9 * (Number(from) - 273.15) / 5 + 32,
    },
    fahrenheit: {
      fahrenheit: (from) => Number(from),
      celcius: (from) => (Number(from) - 32) * 5 / 9,
      kelvin: (from) => (Number(from) - 32) * 5 / 9 + 273.15,
    },
  }
}

const units = {
  lengths,
  area,
  temperature,
}

const pluralize = (word) => {
  const plural = (word) => {
    if (word.slice(-1) === 'h' || word.slice(-1) === 's') {
      return word + 'es'
    }

    return word + 's'
  }

  word = word.split(/\s+/)
  word = word.map(plural)

  return word.join(' ')
}

let regexFamilyMatches = {}

for (let [unityFamily, unityFamilyData] of Object.entries(units)) {
  let unityFamilyMatch = []
  for (let [unity] of Object.entries(unityFamilyData.convert)) {
    unityFamilyMatch.push(unity.replace(/\s+/g, '\\s+'))
    unityFamilyMatch.push(pluralize(unity).replace(/\s+/g, '\\s+'))
  }

  unityFamilyMatch = unityFamilyMatch.join('|')
  regexFamilyMatches[unityFamily] = new RegExp('(' + unityFamilyMatch + ')\\s+to\\s+(' + unityFamilyMatch + ')')
}

const match = (query) => {
  if (!(typeof query === 'string')) {
    return false
  }

  for (let [family, regex] of Object.entries(regexFamilyMatches)) {
    let matches = query.toLowerCase().match(regex)
    if (matches) {
      let from = matches[1]
      let to = matches[2]
      for (let [unity] of Object.entries(units[family].convert)) {
        if (from.match(new RegExp('^' + unity))) {
          from = unity;
        }
        if (to.match(new RegExp('^' + unity))) {
          to = unity;
        }
      }

      return {
        family,
        from,
        to,
      }
    }
  }

  return false;
}

const convert = (qty, family, from, to) => {
  if (units[family]['convert'][from] === undefined
    || units[family]['convert'][to] === undefined
  ) {
    return;
  }

  if (units[family]['method'] === 'ratio') {
    let baseValue = units[family]['convert'][units[family]['base']]

    return  qty * baseValue / units[family]['convert'][from] * units[family]['convert'][to]
  }

  if (units[family]['method'] === 'formula') {
    return units[family]['convert'][from][to](qty)
  }
}

const converter = {
  units,
  match,
  convert
}

if (typeof window !== 'undefined') {
  window.converter = converter
} else {
  module.exports = converter
}

'use strict';

const expect = require('expect');
const { generate, DEFAULT_LENGTH, parseAndNormalize } = require("./services");

describe("services", function () {
  describe("generate password", function () {
    it("should generate a password of specific length", function () {
      //It should generate a password of lenght 10
      testPasswordLength(10);

      // It should generate a password of length MIN_LENGTH=8
      testPasswordLength(DEFAULT_LENGTH, 72);

      // It should generate a password of length MIN_LENGTH=8
      testPasswordLength(DEFAULT_LENGTH, 0);
    });

    it("should generate a password of specific length without numbers", function () {
      // It should generate a password of length 10 without numbers
      testPasswordWithoutNumbers(10);

      // It should generate a password of length 64 without numbers
      testPasswordWithoutNumbers(64);

      // It should generate a password of length MIN_LENGTH=8 without numbers
      testPasswordWithoutNumbers(DEFAULT_LENGTH, 72);
    });

    it("should generate a password of specific length without symbols", function () {
      // It should generate a password of length 10 without symbols
      testPasswordWithoutSymbols(10);

      // It should generate a password of length 64 without symbols
      testPasswordWithoutSymbols(64);

      // It should generate a password of length MIN_LENGTH=8 without symbols
      testPasswordWithoutSymbols(DEFAULT_LENGTH, 72);
    });

    it("should generate a password of specific length without uppercase", function () {
      // It should generate a password of length 10 without uppercase
      testPasswordWithoutUppercase(10);

      // It should generate a password of length 64 without uppercase
      testPasswordWithoutUppercase(64);

      // It should generate a password of length MIN_LENGTH=8 without uppercase
      testPasswordWithoutUppercase(DEFAULT_LENGTH, 72);
    });

    it("should generate a password of specific length with exclude", function () {
      // It should generate a password of length 10 without "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"
      testPasswordWithExclude(64, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",]);

      // It should generate a password of length 8 without "a", "b", "c"
      testPasswordWithExclude(DEFAULT_LENGTH, ["a", "b", "c",], 72);
    });
  });

  describe("Query parser", function () {
    it("should parse and normalize queries", function () {
      // It should generate a password of length 10 with numbers, symbols, and uppercase
      testQueryParser(10, "pwd 10");

      // It should generate a password of length 72 with numbers, symbols, and uppercase
      testQueryParser(DEFAULT_LENGTH, "random password 72");

      // Invalid query should return a password of length 8 with numbers, symbols, and uppercase
      testQueryParser(DEFAULT_LENGTH, "pass zero");

      // It should generate a password of length 48 without numbers, symbols, and uppercase
      testQueryParser(48, "pass 48 no-numbers no-symbols no-uppercase", false, false, false);

      // It should generate a password of length 48 without numbers, symbols, and uppercase
      testQueryParser(48, "pass 48 nn ns nu", false, false, false);

      // It should generate a password of length 48 without numbers, symbols, and uppercase
      testQueryParser(48, "pass 48 nu nn ns", false, false, false);

      // It should generate a password of length 64 without numbers
      testQueryParser(64, "pass 64 no-numbers", false);
      testQueryParser(64, "pass 64 nn", false);

      // It should generate a password of length 64 without symbols
      testQueryParser(64, "pass 64 no-symbols", true, false);
      testQueryParser(64, "pass 64 ns", true, false);

      // It should generate a password of length 64 without uppercase
      testQueryParser(64, "pass 64 no-uppercase", true, true, false);
      testQueryParser(64, "pass 64 nu", true, true, false);

      // It should generate a password of length 64 without "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"
      testQueryParser(64, "pass 64 abcdefghijk", true, true, true, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"]);
    });
  });
});




function testPasswordLength(expectedLength, length = expectedLength) {
  const password = generate({ length, numbers: true, symbols: true, uppercase: true, exclude: [] });
  expect(password.length).toBe(expectedLength);
}

function testPasswordWithoutNumbers(expectedLength, length = expectedLength) {
  const password = generate({ length, numbers: false, symbols: true, uppercase: true, exclude: [] });
  expect(password.length).toBe(expectedLength);
  expect(password.match(/[0-9]/)).toBe(null);
}

function testPasswordWithoutSymbols(expectedLength, length = expectedLength) {
  const password = generate({ length, numbers: true, symbols: false, uppercase: true, exclude: [] });
  expect(password.length).toBe(expectedLength);
  expect(password.match(/[^0-9a-zA-Z]/)).toBe(null);
}

function testPasswordWithoutUppercase(expectedLength, length = expectedLength) {
  const password = generate({ length, numbers: true, symbols: true, uppercase: false, exclude: [] });
  expect(password.length).toBe(expectedLength);
  expect(password.match(/[A-Z]/)).toBe(null);
}

function testPasswordWithExclude(expectedLength, exclude, length = expectedLength) {
  const password = generate({ length, numbers: true, symbols: true, uppercase: true, exclude });
  expect(password.length).toBe(expectedLength);
  expect(password.match(new RegExp(`[${exclude.join('')}]`))).toBe(null);
}

function testQueryParser(expectedLength, query, numbers = true, symbols = true, uppercase = true, exclude = []) {
  const result = parseAndNormalize(query);
  expect(result.length).toBe(expectedLength);
  if (!numbers) {
    testPasswordWithoutNumbers(expectedLength, expectedLength);
  }
  if (!symbols) {
    testPasswordWithoutSymbols(expectedLength, expectedLength);
  }
  if (!uppercase) {
    testPasswordWithoutUppercase(expectedLength, expectedLength);
  }
  if (exclude.length > 0) {
    testPasswordWithExclude(expectedLength, exclude, expectedLength);
  }
}

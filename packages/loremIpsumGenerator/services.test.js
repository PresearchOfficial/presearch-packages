'use strict';

const expect = require('expect');
const { generate } = require("./services");
const DEFAULT_LENGTH = 12;

describe("services", function () {
  it("generate lorem ipsum phrase of specific word length ", function () {
    // test case with 10 words, should use default length
    expect(generate(10).split(" ").length).toBe(DEFAULT_LENGTH);
    // test case with 72 words
    expect(generate(72).split(" ").length).toBe(72);
    // test case with 0 words, should use default length
    expect(generate(0).split(" ").length).toBe(DEFAULT_LENGTH);
    // test case with 1000 words
    expect(generate(1000).split(" ").length).toBe(1000);
    // test case with invalid parameter
    expect(generate("zero").split(" ").length).toBe(DEFAULT_LENGTH);
  });

});

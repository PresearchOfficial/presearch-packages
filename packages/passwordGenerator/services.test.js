'use strict';

const expect = require('expect');
const { generate } = require("./services");

describe("services", function () {
  it("generate password of specific length", function () {
    // test case with 10 chars
    expect(generate(10).length).toBe(10);
    // test case with 72 chars should use default length
    expect(generate(72).length).toBe(8);
    // test case with 0 chars should use default length
    expect(generate(0).length).toBe(8);
    // test case with invalid parameter
    expect(generate("zero").length).toBe(8);

  });

});

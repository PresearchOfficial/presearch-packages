const {trigger} = require("./index");

describe("index", function() {
  it("should be able to trigger", function() {
    expect(trigger("AIK")).toBeTruthy();
    expect(trigger("aiK")).toBeTruthy();
    expect(trigger(" ")).toBeFalsy();
    expect(trigger("")).toBeFalsy();
    expect(trigger("presearch")).toBeFalsy();
    expect(trigger("history of AIK")).toBeFalsy();
  })
})

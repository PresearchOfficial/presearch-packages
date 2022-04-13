const {parseAndNormalize, getTeamByName} = require("./services");

describe("services", function() {
  it("should be able to parse and normalize", function() {
    expect(parseAndNormalize("AIK")).toHaveProperty("teamName", "aik");
    expect(parseAndNormalize(undefined)).toEqual(undefined);
    expect(parseAndNormalize("")).toEqual(undefined);
    expect(parseAndNormalize(" ")).toEqual(undefined);
  })

  it("should be able to find a team and league based on name", function () {
    const team = getTeamByName("AIK");
    expect(team).toHaveProperty("teamName", "AIK");
    expect(team).toHaveProperty("leagueName", "Allsvenskan");
  })
})

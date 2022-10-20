const axios = require("axios");
const { parseAndNormalize, convert, fetchRates } = require("./services");

jest.mock("axios");

describe("services", function () {
  it("should be able to parse and normalize a query", function () {
    expect(parseAndNormalize("5 btc to cad")).toEqual({ value: 5, from: "BTC", to: "CAD", fromName: "Bitcoin" });
    // test case sensitivity
    expect(parseAndNormalize("1337 ETh to UsD")).toEqual({ value: 1337, from: "ETH", to: "USD", fromName: "Ethereum" });
    // test no value
    expect(parseAndNormalize("ETh to UsD")).toEqual({ value: 1, from: "ETH", to: "USD", fromName: "Ethereum" });
    // test fractions
    expect(parseAndNormalize("5,6 btc to cad")).toEqual({ value: 5.6, from: "BTC", to: "CAD", fromName: "Bitcoin" });
    expect(parseAndNormalize("5.2 btc to cad")).toEqual({ value: 5.2, from: "BTC", to: "CAD", fromName: "Bitcoin" });
    // test trim
    expect(parseAndNormalize(" 5 btc to cad  ")).toEqual({ value: 5, from: "BTC", to: "CAD", fromName: "Bitcoin" });
    // test fiat 
    expect(parseAndNormalize("1337 eur to UsD")).toEqual({ value: 1337, from: "EUR", to: "USD", fromName: "" });
  });

  it("should be able to fetch rates", async function () {
    axios.get.mockImplementation(url =>
      Promise.resolve({
        data: url.includes("ec.europa.eu")
          ? [
            {
              isoA3Code: "EUR",
              value: 1
            },
            {
              isoA3Code: "USD",
              value: 10,
            }
          ]
          : {
            data: {
              1: {
                symbol: "BTC",
                quote: {
                  USD: {
                    price: 60000,
                  }
                }
              }
            }
          }
      })
    );

    const conversion = {
      from: "EUR",
      to: "BTC",
      value: 5,
    };

    const expected = [
      {
        code: "EUR",
        rate: 1,
        round: 2,
      },
      {
        code: "USD",
        rate: 10,
        round: 2,
      },
      {
        code: "BTC",
        rate: 0.00016666666666666666,
        round: undefined,
      }
    ];

    const rates = await fetchRates(conversion, "123");

    expect(rates).toEqual(expected);
  });

  it("should be able to convert from one currency to another", function () {
    const conversion = {
      from: "EUR",
      to: "SEK",
      value: 100,
    };

    const rates = [
      {
        code: "EUR",
        rate: 1,
      },
      {
        code: "SEK",
        rate: 10.7,
      }
    ];

    const expected = {
      code: "SEK",
      round: undefined,
      value: 1070,
    };

    expect(convert(conversion, rates)).toEqual(expected);
  });

});

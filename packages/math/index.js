"use strict";
const mathjs = require('mathjs');
var mj = mathjs.create(mathjs.all);
mj.config({ number: 'BigNumber' });


async function math(query) {
  let expression;
  let answer;
  if (query === "cal" || query === "calculator") {
    expression = 0;
    answer = '';
  } else {
    try {
      //x and ⋅ are multiplication symbols not a letter x and decimal pointer(.) 
      let result = query.replace(/×/gi, "*");
      result = result.replace(/⋅/gi, "*");
      result = result.replace(/÷/gi, "/");
      const data = mj.evaluate(result);
      expression = result;
      answer = `= ${data}`
    } catch (error) {
      return { error };
    }
  }


  return `

<div id="presearchPackage">
<table>

  <tr>
    <td colspan="4" class="output-container">
      <span data-previous-operand>${expression}</span>
      <span data-current-operand>${answer}</span>
    </td>
  </tr>

  <tr>
    <td colspan="2" style="padding-top:4px;">
      <button type="button" name="del" data-delete>DEL</button>
    </td>
    <td colspan="2" style="padding-top:4px;">
      <button type="button" name="ac" data-all-clear>AC</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>7</button>
    </td>
    <td>
      <button type="button" data-number>8</button>
    </td>
    <td>
      <button type="button" data-number>9</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>/</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>4</button>
    </td>
    <td>
      <button type="button" data-number>5</button>
    </td>
    <td>
      <button type="button" data-number>6</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>*</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>1</button>
    </td>
    <td>
      <button type="button" data-number>2</button>
    </td>
    <td>
      <button type="button" data-number>3</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>-</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>0</button>
    </td>
    <td>
      <button type="button" data-number>.</button>
    </td>
    <td>
      <button name="equal" type="button" data-equals>=</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>+</button>
    </td>
  </tr>

</table>
</div>
<script>


/*
 * ============ BEGIN big.js ==========
 *  big.js v6.2.1
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2022 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */

var GLOBAL = this;

var Big,
    /************************************** EDITABLE DEFAULTS *****************************************/

    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places (DP) of the results of operations involving division:
     * div and sqrt, and pow with negative exponents.
     */
    DP = 20, // 0 to MAX_DP
    /*
     * The rounding mode (RM) used when rounding to the above decimal places.
     *
     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
     *  3  Away from zero.                                  (ROUND_UP)
     */
    RM = 1, // 0, 1, 2 or 3
    // The maximum value of DP and Big.DP.
    MAX_DP = 1e6, // 0 to 1000000
    // The maximum magnitude of the exponent argument to the pow method.
    MAX_POWER = 1e6, // 1 to 1000000
    /*
     * The negative exponent (NE) at and beneath which toString returns exponential notation.
     * (JavaScript numbers: -7)
     * -1000000 is the minimum recommended exponent value of a Big.
     */
    NE = -7, // 0 to -1000000
    /*
     * The positive exponent (PE) at and above which toString returns exponential notation.
     * (JavaScript numbers: 21)
     * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
     */
    PE = 21, // 0 to 1000000
    /*
     * When true, an error will be thrown if a primitive number is passed to the Big constructor,
     * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
     * primitive number without a loss of precision.
     */
    STRICT = false, // true or false
    /**************************************************************************************************/

    // Error messages.
    NAME = "[big.js] ",
    INVALID = NAME + "Invalid ",
    INVALID_DP = INVALID + "decimal places",
    INVALID_RM = INVALID + "rounding mode",
    DIV_BY_ZERO = NAME + "Division by zero",
    // The shared prototype object.
    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

/*
 * Create and return a Big constructor.
 */
function _Big_() {
    function Big(n) {
        var x = this;

        // Enable constructor usage without new.
        if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

        // Duplicate.
        if (n instanceof Big) {
            x.s = n.s;
            x.e = n.e;
            x.c = n.c.slice();
        } else {
            if (typeof n !== "string") {
                if (Big.strict === true && typeof n !== "bigint") {
                    throw TypeError(INVALID + "value");
                }

                // Minus zero?
                n = n === 0 && 1 / n < 0 ? "-0" : String(n);
            }

            parse(x, n);
        }

        // Retain a reference to this Big constructor.
        // Shadow Big.prototype.constructor which points to Object.
        x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.strict = STRICT;
    Big.roundDown = 0;
    Big.roundHalfUp = 1;
    Big.roundHalfEven = 2;
    Big.roundUp = 3;

    return Big;
}

function parse(x, n) {
    var e, i, nl;

    // if (!NUMERIC.test(n)) {
    //     throw Error(INVALID + "number");
    // }

    // Determine sign.
    x.s = n.charAt(0) == "-" ? ((n = n.slice(1)), -1) : 1;

    // Decimal point?
    if ((e = n.indexOf(".")) > -1) n = n.replace(".", "");

    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {
        // Determine exponent.
        if (e < 0) e = i;
        e += +n.slice(i + 1);
        n = n.substring(0, i);
    } else if (e < 0) {
        // Integer.
        e = n.length;
    }

    nl = n.length;

    // Determine leading zeros.
    for (i = 0; i < nl && n.charAt(i) == "0"; ) ++i;

    if (i == nl) {
        // Zero.
        x.c = [(x.e = 0)];
    } else {
        // Determine trailing zeros.
        for (; nl > 0 && n.charAt(--nl) == "0"; );
        x.e = e - i - 1;
        x.c = [];

        // Convert string to array of digits without leading/trailing zeros.
        for (e = 0; i <= nl; ) x.c[e++] = +n.charAt(i++);
    }

    return x;
}

function round(x, sd, rm, more) {
    var xc = x.c;

    if (rm === UNDEFINED) rm = x.constructor.RM;
    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
        throw Error(INVALID_RM);
    }

    if (sd < 1) {
        more = (rm === 3 && (more || !!xc[0])) || (sd === 0 && ((rm === 1 && xc[0] >= 5) || (rm === 2 && (xc[0] > 5 || (xc[0] === 5 && (more || xc[1] !== UNDEFINED))))));

        xc.length = 1;

        if (more) {
            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
            x.e = x.e - sd + 1;
            xc[0] = 1;
        } else {
            // Zero.
            xc[0] = x.e = 0;
        }
    } else if (sd < xc.length) {
        // xc[sd] is the digit after the digit that may be rounded up.
        more = (rm === 1 && xc[sd] >= 5) || (rm === 2 && (xc[sd] > 5 || (xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)))) || (rm === 3 && (more || !!xc[0]));

        // Remove any digits after the required precision.
        xc.length = sd;

        // Round up?
        if (more) {
            // Rounding up may mean the previous digit has to be rounded up.
            for (; ++xc[--sd] > 9; ) {
                xc[sd] = 0;
                if (sd === 0) {
                    ++x.e;
                    xc.unshift(1);
                    break;
                }
            }
        }

        // Remove trailing zeros.
        for (sd = xc.length; !xc[--sd]; ) xc.pop();
    }

    return x;
}

function stringify(x, doExponential, isNonzero) {
    var e = x.e,
        s = x.c.join(""),
        n = s.length;

    // Exponential notation?
    if (doExponential) {
        s = s.charAt(0) + (n > 1 ? "." + s.slice(1) : "") + (e < 0 ? "e" : "e+") + e;

        // Normal notation.
    } else if (e < 0) {
        for (; ++e; ) s = "0" + s;
        s = "0." + s;
    } else if (e > 0) {
        if (++e > n) {
            for (e -= n; e--; ) s += "0";
        } else if (e < n) {
            s = s.slice(0, e) + "." + s.slice(e);
        }
    } else if (n > 1) {
        s = s.charAt(0) + "." + s.slice(1);
    }

    return x.s < 0 && isNonzero ? "-" + s : s;
}

P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
};

P.cmp = function (y) {
    var isneg,
        x = this,
        xc = x.c,
        yc = (y = new x.constructor(y)).c,
        i = x.s,
        j = y.s,
        k = x.e,
        l = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) return !xc[0] ? (!yc[0] ? 0 : -j) : i;

    // Signs differ?
    if (i != j) return i;

    isneg = i < 0;

    // Compare exponents.
    if (k != l) return (k > l) ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = -1; ++i < j; ) {
        if (xc[i] != yc[i]) return (xc[i] > yc[i]) ^ isneg ? 1 : -1;
    }

    // Compare lengths.
    return k == l ? 0 : (k > l) ^ isneg ? 1 : -1;
};

P.div = function (y) {
    var x = this,
        Big = x.constructor,
        a = x.c, // dividend
        b = (y = new Big(y)).c, // divisor
        k = x.s == y.s ? 1 : -1,
        dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
    }

    // Divisor is zero?
    if (!b[0]) {
        throw Error(DIV_BY_ZERO);
    }

    // Dividend is 0? Return +-0.
    if (!a[0]) {
        y.s = k;
        y.c = [(y.e = 0)];
        return y;
    }

    var bl,
        bt,
        n,
        cmp,
        ri,
        bz = b.slice(),
        ai = (bl = b.length),
        al = a.length,
        r = a.slice(0, bl), // remainder
        rl = r.length,
        q = y, // quotient
        qc = (q.c = []),
        qi = 0,
        p = dp + (q.e = x.e - y.e) + 1; // precision of the result

    q.s = k;
    k = p < 0 ? 0 : p;

    // Create version of divisor with leading zero.
    bz.unshift(0);

    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl; ) r.push(0);

    do {
        // n is how many times the divisor goes into current remainder.
        for (n = 0; n < 10; n++) {
            // Compare divisor and remainder.
            if (bl != (rl = r.length)) {
                cmp = bl > rl ? 1 : -1;
            } else {
                for (ri = -1, cmp = 0; ++ri < bl; ) {
                    if (b[ri] != r[ri]) {
                        cmp = b[ri] > r[ri] ? 1 : -1;
                        break;
                    }
                }
            }

            // If divisor < remainder, subtract divisor from remainder.
            if (cmp < 0) {
                // Remainder can't be more than 1 digit longer than divisor.
                // Equalise lengths using divisor with extra leading zero?
                for (bt = rl == bl ? b : bz; rl; ) {
                    if (r[--rl] < bt[rl]) {
                        ri = rl;
                        for (; ri && !r[--ri]; ) r[ri] = 9;
                        --r[ri];
                        r[rl] += 10;
                    }
                    r[rl] -= bt[rl];
                }

                for (; !r[0]; ) r.shift();
            } else {
                break;
            }
        }

        // Add the digit n to the result array.
        qc[qi++] = cmp ? n : ++n;

        // Update the remainder.
        if (r[0] && cmp) r[rl] = a[ai] || 0;
        else r = [a[ai]];
    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {
        // There can't be more than one zero.
        qc.shift();
        q.e--;
        p--;
    }

    // Round?
    if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

    return q;
};

P.eq = function (y) {
    return this.cmp(y) === 0;
};

P.gt = function (y) {
    return this.cmp(y) > 0;
};

P.gte = function (y) {
    return this.cmp(y) > -1;
};

P.lt = function (y) {
    return this.cmp(y) < 0;
};

P.lte = function (y) {
    return this.cmp(y) < 1;
};

P.minus = P.sub = function (y) {
    var i,
        j,
        t,
        xlty,
        x = this,
        Big = x.constructor,
        a = x.s,
        b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
        y.s = -b;
        return x.plus(y);
    }

    var xc = x.c.slice(),
        xe = x.e,
        yc = y.c,
        ye = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) {
        if (yc[0]) {
            y.s = -b;
        } else if (xc[0]) {
            y = new Big(x);
        } else {
            y.s = 1;
        }
        return y;
    }

    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if ((a = xe - ye)) {
        if ((xlty = a < 0)) {
            a = -a;
            t = xc;
        } else {
            ye = xe;
            t = yc;
        }

        t.reverse();
        for (b = a; b--; ) t.push(0);
        t.reverse();
    } else {
        // Exponents equal. Check digit by digit.
        j = ((xlty = xc.length < yc.length) ? xc : yc).length;

        for (a = b = 0; b < j; b++) {
            if (xc[b] != yc[b]) {
                xlty = xc[b] < yc[b];
                break;
            }
        }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
    }

    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--; ) xc[i++] = 0;

    // Subtract yc from xc.
    for (b = i; j > a; ) {
        if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i]; ) xc[i] = 9;
            --xc[i];
            xc[j] += 10;
        }

        xc[j] -= yc[j];
    }

    // Remove trailing zeros.
    for (; xc[--b] === 0; ) xc.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0; ) {
        xc.shift();
        --ye;
    }

    if (!xc[0]) {
        // n - n = +0
        y.s = 1;

        // Result must be zero.
        xc = [(ye = 0)];
    }

    y.c = xc;
    y.e = ye;

    return y;
};

P.mod = function (y) {
    var ygtx,
        x = this,
        Big = x.constructor,
        a = x.s,
        b = (y = new Big(y)).s;

    if (!y.c[0]) {
        throw Error(DIV_BY_ZERO);
    }

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
};

P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return x;
};

P.plus = P.add = function (y) {
    var e,
        k,
        t,
        x = this,
        Big = x.constructor;

    y = new Big(y);

    // Signs differ?
    if (x.s != y.s) {
        y.s = -y.s;
        return x.minus(y);
    }

    var xe = x.e,
        xc = x.c,
        ye = y.e,
        yc = y.c;

    // Either zero?
    if (!xc[0] || !yc[0]) {
        if (!yc[0]) {
            if (xc[0]) {
                y = new Big(x);
            } else {
                y.s = x.s;
            }
        }
        return y;
    }

    xc = xc.slice();

    // Prepend zeros to equalise exponents.
    // Note: reverse faster than unshifts.
    if ((e = xe - ye)) {
        if (e > 0) {
            ye = xe;
            t = yc;
        } else {
            e = -e;
            t = xc;
        }

        t.reverse();
        for (; e--; ) t.push(0);
        t.reverse();
    }

    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
        t = yc;
        yc = xc;
        xc = t;
    }

    e = yc.length;

    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (k = 0; e; xc[e] %= 10) k = ((xc[--e] = xc[e] + yc[e] + k) / 10) | 0;

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

    if (k) {
        xc.unshift(k);
        ++ye;
    }

    // Remove trailing zeros.
    for (e = xc.length; xc[--e] === 0; ) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
};

P.pow = function (n) {
    var x = this,
        one = new x.constructor("1"),
        y = one,
        isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
        throw Error(INVALID + "exponent");
    }

    if (isneg) n = -n;

    for (;;) {
        if (n & 1) y = y.times(x);
        n >>= 1;
        if (!n) break;
        x = x.times(x);
    }

    return isneg ? one.div(y) : y;
};

P.prec = function (sd, rm) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
        throw Error(INVALID + "precision");
    }
    return round(new this.constructor(this), sd, rm);
};

P.round = function (dp, rm) {
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
        throw Error(INVALID_DP);
    }
    return round(new this.constructor(this), dp + this.e + 1, rm);
};

P.sqrt = function () {
    var r,
        c,
        t,
        x = this,
        Big = x.constructor,
        s = x.s,
        e = x.e,
        half = new Big("0.5");

    // Zero?
    if (!x.c[0]) return new Big(x);

    // Negative?
    if (s < 0) {
        throw Error(NAME + "No square root");
    }

    // Estimate.
    s = Math.sqrt(x + "");

    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
        c = x.c.join("");
        if (!((c.length + e) & 1)) c += "0";
        s = Math.sqrt(c);
        e = (((e + 1) / 2) | 0) - (e < 0 || e & 1);
        r = new Big((s == 1 / 0 ? "5e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + e);
    } else {
        r = new Big(s + "");
    }

    e = r.e + (Big.DP += 4);

    // Newton-Raphson iteration.
    do {
        t = r;
        r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join("") !== r.c.slice(0, e).join(""));

    return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
};

P.times = P.mul = function (y) {
    var c,
        x = this,
        Big = x.constructor,
        xc = x.c,
        yc = (y = new Big(y)).c,
        a = xc.length,
        b = yc.length,
        i = x.e,
        j = y.e;

    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;

    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0]) {
        y.c = [(y.e = 0)];
        return y;
    }

    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;

    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
        c = xc;
        xc = yc;
        yc = c;
        j = a;
        a = b;
        b = j;
    }

    // Initialise coefficient array of result with zeros.
    for (c = new Array((j = a + b)); j--; ) c[j] = 0;

    // Multiply.

    // i is initially xc.length.
    for (i = b; i--; ) {
        b = 0;

        // a is yc.length.
        for (j = a + i; j > i; ) {
            // Current sum of products at this digit position, plus carry.
            b = c[j] + yc[i] * xc[j - i - 1] + b;
            c[j--] = b % 10;

            // carry
            b = (b / 10) | 0;
        }

        c[j] = b;
    }

    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b) ++y.e;
    else c.shift();

    // Remove trailing zeros.
    for (i = c.length; !c[--i]; ) c.pop();
    y.c = c;

    return y;
};

P.toExponential = function (dp, rm) {
    var x = this,
        n = x.c[0];

    if (dp !== UNDEFINED) {
        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throw Error(INVALID_DP);
        }
        x = round(new x.constructor(x), ++dp, rm);
        for (; x.c.length < dp; ) x.c.push(0);
    }

    return stringify(x, true, !!n);
};

P.toFixed = function (dp, rm) {
    var x = this,
        n = x.c[0];

    if (dp !== UNDEFINED) {
        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throw Error(INVALID_DP);
        }
        x = round(new x.constructor(x), dp + x.e + 1, rm);

        // x.e may have changed if the value is rounded up.
        for (dp = dp + x.e + 1; x.c.length < dp; ) x.c.push(0);
    }

    return stringify(x, false, !!n);
};

P.toJSON = P.toString = function () {
    var x = this,
        Big = x.constructor;
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
};

P.toNumber = function () {
    var n = Number(stringify(this, true, true));
    if (this.constructor.strict === true && !this.eq(n.toString())) {
        throw Error(NAME + "Imprecise conversion");
    }
    return n;
};

P.toPrecision = function (sd, rm) {
    var x = this,
        Big = x.constructor,
        n = x.c[0];

    if (sd !== UNDEFINED) {
        if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
            throw Error(INVALID + "precision");
        }
        x = round(new Big(x), sd, rm);
        for (; x.c.length < sd; ) x.c.push(0);
    }

    return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
};

P.valueOf = function () {
    var x = this,
        Big = x.constructor;
    if (Big.strict === true) {
        throw Error(NAME + "valueOf disallowed");
    }
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
};

// Export

Big = _Big_();

Big["default"] = Big.Big = Big;

//AMD.
if (typeof define === "function" && define.amd) {
    define(function () {
        return Big;
    });

    // Node and other CommonJS-like environments that support module.exports.
} else if (typeof module !== "undefined" && module.exports) {
    module.exports = Big;

    //Browser.
} else {
    GLOBAL.Big = Big;
}

/*
 * ============ END big.js ============
*/

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
  }

  clear() {
      this.currentOperand =''
      this.previousOperand =''
      this.operation = undefined
  }

  delete() {
      if (this.currentOperand.length == 0 && this.operation) {
          this.operation = undefined
          this.currentOperand = this.previousOperand
          this.previousOperand = ''
      } else {
          this.currentOperand = this.currentOperand.toString().slice(0, -1)
      }
  }

  appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
      if (this.currentOperand ==='') return
      if (this.previousOperand !=='') {
          this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand =''
  }

  compute() {
      let computation
      const prev = this.previousOperand
      const current = this.currentOperand
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
          case '+':
              computation = new Big(prev).plus(current)
              break
          case '-':
              computation = new Big(prev).minus(current)
              break
          case '*':
              computation = new Big(prev).times(current)
              break
          case '/':
            try{
              computation = new Big(prev).div(current)
            }
            catch (e) {
              computation = Infinity
            }
              break
          default:
              return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand =''
  }

  getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
          integerDisplay =''
      } else {
          integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
          return integerDisplay+"."+decimalDigits 
      } else {
          return integerDisplay
      }
  }

  updateDisplay() {
      this.currentOperandTextElement.innerText =
          this.getDisplayNumber(this.currentOperand)
      if (this.previousOperand.length != 0) {
          this.previousOperandTextElement.innerText =this.getDisplayNumber(this.previousOperand)+(this.operation ? this.operation : '')
      } else {
          this.previousOperandTextElement.innerText =''
      }
  }

}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', () => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
  calculator.delete()
  calculator.updateDisplay()
})

let searchInputFocused = false;
document.querySelector('input').addEventListener('mouseover', e => {
  searchInputFocused = true;
})

document.querySelector('#presearchPackage').addEventListener('mouseover', e => {
  searchInputFocused = false;
})

document.addEventListener('keydown', function (event) {
  if (searchInputFocused) return;
  event.preventDefault();
  switch (event.key) {
    case '+':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '-':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '*':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '/':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '1':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '2':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '3':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '4':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '5':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '6':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '7':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '8':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '9':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '0':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '.':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case 'Enter':
        calculator.compute()
        calculator.updateDisplay()
        break;
    case '=':
        calculator.compute()
        calculator.updateDisplay()
        break;
    case 'Backspace':
        calculator.delete()
        calculator.updateDisplay()
        break;
    case 'Delete':
        calculator.clear()
        calculator.updateDisplay()
        break;
    default:
        return
}
});

</script>
<style>
  #presearchPackage .output-container{
    width: 100%;
    height: 45px;
    text-align: right;
    font-weight: bold;
    font-size: x-large;
    border-width: 1px;
    border-style: solid;
    opacity: 0.5;
    margin: 100px;
    padding-right:6px;
    max-width: 30px;
    overflow-wrap: anywhere;
  }
  .dark #presearchPackage .output-container {
    color: #fff;
    opacity: .8;
  }
  #presearchPackage .output-container:hover{
    opacity: 1;
  }
  #presearchPackage button[type=button]{
    opacity: 0.8;
    background-color: #f5f5f5;
    background-image: linear-gradient(top, #f5f5f5, #f1f1f1);
    border: 1px solid #dedede;
    color: #444;
    height: 40px;
    width: 80px;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    font-size: 1.2em;
    font-weight: normal;
  }
  #presearchPackage button[type=button]:hover{
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      background-image: linear-gradient(top, #f8f8f8, #f1f1f1);
      opacity: 1;
      border: 1px solid #c6c6c6;
      color: #222;
      cursor: pointer;
  }
  #presearchPackage button[name=equal] {
    background-color: #4d90fe;
    background-image: linear-gradient(top, #4d90fe, #4787ed);
    border: 1px solid #3079ed;
    color: #fefefe;
  }
  #presearchPackage button[name=equal]:hover {
    background-color: #4d90fe;
    background-image: linear-gradient(top, #4d90fe, #357ae8);
    border: 1px solid #2f5bb7;
    color: #fefefe;
  }
  #presearchPackage button[name=operator] {
    border: 1px solid #c6c6c6;
    background-color: #d6d6d6;
  }
  #presearchPackage button[name=ac] {
    width: 100%;
  }
  #presearchPackage button[name=del] {
    width: 100%;
  }
</style>

  `;
}
async function trigger(query) {
  //ignore phone numbers
  const regexPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (query.match(regexPhoneNumber)) {
    return false;
  }
  query = query.toLowerCase();
  if (query === "calculator" || query === "cal" || query === "calc") {
    return true
  }
  const chars = new RegExp(/([a-zA-Z])+/g);
  if (!isNaN(query) || chars.test(query)) return false;
  try {
    //x and ⋅ are multiplication symbols not a letter x and decimal pointer(.)
    let result = query.replace(/×/gi, "*");
    result = result.replace(/⋅/gi, "*");
    result = result.replace(/÷/gi, "/");
    mj.evaluate(result);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { math, trigger };

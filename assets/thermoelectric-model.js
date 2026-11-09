/* Constant-property thermoelectric model. Temperatures in K; R in ohm;
 * K in W/K; alpha in V/K; currents in A; heat rates and power in W.
 * ZT denotes Z * mean(T), not a material's peak zT.
 * Sources and assumptions: assets/research/SOURCES.md.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ThermoelectricModel = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function coolingLimit(zt, th, delta) {
    const tc = th - delta;
    if (zt < 0 || delta <= 0 || tc <= 0) throw new RangeError("Invalid cooling conditions");
    const m = Math.sqrt(1 + zt);
    const carnot = tc / delta;
    const threshold = (th / tc) ** 2 - 1;
    const feasible = zt > threshold;
    return { tc, carnot, threshold, feasible, cop: feasible ? carnot * (m - th / tc) / (m + 1) : null };
  }

  function cooler({ alpha, resistance, conductance, th, delta, current }) {
    const tc = th - delta;
    if (alpha <= 0 || resistance <= 0 || conductance <= 0 || tc <= 0 || delta <= 0 || current < 0) {
      throw new RangeError("Invalid device parameters");
    }
    const meanT = (th + tc) / 2;
    const z = alpha ** 2 / (resistance * conductance);
    const zt = z * meanT;
    const peltier = alpha * tc * current;
    const conduction = conductance * delta;
    const joule = 0.5 * resistance * current ** 2;
    const qc = peltier - conduction - joule;
    const input = alpha * delta * current + resistance * current ** 2;
    const limit = coolingLimit(zt, th, delta);
    const iMaxQ = alpha * tc / resistance;
    const qMax = alpha ** 2 * tc ** 2 / (2 * resistance) - conduction;
    // Rationalized form avoids cancellation when ZT is small.
    const iMaxCOP = limit.feasible ? alpha * delta * (Math.sqrt(1 + zt) + 1) / (resistance * zt) : null;
    return {
      tc, meanT, z, zt, peltier, conduction, joule, qc, input,
      rejected: qc + input,
      cop: qc > 0 && input > 0 ? qc / input : null,
      iMaxQ, qMax, iMaxCOP, maxCOP: limit.cop,
    };
  }

  function generation(zt, tc, delta) {
    if (zt < 0 || tc <= 0 || delta < 0) throw new RangeError("Invalid generator conditions");
    const th = tc + delta;
    const m = Math.sqrt(1 + zt);
    const carnot = delta / th;
    const relative = (m - 1) / (m + tc / th);
    return { th, carnot, efficiency: carnot * relative, relative: delta > 0 ? relative : null };
  }

  function noLoadDelta(z, th) {
    if (z <= 0 || th <= 0) throw new RangeError("Invalid no-load conditions");
    const m = Math.sqrt(1 + 2 * z * th);
    return th * (m - 1) / (m + 1);
  }

  return Object.freeze({ coolingLimit, cooler, generation, noLoadDelta });
});

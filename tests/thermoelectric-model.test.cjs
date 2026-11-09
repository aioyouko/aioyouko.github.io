const assert = require('node:assert/strict');
const { coolingLimit, cooler, generation, noLoadDelta } = require('../assets/thermoelectric-model.js');
const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);

// An independently calculated energy balance for the illustrative module.
const base = { alpha: 0.05, resistance: 2, conductance: 0.4, th: 300, delta: 30, current: 3 };
const sample = cooler(base);
close(sample.qc, 19.5);
close(sample.input, 22.5);
close(sample.rejected, 42);
close(sample.cop, 19.5 / 22.5);
close(sample.zt, 0.890625);

// Check analytic optima against the underlying heat/power equations, including
// no-cooling states. Sample the entire range offered by the controls.
for (const conductance of [0.2, 0.4, 0.8, 1.2]) {
  for (const delta of [5, 30, 60, 100]) {
    const p = { ...base, conductance, delta };
    const state = cooler(p);
    const peak = cooler({ ...p, current: state.iMaxQ });
    close(peak.qc, state.qMax);
    for (const shift of [-0.1, 0.1]) assert.ok(cooler({ ...p, current: state.iMaxQ + shift }).qc < peak.qc);
    if (state.iMaxCOP !== null) {
      const best = cooler({ ...p, current: state.iMaxCOP });
      close(best.cop, state.maxCOP);
      for (const shift of [-0.01, 0.01]) assert.ok(cooler({ ...p, current: state.iMaxCOP + shift }).cop < best.cop);
      assert.ok(best.cop < best.tc / delta);
    } else assert.ok(state.qMax <= 0);
    const zero = cooler({ ...p, current: 0 });
    assert.equal(zero.cop, null);
    close(zero.input, 0);
    close(zero.qc, -conductance * delta);
  }
}

for (const zt of [0, 0.1, 0.5, 1, 2, 4]) {
  for (const tc of [250, 300, 350]) {
    let previous = -1;
    for (let delta = 0; delta <= 500; delta += 5) {
      const g = generation(zt, tc, delta);
      assert.ok(Number.isFinite(g.efficiency));
      assert.ok(g.efficiency >= previous && g.efficiency <= g.carnot);
      previous = g.efficiency;
    }
  }
}
close(generation(1, 300, 100).efficiency, 0.25 * (Math.SQRT2 - 1) / (Math.SQRT2 + 0.75));
// Independently reproduce maximum efficiency from hot-side heat balance and
// the load ratio R_load / R = sqrt(1 + ZT), not maximum-power load matching.
for (const delta of [5, 30, 100, 500]) {
  const alpha = 0.05, r = 2, k = 0.4, tc = 300, th = tc + delta;
  const zt = alpha ** 2 * (th + tc) / (2 * r * k);
  const loadRatio = Math.sqrt(1 + zt);
  const efficiencyAtLoad = (ratio) => {
    const current = alpha * delta / (r * (1 + ratio));
    const hotHeat = alpha * th * current + k * delta - 0.5 * r * current ** 2;
    const output = alpha * delta * current - r * current ** 2;
    return output / hotHeat;
  };
  close(efficiencyAtLoad(loadRatio), generation(zt, tc, delta).efficiency);
  for (const shift of [-0.05, 0.05]) assert.ok(efficiencyAtLoad(loadRatio + shift) < efficiencyAtLoad(loadRatio));
}
assert.equal(generation(1, 300, 0).relative, null);
assert.equal(coolingLimit(0, 300, 30).cop, null);
assert.equal(coolingLimit((300 / 270) ** 2 - 1, 300, 30).cop, null);

const deltaMax = noLoadDelta(sample.z, 300);
const atLimit = cooler({ ...base, delta: deltaMax, current: 0 });
close(cooler({ ...base, delta: deltaMax, current: atLimit.iMaxQ }).qc, 0);
assert.throws(() => coolingLimit(1, 300, 300), RangeError);
console.log('Thermoelectric model: energy balances, optima, Carnot bounds, zero-current and no-load limits passed.');

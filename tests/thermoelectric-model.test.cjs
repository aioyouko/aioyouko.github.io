const assert = require('node:assert/strict');
const { coolingLimit, cooler, generation, noLoadDelta, moduleProperties, shareLoad } = require('../assets/thermoelectric-model.js');
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
// Module builder: the 127-couple bulk design reproduces a typical 40 x 40 mm module.
const bulk = moduleProperties({ couples: 127, width: 1.4e-3, length: 1.6e-3 });
close(bulk.alpha, 0.0508);
close(bulk.resistance, 254 * (1e-5 * 1.6e-3 / 1.96e-6 + 2e-10 / 1.96e-6));
close(bulk.conductance, 254 * 1.5 * 1.96e-6 / 1.6e-3);
close(bulk.footprint, 254 * 1.96e-6 / 0.3);
close(bulk.alpha ** 2 * 300 ** 2 / (2 * bulk.resistance), 55.31, 1e-3);
close(noLoadDelta(bulk.alpha ** 2 / (bulk.resistance * bulk.conductance), 300), 69.79, 1e-3);
// alpha, R and K scale linearly with N, so currents and ZT do not depend on N.
const one = moduleProperties({ couples: 1, width: 1.4e-3, length: 1.6e-3 });
close(bulk.resistance / one.resistance, 127);
close(cooler({ ...bulk, th: 300, delta: 20, current: 3 }).zt, cooler({ alpha: one.alpha, resistance: one.resistance, conductance: one.conductance, th: 300, delta: 20, current: 3 }).zt);
assert.throws(() => moduleProperties({ couples: 0, width: 1e-3, length: 1e-3 }), RangeError);
// Hot-side range used by the page (300-400 K): optima stay consistent with the energy balance.
for (const th of [300, 350, 373, 400]) {
  for (const delta of [5, 20, 50]) {
    const p = { ...bulk, th, delta, current: 1 };
    const state = cooler(p);
    close(cooler({ ...p, current: state.iMaxQ }).qc, state.qMax);
    if (state.iMaxCOP !== null) close(cooler({ ...p, current: state.iMaxCOP }).cop, state.maxCOP);
  }
}
// Working-environment check: the fewest modules carry the load, each at the lower
// current that pumps exactly its share, and the energy balance closes.
for (const th of [300, 373]) {
  for (const load of [50, 150, 300]) {
    const env = { ...bulk, th, delta: 20 };
    const share = shareLoad(env, load);
    assert.ok(share.modules >= 1 && share.modules * share.qMax >= load - 1e-9 && (share.modules - 1) * share.qMax < load);
    const each = cooler({ ...env, current: share.current });
    close(each.qc, load / share.modules, 1e-7);
    assert.ok(share.current <= each.iMaxQ + 1e-9);
    close(share.input, share.modules * each.input, 1e-9);
    close(share.rejected, load + share.input, 1e-9);
  }
}
assert.equal(shareLoad({ ...bulk, th: 300, delta: 90 }, 150), null);
close(shareLoad({ ...bulk, th: 300, delta: 20 }, 0).input, 0);
console.log('Thermoelectric model: energy balances, optima, Carnot bounds, zero-current and no-load limits passed.');

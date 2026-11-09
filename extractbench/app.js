(() => {
  "use strict";
  const data = window.EXTRACTBENCH;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const percent = value => value == null || !Number.isFinite(value) ? "n/a" : `${value.toFixed(1)}%`;
  const byKey = new Map(data.models.map(m => [m.key, m]));
  const url = new URL(location.href);
  if (data.groups.includes(url.searchParams.get("condition"))) $("condition").value = url.searchParams.get("condition");
  if (["Y5_pct", "Y10_pct", "Y15_pct"].includes(url.searchParams.get("metric"))) $("metric").value = url.searchParams.get("metric");
  $("modelSearch").value = url.searchParams.get("q") || "";

  function curveLink(model, group, example = false) {
    const d1 = group.startsWith("D1");
    const condition = d1 ? (group === "D1_same" ? "same" : "different") : (group.endsWith("_without") ? "without" : "with");
    const p = new URLSearchParams({difficulty: d1 ? "D1" : "D2", condition, model, models:model, property:"seebeck"});
    if (!d1) { p.set("sample", "S01"); p.set("question", !example && group.includes("error") ? "D2_F_01" : "D2_A_01"); }
    return `explorer/?${p}`;
  }

  function renderResults() {
    const group = $("condition").value;
    const metric = $("metric").value;
    const search = $("modelSearch").value.trim().toLowerCase();
    const all = data.results.filter(r => r.group === group).sort((a,b) => a.model_order - b.model_order);
    const rows = all.filter(r => r.model_label.toLowerCase().includes(search));
    const m = metric.replace("_pct", "");
    $("yieldHeading").innerHTML = `${m} <span>↑ better</span>`;
    $("resultCount").textContent = `${rows.length} / ${all.length} configurations · ${all[0].question_count} question slots · ${all[0].property_count} properties`;
    $("conditionNote").hidden = !all[0].gold_binding_provisional;
    $("conditionNote").textContent = "Provisional reference: this condition includes different-source D1 set 1, whose Gold/image binding remains under review. Interpret these summaries with that limitation.";
    $("resultRows").innerHTML = rows.map(r => {
      const model = byKey.get(r.canonical_key);
      const score = r[metric];
      const valid = score != null && Number.isFinite(score);
      return `<tr><td class="model-cell"><strong>${esc(model.family)}</strong><small>${esc(model.effort)}</small></td><td><div class="score-cell"><span class="score-track">${valid ? `<i style="width:${Math.max(0,Math.min(100,score))}%"></i>` : ""}</span><span class="score-number">${percent(score)}</span></div></td><td>${percent(r.Coverage_pct)}</td><td>${percent(r.schema_valid_pct)}</td><td><a class="curve-link" href="${esc(curveLink(r.canonical_key,group))}" aria-label="Inspect curves for ${esc(model.label)}">Curves ↗</a></td></tr>`;
    }).join("");
    $("noResults").hidden = rows.length > 0;
    const params = new URLSearchParams({condition:group,metric});
    if (search) params.set("q", $("modelSearch").value.trim());
    history.replaceState(null,"",`${location.pathname}?${params}${location.hash}`);
  }

  function renderExample() {
    const key = $("exampleModel").value;
    const model = byKey.get(key);
    const gold = data.example.gold;
    const prediction = (data.example.predictions[key] || []).filter(p => p.every(Number.isFinite));
    const all = [...gold,...prediction];
    const xs = all.map(p=>p[0]), ys = all.map(p=>p[1]);
    let xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
    const dx = (xmax - xmin || 1)*.08, dy = (ymax - ymin || 1)*.18;
    xmin -= dx; xmax += dx; ymin -= dy; ymax += dy;
    const x = v => 59 + (v - xmin)/(xmax-xmin)*365;
    const y = v => 211 - (v-ymin)/(ymax-ymin)*180;
    const label = v => Math.abs(v)>=10000 || (Math.abs(v)>0 && Math.abs(v)<.1) ? v.toExponential(1) : v.toFixed(0);
    let grid="";
    for (let i=0;i<5;i++) {
      const vx=xmin+(xmax-xmin)*i/4, vy=ymin+(ymax-ymin)*i/4;
      grid+=`<line x1="59" x2="424" y1="${y(vy)}" y2="${y(vy)}" stroke="#e7ebe4"/><text x="49" y="${y(vy)+3}" text-anchor="end">${label(vy)}</text><text x="${x(vx)}" y="230" text-anchor="middle">${label(vx)}</text>`;
    }
    const poly = points => points.map(p=>`${x(p[0]).toFixed(2)},${y(p[1]).toFixed(2)}`).join(" ");
    const goldMarks = gold.map(p=>`<circle cx="${x(p[0])}" cy="${y(p[1])}" r="3.5" fill="#fffdf8" stroke="#b65f24" stroke-width="1.5"/>`).join("");
    const predMarks = prediction.map(p=>`<circle cx="${x(p[0])}" cy="${y(p[1])}" r="2.1" fill="#0b766b"/>`).join("");
    $("examplePlot").innerHTML=`<svg viewBox="0 0 450 264" role="img" aria-labelledby="plotTitle plotDesc" font-family="system-ui,sans-serif" font-size="9" fill="#65726c"><title id="plotTitle">Gold and extracted Seebeck coefficient for ${esc(model.label)}</title><desc id="plotDesc">D2 normal, question D2_A_01, sample S01. ${gold.length} Gold points and ${prediction.length} extracted points.</desc>${grid}<text x="242" y="253" text-anchor="middle">Temperature (K)</text><text transform="translate(13,125) rotate(-90)" text-anchor="middle">Seebeck coefficient (μV/K)</text><polyline points="${poly(gold)}" fill="none" stroke="#b65f24" stroke-width="1.6" stroke-dasharray="4 4"/>${goldMarks}${prediction.length?`<polyline points="${poly(prediction)}" fill="none" stroke="#0b766b" stroke-width="1.5"/>${predMarks}`:""}</svg>`;
    $("exampleCaption").textContent=`D2 normal · ${gold.length} Gold points · ${prediction.length} extracted points. ${prediction.length ? "One observed curve, not an overall model ranking." : "No usable extracted curve was returned for this sample."}`;
    $("exampleLink").href=curveLink(key,"D2_clean_without",true);
  }

  $("exampleModel").innerHTML=data.models.map(m=>`<option value="${esc(m.key)}">${esc(m.label)}</option>`).join("");
  $("exampleModel").addEventListener("change",renderExample);
  $("condition").addEventListener("change",()=>{ $("resultRows").closest(".result-scroll").scrollTop=0;renderResults(); });
  $("metric").addEventListener("change",renderResults);
  $("modelSearch").addEventListener("input",renderResults);
  $("auditRows").innerHTML=data.coverage.map(r=>{const returned=r.schema_ok+r.output_error;return `<tr${returned<114?' class="partial"':""}><td>${esc(r.model)} ${esc(r.effort)}</td><td>${returned} / 114</td><td>${r.schema_ok}</td><td>${r.output_error}</td><td>${r.api_failed}</td><td>${r.unrequested}</td></tr>`;}).join("");
  renderResults();
  renderExample();
})();

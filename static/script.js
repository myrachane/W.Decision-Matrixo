let criteria = [];
let options = [];
let scores = {};

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

/* ---------- THEME ---------- */
function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
}

(function () {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
})();

/* ---------- DATA ---------- */
function key(o,c){ return o+"_"+c; }

function setScore(o,c,val){
  scores[key(o,c)] = Math.max(0, Math.min(10, +val));
}

/* ---------- FETCH BACKEND ---------- */
async function calculate() {
  if (!criteria.length || !options.length) return;

  const res = await fetch("/calculate", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ criteria, options, scores })
  });

  const data = await res.json();
  renderResults(data);
}

/* ---------- RENDER ---------- */
function renderResults(results) {
  const el = document.getElementById("results-list");

  if (!results.length) {
    el.innerHTML = "No data";
    return;
  }

  el.innerHTML = results.map((r,i)=>`
    <div class="result-row ${i===0 ? 'first':''}">
      <span>${i+1}</span>
      <span>${r.name}</span>
      <div style="flex:1;height:5px;background:var(--surface2);border-radius:3px;">
        <div style="width:${r.score*10}%;height:100%;background:var(--accent);"></div>
      </div>
      <span>${r.score}</span>
      ${i===0 ? '<span class="top-badge">Winner</span>' : ''}
    </div>
  `).join("");
}

/* IMPORTANT: reuse your original render/add/delete functions */
/* just call calculate() after score updates */


let criteria = [];
let options = [];
let scores = {};

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function addCriterion() {
  const name = document.getElementById("critName").value;
  const weight = parseInt(document.getElementById("critWeight").value);

  if (!name || isNaN(weight)) return;

  criteria.push({ id: uid(), name, weight });
  render();
}

function addOption() {
  const name = document.getElementById("optName").value;
  if (!name) return;

  options.push({ id: uid(), name });
  render();
}

function render() {
  document.getElementById("criteria").innerHTML =
    criteria.map(c => `${c.name} (${c.weight})`).join("<br>");

  document.getElementById("options").innerHTML =
    options.map(o => o.name).join("<br>");

  renderScores();
}

function renderScores() {
  let html = "";

  options.forEach(o => {
    html += `<div>${o.name}: `;
    criteria.forEach(c => {
      const key = `${o.id}_${c.id}`;
      html += `
        <input type="number" min="0" max="10"
        value="${scores[key] || 5}"
        onchange="scores['${key}']=parseInt(this.value)">
      `;
    });
    html += "</div>";
  });

  document.getElementById("scores").innerHTML = html;
}

async function calculate() {
  const res = await fetch("/calculate", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ criteria, options, scores })
  });

  const data = await res.json();

  document.getElementById("results").innerHTML =
    data.map((r,i)=>`${i+1}. ${r.name} (${r.score})`).join("<br>");
}

const $ = id => document.getElementById(id);
let cur = '0', prev = '', op = '', fresh = true;

function fmt(n) {
  const s = String(n);
  if (s.length > 12) return parseFloat(n).toPrecision(10);
  return s;
}

function update() {
  $('result').textContent = cur;
  $('expr').textContent = prev && op ? `${prev} ${({'/':'÷','*':'×','-':'−','+':'+'})[op]} ` : '';
}

function inputDigit(d) {
  if (fresh) { cur = d === '.' ? '0.' : d; fresh = false; }
  else if (d === '.' && cur.includes('.')) return;
  else if (cur === '0' && d !== '.') cur = d;
  else cur += d;
  update();
}

function doOp(next) {
  if (prev && op && !fresh) {
    const r = eval(`${prev}${op}${cur}`);
    cur = fmt(isFinite(r) ? r : 'Error');
    prev = cur;
  } else {
    prev = cur;
  }
  op = next;
  fresh = true;
  update();
}

function doEq() {
  if (!prev || !op) return;
  const r = eval(`${prev}${op}${cur}`);
  cur = fmt(isFinite(r) ? r : 'Error');
  $('expr').textContent = '';
  prev = ''; op = '';
  fresh = true;
  update();
}

document.querySelector('.buttons').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  if (!action) { inputDigit(btn.dataset.val); return; }
  if (action === 'clear') { cur = '0'; prev = ''; op = ''; fresh = true; update(); }
  else if (action === 'sign') { cur = fmt(-parseFloat(cur)); update(); }
  else if (action === 'percent') { cur = fmt(parseFloat(cur) / 100); update(); }
  else if (action === 'op') doOp(btn.dataset.val);
  else if (action === 'eq') doEq();
});

document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9' || e.key === '.') inputDigit(e.key);
  else if ('+-*/'.includes(e.key)) doOp(e.key);
  else if (e.key === 'Enter' || e.key === '=') doEq();
  else if (e.key === 'Escape') { cur = '0'; prev = ''; op = ''; fresh = true; update(); }
  else if (e.key === '%') { cur = fmt(parseFloat(cur) / 100); update(); }
});

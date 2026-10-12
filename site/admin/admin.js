const STATUS_LABELS = { new: 'جدید', contacted: 'تماس گرفته شد', scheduled: 'نوبت داده شد', closed: 'بسته شد' };
const SESSION_LABELS = { 'in-person': 'حضوری', online: 'آنلاین' };
const TIME_LABELS = { any: 'فرقی نمی‌کند', morning: 'صبح', afternoon: 'بعدازظهر', evening: 'عصر' };

const rowsEl = document.getElementById('rows');
const emptyEl = document.getElementById('empty');
const statsEl = document.getElementById('stats');
const filtersEl = document.getElementById('status-filters');

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' });
const faNumber = (n) => n.toLocaleString('fa-IR');

const API = `${window.CLINIC_API_URL}/api/admin/requests`;
const AUTH_KEY = 'del-asa-admin-auth';

let therapists = {};
let requests = [];
let activeStatus = '';

function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  for (const child of [].concat(children)) if (child != null) node.append(child);
  return node;
}

function renderStats() {
  const counts = Object.fromEntries(Object.keys(STATUS_LABELS).map((s) => [s, 0]));
  requests.forEach((r) => counts[r.status]++);
  statsEl.replaceChildren(
    el('div', { className: 'stat' }, [el('strong', { textContent: faNumber(requests.length) }), el('span', { textContent: 'کل درخواست‌ها' })]),
    ...Object.entries(STATUS_LABELS).map(([s, label]) =>
      el('div', { className: 'stat' }, [el('strong', { textContent: faNumber(counts[s]) }), el('span', { textContent: label })]),
    ),
  );
}

function renderFilters() {
  const options = [['', 'همه'], ...Object.entries(STATUS_LABELS)];
  filtersEl.replaceChildren(
    ...options.map(([value, label]) => {
      const chip = el('button', { type: 'button', className: 'chip', textContent: label });
      chip.setAttribute('aria-pressed', String(value === activeStatus));
      chip.addEventListener('click', () => {
        activeStatus = value;
        renderFilters();
        renderRows();
      });
      return chip;
    }),
  );
}

function statusSelect(request) {
  const select = el(
    'select',
    { ariaLabel: 'وضعیت' },
    Object.entries(STATUS_LABELS).map(([value, label]) => el('option', { value, textContent: label, selected: value === request.status })),
  );
  select.addEventListener('change', async () => {
    const previous = request.status;
    select.disabled = true;
    try {
      const res = await api(`?id=${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: select.value }),
      });
      if (!res.ok) throw new Error();
      request.status = select.value;
      renderStats();
      renderRows();
    } catch {
      select.value = previous;
      alert('تغییر وضعیت ممکن نشد.');
    } finally {
      select.disabled = false;
    }
  });
  return select;
}

function renderRows() {
  const visible = activeStatus ? requests.filter((r) => r.status === activeStatus) : requests;
  emptyEl.hidden = visible.length > 0;
  rowsEl.replaceChildren(
    ...visible.map((r) => {
      const row = el('tr', {}, [
        el('td', { className: 'nowrap', textContent: dateFormat.format(new Date(r.created_at)) }),
        el('td', { textContent: r.name }),
        el('td', { className: 'nowrap' }, el('a', { href: `tel:${r.phone}`, textContent: r.phone, dir: 'ltr' })),
        el('td', { textContent: therapists[r.therapist_id] || '—' }),
        el('td', { textContent: SESSION_LABELS[r.session_type] || r.session_type }),
        el('td', { textContent: TIME_LABELS[r.preferred_time] || r.preferred_time }),
        el('td', { className: 'message', textContent: r.message || '' }),
        el('td', {}, statusSelect(r)),
      ]);
      row.dataset.status = r.status;
      return row;
    }),
  );
}

// ---------- Auth & loading ----------

const loginForm = document.getElementById('login');
const loginError = document.getElementById('login-error');
const dashboard = document.getElementById('dashboard');
const actions = document.getElementById('admin-actions');

function getAuth() {
  try {
    return sessionStorage.getItem(AUTH_KEY);
  } catch {
    return null;
  }
}

function setAuth(value) {
  try {
    if (value) sessionStorage.setItem(AUTH_KEY, value);
    else sessionStorage.removeItem(AUTH_KEY);
  } catch {
    // Storage unavailable (private mode): the session just won't survive a reload.
  }
  authHeader = value;
}

let authHeader = getAuth();

function api(path = '', options = {}) {
  return fetch(API + path, { ...options, headers: { ...options.headers, Authorization: authHeader || '' } });
}

function showLogin(message = '') {
  setAuth(null);
  loginError.textContent = message;
  loginForm.hidden = false;
  dashboard.hidden = true;
  actions.hidden = true;
  document.getElementById('password').focus();
}

async function load() {
  if (!authHeader) return showLogin();

  let reqRes;
  try {
    reqRes = await api();
  } catch {
    return showLogin('ارتباط با سرور برقرار نشد.');
  }
  if (reqRes.status === 401) return showLogin('نام کاربری یا رمز عبور اشتباه است.');
  if (!reqRes.ok) return showLogin('دریافت درخواست‌ها ممکن نشد.');

  requests = await reqRes.json();
  const therapistRes = await fetch('../therapists.json').catch(() => null);
  if (therapistRes?.ok) {
    therapists = Object.fromEntries((await therapistRes.json()).map((t) => [t.id, t.name]));
  }

  loginForm.hidden = true;
  dashboard.hidden = false;
  actions.hidden = false;
  renderStats();
  renderFilters();
  renderRows();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('user').value.trim();
  const password = document.getElementById('password').value;
  const bytes = new TextEncoder().encode(`${user}:${password}`);
  setAuth('Basic ' + btoa(String.fromCharCode(...bytes)));
  loginForm.reset();
  document.getElementById('user').value = user;
  load();
});

document.getElementById('logout').addEventListener('click', () => showLogin());
document.getElementById('refresh').addEventListener('click', load);
load();

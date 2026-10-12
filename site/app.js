const SESSION_LABELS = { 'in-person': 'حضوری', online: 'آنلاین' };

const form = document.getElementById('request-form');
const therapistSelect = document.getElementById('therapistId');
const therapistList = document.getElementById('therapist-list');
const filtersEl = document.getElementById('therapist-filters');

// ---------- Mobile navigation ----------

const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ---------- Therapists ----------

function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  for (const child of [].concat(children)) {
    if (child != null) node.append(child);
  }
  return node;
}

function initials(name) {
  return name
    .replace(/^دکتر\s+/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('‌');
}

function therapistCard(t) {
  const avatar = t.photo
    ? el('img', { className: 'avatar', src: t.photo, alt: '', width: 64, height: 64, loading: 'lazy' })
    : el('div', { className: 'avatar', textContent: initials(t.name), ariaHidden: 'true' });

  const details = el('dl');
  const addDetail = (label, value) => {
    if (value) details.append(el('dt', { textContent: label }), el('dd', { textContent: value }));
  };
  addDetail('مدرک:', t.degree);
  addDetail('نوع جلسه:', (t.sessionTypes || []).map((s) => SESSION_LABELS[s]).join('، '));
  addDetail('روزهای حضور:', t.days);
  addDetail('شماره نظام:', t.license);

  const button = el('button', { type: 'button', className: 'btn btn-ghost', textContent: 'درخواست نوبت' });
  button.addEventListener('click', () => selectTherapist(t));

  return el('article', { className: 'card therapist' }, [
    el('div', { className: 'therapist-head' }, [
      avatar,
      el('div', {}, [el('h3', { textContent: t.name }), el('div', { className: 'role', textContent: t.title })]),
    ]),
    el('ul', { className: 'tags' }, (t.specialties || []).map((s) => el('li', { textContent: s }))),
    el('p', { className: 'bio', textContent: t.bio }),
    details,
    button,
  ]);
}

function selectTherapist(t) {
  therapistSelect.value = t.id;
  // Pick a session type the therapist actually offers.
  if (t.sessionTypes?.length === 1) {
    form.querySelector(`input[name="sessionType"][value="${t.sessionTypes[0]}"]`).checked = true;
  }
  document.getElementById('request').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 500);
}

function renderTherapists(therapists, specialty) {
  const visible = specialty ? therapists.filter((t) => t.specialties?.includes(specialty)) : therapists;
  therapistList.replaceChildren(...visible.map(therapistCard));
}

function renderFilters(therapists) {
  const specialties = [...new Set(therapists.flatMap((t) => t.specialties || []))];
  if (specialties.length < 2) return;

  const chips = [{ label: 'همه', value: '' }, ...specialties.map((s) => ({ label: s, value: s }))].map(({ label, value }) => {
    const chip = el('button', { type: 'button', className: 'chip', textContent: label });
    chip.setAttribute('aria-pressed', String(value === ''));
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      renderTherapists(therapists, value);
    });
    return chip;
  });
  filtersEl.replaceChildren(...chips);
}

async function loadTherapists() {
  try {
    const res = await fetch('therapists.json');
    if (!res.ok) throw new Error(res.statusText);
    const therapists = await res.json();

    renderFilters(therapists);
    renderTherapists(therapists);
    for (const t of therapists) {
      therapistSelect.append(el('option', { value: t.id, textContent: `${t.name} — ${t.title}` }));
    }
  } catch {
    therapistList.replaceChildren(el('p', { className: 'muted', textContent: 'بارگذاری فهرست درمانگران ممکن نشد. لطفاً صفحه را دوباره بارگذاری کنید.' }));
  }
}

loadTherapists();

// ---------- Gentle fade-in on scroll ----------

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -60px 0px' },
  );
  document.querySelectorAll('.section-head, .services, .filters, .steps, .request-wrap').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ---------- Request form ----------

const statusEl = document.getElementById('form-status');

function setFieldError(name, message) {
  const errorEl = form.querySelector(`[data-error-for="${name}"]`);
  if (!errorEl) return;
  errorEl.textContent = message || '';
  errorEl.closest('.field').classList.toggle('invalid', Boolean(message));
}

function clearErrors() {
  form.querySelectorAll('[data-error-for]').forEach((e) => setFieldError(e.dataset.errorFor, ''));
  statusEl.textContent = '';
  statusEl.className = 'form-status';
}

function toLatinDigits(str) {
  return str.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

function validate(data) {
  const errors = {};
  if (data.name.length < 2) errors.name = 'لطفاً نام خود را وارد کنید.';
  const phone = toLatinDigits(data.phone).replace(/[\s\-()]/g, '').replace(/^(\+98|0098)/, '0');
  if (!/^0\d{10}$/.test(phone)) errors.phone = 'شماره تماس معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹';
  if (!data.consent) errors.consent = 'برای ثبت درخواست، تأیید این گزینه لازم است.';
  return errors;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const fd = new FormData(form);
  const data = {
    name: (fd.get('name') || '').trim(),
    phone: (fd.get('phone') || '').trim(),
    therapistId: fd.get('therapistId') || '',
    sessionType: fd.get('sessionType'),
    preferredTime: fd.get('preferredTime'),
    message: (fd.get('message') || '').trim(),
    consent: fd.get('consent') === 'on',
    website: fd.get('website') || '',
  };

  const errors = validate(data);
  if (Object.keys(errors).length) {
    Object.entries(errors).forEach(([k, v]) => setFieldError(k, v));
    form.querySelector('.field.invalid input, .field.invalid select')?.focus();
    return;
  }

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'در حال ارسال…';

  try {
    const res = await fetch(`${window.CLINIC_API_URL}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));

    if (res.ok) {
      showSuccess(data.name);
      return;
    }
    if (body.errors) {
      Object.entries(body.errors).forEach(([k, v]) => setFieldError(k, v));
    } else {
      statusEl.textContent = body.error || 'ثبت درخواست ممکن نشد. لطفاً دوباره تلاش کنید.';
      statusEl.classList.add('error');
    }
  } catch {
    statusEl.textContent = 'ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.';
    statusEl.classList.add('error');
  } finally {
    submit.disabled = false;
    submit.textContent = 'ثبت درخواست';
  }
});

function showSuccess(name) {
  const again = el('button', { type: 'button', className: 'btn btn-ghost', textContent: 'ثبت درخواست دیگر' });
  const success = el('div', { className: 'card form-success', role: 'status' }, [
    el('div', { className: 'check', textContent: '✓', ariaHidden: 'true' }),
    el('h3', { textContent: `${name} عزیز، درخواست شما ثبت شد` }),
    el('p', { className: 'muted', textContent: 'همکاران ما به‌زودی برای هماهنگی زمان جلسه با شما تماس می‌گیرند.' }),
    again,
  ]);
  again.addEventListener('click', () => {
    form.reset();
    success.replaceWith(form);
    form.querySelector('#name').focus();
  });
  form.replaceWith(success);
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

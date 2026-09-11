const KEY = 'dibs-member-demo';

export function isMemberDemo() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setMemberDemo() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* ignore */
  }
}

export function clearMemberDemo() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

function syncGates() {
  const loggedIn = isMemberDemo();
  document.querySelectorAll<HTMLAnchorElement>('[data-member-gate]').forEach((link) => {
    const loginHref = link.dataset.loginHref;
    const profileHref = link.dataset.profileHref;
    if (loggedIn && profileHref) {
      link.href = profileHref;
      link.dataset.i18n = 'nav.profile';
    } else if (loginHref) {
      link.href = loginHref;
      link.dataset.i18n = 'nav.login';
    }
  });
}

export function initMemberDemo() {
  syncGates();

  document.querySelectorAll<HTMLFormElement>('[data-member-login]').forEach((form) => {
    if (form.dataset.ready === '1') return;
    form.dataset.ready = '1';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      setMemberDemo();
      const next = form.dataset.next;
      if (next) window.location.assign(next);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-member-skip]').forEach((el) => {
    if (el.dataset.ready === '1') return;
    el.dataset.ready = '1';
    el.addEventListener('click', () => setMemberDemo());
  });

  document.querySelectorAll<HTMLElement>('[data-member-logout]').forEach((el) => {
    if (el.dataset.ready === '1') return;
    el.dataset.ready = '1';
    el.addEventListener('click', (event) => {
      event.preventDefault();
      clearMemberDemo();
      const next = el.dataset.next;
      if (next) window.location.assign(next);
    });
  });

  document.querySelectorAll<HTMLFormElement>('[data-member-add]').forEach((form) => {
    if (form.dataset.ready === '1') return;
    form.dataset.ready = '1';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const note = form.querySelector<HTMLElement>('[data-member-add-note]');
      if (note) note.hidden = false;
    });
  });

  document.querySelectorAll<HTMLFormElement>('[data-apply-form]').forEach((form) => {
    if (form.dataset.ready === '1') return;
    form.dataset.ready = '1';
    form.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-add-person]')) {
        const stack = form.querySelector('[data-people]');
        const first = stack?.querySelector<HTMLElement>('[data-person]');
        if (!stack || !first) return;
        const clone = first.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('input').forEach((input) => {
          input.value = '';
        });
        stack.append(clone);
        return;
      }
      const remove = target.closest('[data-remove-person]');
      if (!remove) return;
      const person = remove.closest<HTMLElement>('[data-person]');
      const stack = form.querySelector('[data-people]');
      const count = stack?.querySelectorAll('[data-person]').length ?? 0;
      if (!person || !stack) return;
      if (count <= 1) {
        person.querySelectorAll('input').forEach((input) => {
          input.value = '';
        });
        return;
      }
      person.remove();
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const next = form.dataset.next;
      if (next) window.location.assign(next);
    });
  });

  document.querySelectorAll<HTMLFormElement>('[data-pay-form]').forEach((form) => {
    if (form.dataset.ready === '1') return;
    form.dataset.ready = '1';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const note = form.querySelector<HTMLElement>('[data-pay-done]');
      if (note) note.hidden = false;
    });
  });
}

import { feeForAge, kr } from '../data/site';

export function initFeeCalc() {
  const root = document.querySelector<HTMLElement>('[data-fee-calc]');
  if (!root || root.dataset.ready === '1') return;
  root.dataset.ready = '1';

  const form = root.querySelector<HTMLFormElement>('[data-fee-form]');
  const list = root.querySelector<HTMLUListElement>('[data-fee-list]');
  const totalEl = root.querySelector<HTMLElement>('[data-fee-total]');
  if (!form || !list || !totalEl) return;

  const people: { id: string; age: number; fee: number }[] = [];

  const render = () => {
    list.innerHTML = '';
    people.forEach((person) => {
      const li = document.createElement('li');
      li.innerHTML = `<span></span><span></span><button type="button" class="btn btn--ghost" style="padding:0.25rem 0.7rem"></button>`;
      li.querySelectorAll('span')[0].textContent = `${person.age} år`;
      li.querySelectorAll('span')[1].textContent = kr(person.fee);
      const btn = li.querySelector('button')!;
      btn.textContent = 'Fjern';
      btn.addEventListener('click', () => {
        const idx = people.findIndex((p) => p.id === person.id);
        if (idx >= 0) people.splice(idx, 1);
        render();
      });
      list.append(li);
    });
    const total = people.reduce((sum, person) => sum + person.fee, 0);
    totalEl.textContent = kr(total);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector<HTMLInputElement>('[name="age"]');
    const age = Number(input?.value);
    if (!Number.isFinite(age) || age < 0 || age > 120) return;
    people.push({ id: `${Date.now()}-${people.length}`, age, fee: feeForAge(age) });
    if (input) input.value = '';
    render();
  });

  render();
}

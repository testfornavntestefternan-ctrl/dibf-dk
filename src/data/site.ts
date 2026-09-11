import { withBase } from '../lib/paths';

export { withBase } from '../lib/paths';

export const site = {
  name: 'DIBS',
  shortName: 'Mit DIBS',
  fullName: 'Dansk Islamisk Begravelsesfondens Støtteforening',
  tagline: 'Økonomisk og åndelig støtte, når en muslimsk familie mister en af deres.',
  description:
    'DIBS er støtteforeningen, der hjælper medlemmer med begravelsesudgifter op til 30.000 kr. og støtter islamiske gravpladser i Danmark.',
  url: 'https://mitdibf.dk',
  lang: 'da',
};

export const contact = {
  address: ['Brøndbyøstervej 180', '2605 Brøndby'],
  cvr: '29598827',
  web: 'www.mitdibf.dk',
  emails: {
    medlem: 'medlem@mitdibf.dk',
    info: 'info@mitdibf.dk',
    finans: 'finans@mitdibf.dk',
    bestyrelse: 'Bestyrelse@mitdibf.dk',
  },
};

export const nav = [
  { href: '/', label: 'Mit DIBS', i18n: 'nav.home' },
  { href: '/medlemskab', label: 'Medlemskab', i18n: 'nav.terms' },
  { href: '/bestyrelse', label: 'Bestyrelse', i18n: 'nav.board' },
  { href: '/vedtaegter', label: 'Vedtægter', i18n: 'nav.statutes' },
  { href: '/regnskaber', label: 'Regnskaber', i18n: 'nav.finance' },
  { href: '/kontakt', label: 'Kontakt', i18n: 'nav.contact' },
];

export const purposes = [
  'at støtte oprettelse, indretning og drift af islamiske begravelsespladser i Danmark',
  'at støtte muslimske formål',
  'at yde tilskud, der nedbringer omkostningerne ved dødsfald i muslimske familier',
  'at forestå andre aktiviteter, der har samme formål',
  'at sikre medlemmer et beløb til hel eller delvis dækning af udgifterne ved begravelse, og derved sikre efterladte mindst mulig økonomisk byrde',
];

export const feeBands = [
  { min: 0, max: 5, amount: 500, label: '0 – 5' },
  { min: 6, max: 10, amount: 1000, label: '6 – 10' },
  { min: 11, max: 15, amount: 1500, label: '11 – 15' },
  { min: 16, max: 20, amount: 2000, label: '16 – 20' },
  { min: 21, max: 25, amount: 2500, label: '21 – 25' },
  { min: 26, max: 30, amount: 3000, label: '26 – 30' },
  { min: 31, max: 35, amount: 3500, label: '31 – 35' },
  { min: 36, max: 40, amount: 4000, label: '36 – 40' },
  { min: 41, max: 45, amount: 4500, label: '41 – 45' },
  { min: 46, max: 50, amount: 5000, label: '46 – 50' },
  { min: 51, max: 60, amount: 10000, label: '51 – 60' },
  { min: 61, max: 70, amount: 20000, label: '61 – 70' },
  { min: 71, max: 120, amount: 25000, label: 'Over 70' },
];

export const board = [
  { name: 'Atiq Durani', role: 'Bestyrelsesformand', roleKey: 'role.chair' },
  { name: 'Fahed Jabbar', role: 'Næstformand', roleKey: 'role.vice' },
  { name: 'Said Jaber', role: 'Bestyrelsesmedlem', roleKey: 'role.member' },
  { name: 'Nabil El-Awad', role: 'Bestyrelsesmedlem', roleKey: 'role.member' },
  { name: 'Bassem Hassan', role: 'Bestyrelsesmedlem', roleKey: 'role.member' },
  { name: 'Yahya Mohamad Mansour', role: 'Suppleant', roleKey: 'role.deputy' },
  { name: 'Maher Hachach', role: 'Suppleant', roleKey: 'role.deputy' },
];

export const reports = [
  { year: '2025', kind: 'Årsrapport', title: 'Årsrapport 2025', href: withBase('/docs/DIBSRegnskab2025.pdf') },
  { year: '2024', kind: 'Årsrapport', title: 'Årsrapport 2024', href: withBase('/docs/DIBSRegnskab2024.pdf') },
  { year: '2023', kind: 'Årsrapport', title: 'Årsrapport 2023', href: withBase('/docs/DIBSRegnskab2023.pdf') },
  { year: '2022', kind: 'Årsrapport', title: 'Årsrapport 2022 (udkast)', href: withBase('/docs/udkastRegnskab2022.pdf') },
  { year: '2022', kind: 'Referat', title: 'Generalforsamling — referat 2022', href: withBase('/docs/Ref2022.pdf') },
  { year: '2021', kind: 'Årsrapport', title: 'Årsrapport 2021', href: withBase('/docs/Dibsaarsrapport2021.pdf') },
  { year: '2021', kind: 'Referat', title: 'Generalforsamling — referat 2021', href: withBase('/docs/gf2021.pdf') },
  { year: '2020', kind: 'Årsrapport', title: 'Årsrapport 2020', href: withBase('/docs/Dibsregnskab2020.pdf') },
  { year: '2020', kind: 'Referat', title: 'Generalforsamling 2020', href: withBase('/docs/dibsgf2020.pdf') },
  { year: '2020–21', kind: 'Indsamling', title: 'Indsamlingsregnskab 2020–2021', href: withBase('/docs/INDSAMLINGSREGNSKAB.pdf') },
  { year: '2020–21', kind: 'Revision', title: 'Revisionserklæring indsamling 2020–21', href: withBase('/docs/Revisionserklaering2020.pdf') },
];

export const docs = {
  agm: withBase('/docs/DIBSGF2026.pdf'),
  statutes: withBase('/docs/DIBSVedtaegter2026.pdf'),
};

export const agm = {
  title: 'Generalforsamling 2026',
  when: 'Søndag den 6. september 2026 kl. 14:00–16:00',
  where: 'Bibliotekvej 68, 1., 2650 Hvidovre',
};

export function kr(amount: number) {
  return `${amount.toLocaleString('da-DK')} kr.`;
}

export function feeForAge(age: number) {
  const band = feeBands.find((item) => age >= item.min && age <= item.max);
  return band?.amount ?? feeBands[feeBands.length - 1].amount;
}

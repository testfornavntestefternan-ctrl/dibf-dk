/** Shared site content — edit this file to update copy, nav, and contact. */

import { withBase } from '../lib/paths';

export { withBase } from '../lib/paths';

export const site = {
  name: 'DIBF',
  fullName: 'Dansk Islamisk Begravelsesfond',
  tagline: 'Den første muslimske gravplads i Danmark — et sted for værdighed, ro og fællesskab.',
  description:
    'Dansk Islamisk Begravelsesfond ejer og driver den muslimske gravplads i Brøndby. Her finder du vejledning til pårørende, bedemænd og gravstedsejere.',
  url: 'https://dibf.dk',
  lang: 'da',
};

export const contact = {
  address: ['Brøndbyøstervej 180', '2605 Brøndby'],
  phone: '+45 42 42 51 44',
  phoneHref: 'tel:+4542425144',
  hours: 'Mandag – fredag 08:00–12:00',
  emails: {
    drift: 'drift@dibf.dk',
    bestyrelse: 'bestyrelse@dibf.dk',
    forslag: 'forslag-klager@dibf.dk',
    bestilling: 'bestilling@dibf.dk',
  },
  cvr: '28492235',
  web: 'www.dibf.dk',
};

export const nav = [
  { href: '/om-os', label: 'Om os', i18n: 'nav.about' },
  { href: '/gravspladsen', label: 'Gravpladsen', i18n: 'nav.cemetery' },
  { href: '/ved-dodsfald', label: 'Ved dødsfald', i18n: 'nav.death' },
  { href: '/for-bedemaend', label: 'For bedemænd', i18n: 'nav.undertaker' },
  { href: '/kontakt', label: 'Kontakt', i18n: 'nav.contact' },
];

export const paths = [
  {
    href: withBase('/ved-dodsfald'),
    kicker: 'Pårørende',
    title: 'Ved dødsfald',
    text: 'Hvad I skal gøre, gravtyper, priser og DIBS-medlemskab.',
    accent: 'amber',
    i18n: 'path.family',
  },
  {
    href: withBase('/gravspladsen'),
    kicker: 'Besøg',
    title: 'Gravpladsen',
    text: 'Ordensregler, dua, kort og billeder fra Brøndby.',
    accent: 'teal',
    i18n: 'path.visit',
  },
  {
    href: withBase('/for-bedemaend'),
    kicker: 'Professionelle',
    title: 'For bedemænd',
    text: 'Bestilling, prisliste og ansvarsfordeling.',
    accent: 'aurora',
    i18n: 'path.pro',
  },
] as const;

export const graves = [
  {
    slug: 'voksne',
    title: 'Voksengrav',
    kicker: 'Fredning 30 år',
    excerpt:
      'Voksengrav med 30 års fredning. Gravsten, kantsten og vedligeholdelse følger gravpladsens regler.',
    image: withBase('/images/voksne.jpg'),
    href: withBase('/ved-dodsfald#voksne'),
    accent: 'amber',
    i18n: 'grave.adult',
  },
  {
    slug: 'fostre',
    title: 'Fostergrav',
    kicker: 'Fredning 5 år',
    excerpt:
      'Et stille sted for de mindste. Fostergrave har 5 års fredning og egne rammer for sten og kant.',
    image: withBase('/images/fostre.jpg'),
    href: withBase('/ved-dodsfald#fostre'),
    accent: 'teal',
    i18n: 'grave.fetus',
  },
  {
    slug: 'born',
    title: 'Børnegrav',
    kicker: 'Fredning 30 år',
    excerpt:
      'Børnegrave (max. 1 m) med 30 års fredning og tilpassede mål for gravsten og kantsten.',
    image: withBase('/images/born.jpg'),
    href: withBase('/ved-dodsfald#born'),
    accent: 'aurora',
    i18n: 'grave.child',
  },
] as const;

export const board = [
  { name: 'Vedat Aslan', role: 'Formand', roleKey: 'role.formand' },
  { name: 'Ghulam Mohiuddin', role: 'Næstformand', roleKey: 'role.naestformand' },
  { name: 'Hamza Moustafa', role: 'Bestyrelsesmedlem', roleKey: 'role.medlem' },
  { name: 'Ateeque Durani', role: 'Bestyrelsesmedlem', roleKey: 'role.medlem' },
  { name: 'Muhammad Akhtar', role: 'Bestyrelsesmedlem (sekretær)', roleKey: 'role.sekretaer' },
  { name: 'Said Mohamed Said', role: 'Suppleant', roleKey: 'role.suppleant' },
  { name: 'Rafed Naimi', role: 'Suppleant', roleKey: 'role.suppleant' },
  { name: 'Baha El Said', role: 'Suppleant', roleKey: 'role.suppleant' },
];

export const founders: { name: string; address: string; cvr?: string; note?: string }[] = [
  { name: 'Nørrebro Kultur & Aktivitets Center (Al Taiba Moske)', address: 'Titangade 15, 2200 København N', cvr: '34555680' },
  { name: 'Dansk Islamisk Trossamfund', address: 'Bibliotekvej 6, 2650 Hvidovre', cvr: '31658802' },
  { name: 'København Islamisk Menighed', address: 'Valdemarsgade 17, 1665 København V', cvr: '32493491' },
  { name: 'Brøndby Ungdoms og Kultur forening', address: 'Tjørnevangen 7, 2660 Brøndby Strand' },
  { name: 'Helsingør Ungdoms og Kultur forening', address: 'Sporegangen 5 st. th., 3000 Helsingør' },
  { name: 'Vejle Islamisk Menighed', address: 'Nørremark Center 2, 7100 Vejle', cvr: '31653029' },
  { name: 'Århus Islamisk Menighed', address: 'Nørre Allé 34, 1. sal, 8000 Aarhus C', cvr: '31559162' },
  { name: 'Det Islamiske Trossamfund i Danmark', address: 'Dortheavej 45, 2400 København NV', cvr: '19307646' },
  { name: 'Center for Skandinavisk Akademisk studier', address: 'Dortheavej 45, 2400 København NV' },
  { name: 'Den Islamiske Socialrådgivning', address: 'Dortheavej 45, 2400 København NV' },
  { name: 'Muslimsk ungdom i Danmark (MUNIDA)', address: 'Dortheavej 43, 2400 København NV', cvr: '34628726' },
  { name: 'Humanistisk Aktiviteters gruppe', address: 'Dortheavej 45, 2400 København NV' },
  { name: 'Den Islamisk forening', address: 'Sankt Hans Gade 25, 2200 København N', note: 'Ophørt' },
  { name: 'Den muslimske Spejderforening', address: 'Dortheavej 43, 2400 København NV' },
  { name: 'Won (Widow, Orphan, Needy)', address: 'P.O. Box 2614, 2100 København Ø' },
  { name: 'Islamisk Kultur Center', address: 'Horsebakken 2, 2400 København NV', cvr: '31337119' },
  { name: 'Dansk Islamisk Råd', address: 'Vingelodden 1A, 2200 København N', cvr: '27834655' },
  { name: 'Minhaj-Ul-Quran International Danmark', address: 'Bispevej 25, 2400 København NV', cvr: '30259963' },
  { name: 'Immigrant Welfare Society', address: 'Valhøjvej 15, baghus, 2500 Valby' },
  { name: 'Imam Malik institut', address: 'Gl. Køge Landevej 113, 2500 Valby', cvr: '32921264' },
  { name: 'Islamisk Cultural Institute', address: 'Torveporten 8, 2500 Valby' },
  { name: 'Muslim Cultural Institute', address: 'Amerikavej 19, 1756 København V', cvr: '16023191' },
  { name: 'Somalisk Ungdom – kultur forening', address: 'Nordre Fasanvej 186b, st. th., 2000 Frederiksberg C' },
  { name: 'Muslimernes Landsorganisation (MLO)', address: 'Blågårdsgade 30, 2200 København N' },
];

export const prices = {
  year: 2024,
  rows: [
    { label: 'Gravsted (fredning: voksen/børn 30 år, foster 5 år)', i18n: 'price.plot', adult: '9.500 kr.', child: '5.500 kr.', fetus: '3.250 kr.' },
    { label: 'Gravning og dækning', i18n: 'price.digging', adult: '6.800 kr.', child: '2.000 kr.', fetus: '1.500 kr.' },
    { label: 'Administration, information og vejledning', i18n: 'price.admin', adult: '2.200 kr.', child: '2.000 kr.', fetus: '1.000 kr.' },
    { label: 'Weekend- og helligdagstillæg', i18n: 'price.weekend', adult: '4.000 kr.', child: '2.000 kr.', fetus: '1.000 kr.' },
    { label: 'Kantsten (sættes efter mindst 2 år, inkl. moms)', i18n: 'price.curb', adult: '5.750 kr.', child: '2.750 kr.', fetus: '0 kr.' },
    { label: 'Trækantsten (foreløbig, inkl. moms)', i18n: 'price.wood', adult: '750 kr.', child: '500 kr.', fetus: '0 kr.' },
    { label: 'I alt at betale (inkl. moms)', i18n: 'price.total', adult: '25.000 kr.', child: '12.750 kr.', fetus: '5.750 kr.' },
  ],
  extra: 'Træindramning i graven: 1.000 kr. (inkl. moms).',
};

export const gallery = [
  { src: withBase('/images/kort.png'), alt: 'Kort over gravpladsen i Brøndby' },
  { src: withBase('/images/port.jpg'), alt: 'Indgangen til gravpladsen' },
  { src: withBase('/images/bgravu2.jpg'), alt: 'Gravpladsen set fra oven' },
  { src: withBase('/images/b1.jpg'), alt: 'Gravpladsen i Brøndby' },
  { src: withBase('/images/b2.jpg'), alt: 'Stier og grave' },
  { src: withBase('/images/b3.jpg'), alt: 'Gravsteder' },
  { src: withBase('/images/b4.jpg'), alt: 'Gravpladsens område' },
  { src: withBase('/images/b5.jpg'), alt: 'Udsigt over gravpladsen' },
  { src: withBase('/images/b6.jpg'), alt: 'Beplantning og grave' },
  { src: withBase('/images/b7.jpg'), alt: 'Gravpladsens landskab' },
  { src: withBase('/images/grave.png'), alt: 'Oversigt over grave' },
];

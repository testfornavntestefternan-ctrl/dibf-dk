"""Build DIBS PDFs with the same visual language as the website."""

from __future__ import annotations

import shutil
import subprocess
import time
import urllib.request
from pathlib import Path

ROOT = Path(r"D:\Site\DIBF\site")
DOCS = ROOT / "public" / "docs"
BRAND = Path(__file__).resolve().parent
FONTS = BRAND / "fonts"
ORIGINALS = BRAND / "originals"
TMP = BRAND / "tmp"
PUBLIC = ROOT / "public"
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")

FONT_FILES = {
    "CormorantGaramond.ttf": "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "SourceSans3-Regular.ttf": "https://github.com/adobe-fonts/source-sans/raw/release/TTF/SourceSans3-Regular.ttf",
    "SourceSans3-Semibold.ttf": "https://github.com/adobe-fonts/source-sans/raw/release/TTF/SourceSans3-Semibold.ttf",
}

KHATAM = """
<svg class="ornament" viewBox="0 0 32 32" aria-hidden="true">
  <g fill="none" stroke="#e8d5a3" stroke-width="1.2">
    <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)"/>
    <rect x="8" y="8" width="16" height="16"/>
  </g>
</svg>
"""


def ensure_fonts() -> None:
    FONTS.mkdir(exist_ok=True)
    for name, url in FONT_FILES.items():
        dest = FONTS / name
        if dest.exists() and dest.stat().st_size > 1000:
            continue
        print(f"download font {name}")
        urllib.request.urlretrieve(url, dest)


def backup_originals() -> None:
    ORIGINALS.mkdir(exist_ok=True)
    for pdf in DOCS.glob("*.pdf"):
        target = ORIGINALS / pdf.name
        if not target.exists():
            shutil.copy2(pdf, target)


def wrap(title: str, kicker: str, lede: str, body: str, *, cover: bool = False) -> str:
    logo = (PUBLIC / "images" / "logo.svg").as_uri()
    zellij = (PUBLIC / "images" / "patterns" / "zellij.jpg").as_uri()
    css_href = (BRAND / "theme.css").as_uri()
    header_class = "header header--cover" if cover else "header"
    heading = f"<h1>{title}</h1>" if cover else f"<p style='margin:6px 0 0;color:#e8d5a3;font-size:15px'>{title}</p>"
    extra = ""
    if cover:
        extra = f'<p class="lede">{lede}</p>{KHATAM}<p class="cover-extra">CVR 29598827 · Brøndbyøstervej 180, 2605 Brøndby · mitdibf.dk</p>'
    inner = "" if cover else f'<div class="content">{body}</div>'
    return f"""<!DOCTYPE html>
<html lang="da" class="{'cover' if cover else 'doc'}">
<head>
  <meta charset="utf-8"/>
  <title>{title}</title>
  <link rel="stylesheet" href="{css_href}"/>
  <style>:root {{ --zellij: url("{zellij}"); }}</style>
</head>
<body class="{'cover' if cover else 'doc'}">
  <table class="chrome">
    <thead>
      <tr><td>
        <div class="{header_class}">
          <div class="brand-row">
            <img class="logo" src="{logo}" alt="DIBS"/>
            <span>
              <span class="brand-name">DIBS</span>
              <span class="brand-sub">Støtteforeningen</span>
            </span>
          </div>
          <p class="kicker">{kicker}</p>
          {heading}
          {extra}
        </div>
        <div class="gold-line"></div>
      </td></tr>
    </thead>
    <tbody>
      <tr><td>{inner}</td></tr>
    </tbody>
    <tfoot>
      <tr><td>
        <div class="gold-line"></div>
        <div class="footer">
          <span>Dansk Islamisk Begravelsesfondens Støtteforening · CVR 29598827</span>
          <span>Brøndbyøstervej 180, 2605 Brøndby · mitdibf.dk</span>
        </div>
      </td></tr>
    </tfoot>
  </table>
</body>
</html>
"""


def print_html(html: str, dest: Path) -> None:
    TMP.mkdir(exist_ok=True)
    src = TMP / (dest.stem + ".html")
    src.write_text(html, encoding="utf-8")
    dest.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        str(EDGE),
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--no-first-run",
        f"--print-to-pdf={dest}",
        src.as_uri(),
    ]
    print(f"print {dest.name}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        raise SystemExit(f"Edge failed for {dest.name}")
    time.sleep(0.3)
    if not dest.exists() or dest.stat().st_size < 1000:
        raise SystemExit(f"PDF was not created: {dest}")


def prepend_cover(cover_pdf: Path, original: Path, dest: Path) -> None:
    import fitz

    out = fitz.open(cover_pdf)
    src = fitz.open(original)
    out.insert_pdf(src)
    tmp = dest.with_suffix(".tmp.pdf")
    out.save(tmp)
    out.close()
    src.close()
    tmp.replace(dest)


VEDTAEGTER = """
<p class="muted">Endeligt vedtaget 19. august 2026 · i kraft 20. august 2026 · erstatter de hidtil gældende vedtægter.</p>

<div class="section"><h2>§ 1 Navn og hjemsted</h2>
<p><strong>1.1.</strong> Foreningens navn er Dansk Islamisk Begravelsesfondens Støtteforening (DIBS).</p>
<p><strong>1.2.</strong> Foreningen har hjemsted i Brøndby Kommune.</p></div>

<div class="section"><h2>§ 2 Formål</h2>
<p><strong>2.1.</strong> Foreningens formål er, at</p>
<ul>
<li>yde tilskud med henblik på at nedbringe de omkostninger, der er forbundet med dødsfald og begravelse blandt herboende muslimer,</li>
<li>medvirke til at begrænse den økonomiske byrde for medlemmerne og deres efterladte familier i forbindelse med dødsfald og begravelse,</li>
<li>forestå eller formidle praktiske foranstaltninger i forbindelse med begravelse, herunder bistand med de administrative og praktiske forhold, der følger af et dødsfald, og</li>
<li>varetage andre aktiviteter, der understøtter eller er naturligt forbundet med foreningens formål.</li>
</ul></div>

<div class="section"><h2>§ 3 Kapital</h2>
<p><strong>3.1.</strong> Foreningens midler tilvejebringes gennem kontingentindbetalinger, donationer, gaver, indsamlinger, arv, testamentariske bidrag, tilskud og andre former for økonomiske bidrag.</p>
<p><strong>3.2.</strong> Foreningens midler må alene anvendes til fremme af foreningens formål, jf. § 2. Foreningens midler kan ikke udloddes til medlemmerne eller andre private personer, medmindre udlodningen sker som led i varetagelsen af foreningens formål.</p></div>

<div class="section"><h2>§ 4 Hæftelse</h2>
<p><strong>4.1.</strong> Foreningen hæfter alene for sine forpligtelser med sin til enhver tid værende formue. Der påhviler ikke medlemmerne eller bestyrelsesmedlemmerne personlig hæftelse for foreningens forpligtelser.</p></div>

<div class="section"><h2>§ 5 Generalforsamlingen</h2>
<p><strong>5.1.</strong> Den ordinære generalforsamling afholdes én gang årligt.</p>
<p><strong>5.2.</strong> Retten til at deltage i og afgive stemme på generalforsamlingen er forbeholdt medlemmer, der har været medlem og betalt forfaldent kontingent i mindst 12 sammenhængende måneder umiddelbart forud for generalforsamlingen.</p>
<p><strong>5.3.</strong> Generalforsamlingen træffer beslutning med simpelt stemmeflertal, medmindre andet følger af disse vedtægter. Hvert stemmeberettiget medlem har én stemme.</p>
<p><strong>5.4.</strong> Der kan ikke stemmes ved fuldmagt.</p>
<p><strong>5.5.</strong> Generalforsamlingen indkaldes med mindst 5 ugers varsel.</p>
<p><strong>5.6.</strong> Forslag, der ønskes behandlet på generalforsamlingen, skal være bestyrelsen skriftligt i hænde senest 3 uger før generalforsamlingens afholdelse.</p>
<p><strong>5.7.</strong> Generalforsamlingen er beslutningsdygtig, når mindst 150 stemmeberettigede medlemmer er til stede. Såfremt generalforsamlingen ikke er beslutningsdygtig, indkalder bestyrelsen til en ny generalforsamling med mindst 14 dages varsel. Den nye generalforsamling er beslutningsdygtig uanset antallet af fremmødte stemmeberettigede medlemmer.</p>
<p><strong>5.8.</strong> På den ordinære generalforsamling behandles følgende:</p>
<ol type="a">
<li>Valg af dirigent og referent.</li>
<li>Bestyrelsens årsberetning.</li>
<li>Fremlæggelse og godkendelse af det reviderede årsregnskab.</li>
<li>Godkendelse af budget.</li>
<li>Indkomne forslag.</li>
<li>Valg af bestyrelsesmedlemmer, der er på valg, jf. § 7.4 og § 7.5.</li>
<li>Valg af 2 suppleanter, jf. § 7.2.</li>
<li>Valg af intern revisor.</li>
<li>Eventuelt.</li>
</ol>
<p><strong>5.9.</strong> Bestyrelsen kan beslutte, at en generalforsamling helt eller delvist afholdes elektronisk, såfremt dette kan ske på betryggende vis og i overensstemmelse med gældende lovgivning.</p>
<p><strong>5.10.</strong> Der føres protokol over generalforsamlingens beslutninger. Protokollen underskrives af dirigenten og opbevares af foreningen i mindst 5 år.</p>
<p><strong>5.11.</strong> Ekstraordinær generalforsamling kan indkaldes af bestyrelsen efter behov og skal indkaldes, når mindst 1/3 af de stemmeberettigede medlemmer skriftligt fremsætter krav herom. Begæringen skal indeholde en begrundelse samt angive de forslag, der ønskes behandlet. Den ekstraordinære generalforsamling skal afholdes senest 6 uger efter, at bestyrelsen har modtaget begæringen, og indkaldes med mindst 14 dages varsel. § 5.2–5.4, 5.7, 5.9 og 5.10 finder tilsvarende anvendelse.</p></div>

<div class="section"><h2>§ 6 Foreningens medlemmer</h2>
<p><strong>6.1.</strong> Enhver person, der er muslim, bosiddende i Danmark og har et dansk CPR-nummer, kan optages som medlem af foreningen. Det er en betingelse for medlemskab, at medlemmet til enhver tid under medlemskabet har et dansk CPR-nummer. Medlemskab forudsætter betaling af et engangsbeløb, hvis størrelse fastsættes af bestyrelsen, samt løbende betaling af det kontingent, som ligeledes fastsættes af bestyrelsen. For personer, der er konverteret til islam (revertitter), kan bestyrelsen kræve dokumentation for tilhørsforholdet til den muslimske trosretning. Dokumentation skal, hvor det er relevant, være udstedt af en anerkendt islamisk institution eller anden af bestyrelsen godkendt myndighed eller organisation.</p>
<p><strong>6.2.</strong> Alle medlemmer skal godkendes af bestyrelsen i henhold til § 6.1. Et afslag på medlemskab skal ikke begrundes, men kan indbringes for den førstkommende ordinære generalforsamling.</p>
<p><strong>6.3.</strong> Oplysninger, som bestyrelsen modtager om foreningens medlemmer, behandles fortroligt og må ikke gives videre til tredjemand uden medlemmets skriftligt samtykke, medmindre videregivelsen følger af lovgivningen eller sker efter pålæg fra en offentlig myndighed.</p>
<p><strong>6.4.</strong> Bestyrelsen kan beslutte at ekskludere et medlem, hvis medlemmet misligholder sit medlemskab, modarbejder foreningens interesser eller formål eller i øvrigt handler på en måde, der er uforenelig med foreningens formål. Beslutningen træffes af bestyrelsen og meddeles medlemmet skriftligt. Medlemmet kan indbringe beslutningen for den førstkommende ordinære generalforsamling.</p>
<p><strong>6.5.</strong> Ved udmeldelse eller eksklusion af foreningen har medlemmet ikke krav på tilbagebetaling af allerede indbetalt engangsbeløb eller kontingent.</p>
<p><strong>6.6.</strong> Personer under 18 år kan være medlemmer af foreningen, men har ikke stemmeret på generalforsamlingen og er ikke valgbare til bestyrelsen eller andre tillidsposter i foreningen. Stemmeret og valgbarhed indtræder ved det fyldte 18. år.</p></div>

<div class="section"><h2>§ 7 Bestyrelsen</h2>
<p><strong>7.1.</strong> Bestyrelsen varetager foreningens daglige ledelse og har til opgave at varetage foreningens interesser bedst muligt i overensstemmelse med vedtægterne og generalforsamlingens beslutninger. Bestyrelsen konstituerer sig selv.</p>
<p><strong>7.2.</strong> Bestyrelsen består af 5 medlemmer og 2 suppleanter. Suppleanterne kan inviteres til at deltage i bestyrelsesmøder, men har ikke stemmeret.</p>
<p><strong>7.3.</strong> Bestyrelsesmedlemmer og suppleanter vælges af generalforsamlingen.</p>
<p><strong>7.4.</strong> Bestyrelsens medlemmer vælges for en periode på 4 år ad gangen. Genvalg kan finde sted.</p>
<p><strong>7.5.</strong> Suppleanter vælges for en periode på 2 år ad gangen. Genvalg kan finde sted.</p>
<p><strong>7.6.</strong> Udtræder et bestyrelsesmedlem inden udløbet af sin valgperiode, indtræder en suppleant i det pågældende medlems sted for den resterende del af valgperioden. Såfremt der ikke er en suppleant til rådighed, kan bestyrelsen udpege et nyt medlem, som fungerer indtil førstkommende generalforsamling, hvor valg til den ledige plads foretages.</p>
<p><strong>7.7.</strong> Bestyrelsen konstituerer sig selv med formand, næstformand, kasserer og sekretær. Konstitueringen finder sted umiddelbart efter den ordinære generalforsamling.</p>
<p><strong>7.8.</strong> Bestyrelsen fastsætter selv sin forretningsorden.</p>
<p><strong>7.9.</strong> Bestyrelsen er beslutningsdygtig, når mindst 4 medlemmer er til stede.</p>
<p><strong>7.10.</strong> Bestyrelsens beslutninger træffes ved simpelt stemmeflertal. Ved stemmelighed er formandens stemme afgørende.</p>
<p><strong>7.11.</strong> Foreningen tegnes af formanden i forening med ét bestyrelsesmedlem. Ved formandens forfald udøves tegningsretten af næstformanden i forening med ét bestyrelsesmedlem.</p>
<p><strong>7.12.</strong> Bestyrelsen kan ansætte personale til varetagelse af administrative og praktiske opgaver, herunder medlemsbetjening.</p>
<p><strong>7.13.</strong> Bestyrelsen skal så vidt muligt sammensættes af personer uden nære familiemæssige relationer til hinanden. Bestyrelsesmedlemmer må desuden ikke have væsentlige personlige eller erhvervsmæssige interesser, der kan give anledning til interessekonflikter med foreningens virksomhed.</p>
<p><strong>7.14.</strong> Der føres beslutningsreferat over bestyrelsesmøderne, som underskrives af de tilstedeværende bestyrelsesmedlemmer. Referaterne opbevares i mindst 5 år.</p></div>

<div class="section"><h2>§ 8 Regnskab og budget</h2>
<p><strong>8.1.</strong> Foreningens regnskabsår følger kalenderåret. Regnskabet for det foregående regnskabsår forelægges til godkendelse på den ordinære generalforsamling.</p>
<p><strong>8.2.</strong> Bestyrelsen påser, at der føres et nøjagtigt og fyldestgørende regnskab, som giver et retvisende billede af foreningens økonomiske forhold.</p>
<p><strong>8.3.</strong> Regnskabet udarbejdes i overensstemmelse med gældende lovgivning og god regnskabsskik af en af bestyrelsen udpeget bogholder/revisor.</p></div>

<div class="section"><h2>§ 9 Ændringer af vedtægter og opløsning</h2>
<p><strong>9.1.</strong> Vedtagelse af vedtægtsændringer kræver, at mindst 1/3 af de stemmeberettigede medlemmer er til stede på generalforsamlingen, og at mindst 2/3 af de afgivne stemmer er for forslaget.</p>
<p><strong>9.2.</strong> Er generalforsamlingen ikke beslutningsdygtig efter § 9.1, kan bestyrelsen med mindst 3 ugers varsel indkalde til en ny generalforsamling, hvor forslaget kan vedtages med 2/3 af de afgivne stemmer uanset antallet af fremmødte stemmeberettigede medlemmer.</p>
<p><strong>9.3.</strong> Beslutning om opløsning af foreningen kræver, at mindst 3/4 af samtlige stemmeberettigede medlemmer stemmer for forslaget.</p>
<p><strong>9.4.</strong> Opnås det i § 9.3 nævnte flertal ikke, men stemmer mindst 2/3 af de fremmødte stemmeberettigede medlemmer for opløsning, skal bestyrelsen indkalde til en ny ekstraordinær generalforsamling med mindst 3 ugers varsel. På denne generalforsamling kan opløsning vedtages med mindst 3/4 af de afgivne stemmer uanset antallet af stemmeberettigede medlemmer.</p>
<p><strong>9.5.</strong> I tilfælde af foreningens opløsning skal foreningens formue overføres til Dansk Islamisk Begravelsesfond (DIBF), CVR 28492235. Såfremt Dansk Islamisk Begravelsesfond ikke eksisterer på tidspunktet for foreningens opløsning, skal formuen overføres til en anden muslimsk begravelsesforening, menighed eller forening med et almennyttigt formål, hvis formål er beslægtet med foreningens formål.</p></div>

<div class="section"><h2>§ 10 Ikrafttræden</h2>
<p><strong>10.1.</strong> Disse vedtægter er endeligt vedtaget d. 19. august 2026 og træder i kraft d. 20. august 2026 med virkning fra samme dag.</p>
<p><strong>10.2.</strong> Vedtægterne erstatter de hidtil gældende vedtægter.</p></div>
"""

GF2026 = """
<div class="card">
  <p class="kicker" style="color:#8a6a32">Indkaldelse</p>
  <p>Kære medlem af Dansk Islamisk Begravelsesfondens Støtteforening (DIBS).</p>
  <p>Hermed indkaldes De til generalforsamling i DIBS, som finder sted:</p>
  <dl class="meta" style="grid-template-columns:1fr">
    <div><dt>Tid</dt><dd>Søndag den 6. september 2026 kl. 14:00–16:00</dd></div>
    <div><dt>Sted</dt><dd>Bibliotekvej 68, 1., 2650 Hvidovre</dd></div>
  </dl>
  <p>Forslag, der ønskes behandlet på generalforsamlingen, skal indsendes skriftligt til bestyrelsen på <strong>medlem@mitdibf.dk</strong> senest 3 uger før generalforsamlingen.</p>
</div>
<div class="section">
  <h2>Dagsorden</h2>
  <ol class="agenda">
    <li><span class="num">1</span><span>Valg af en dirigent samt en referent</span></li>
    <li><span class="num">2</span><span>Bestyrelsens beretning forelægges til orientering</span></li>
    <li><span class="num">3</span><span>Regnskabet for det foregående år forelægges til orientering</span></li>
    <li><span class="num">4</span><span>Budgetforslag for næstkommende år forelægges til orientering</span></li>
    <li><span class="num">5</span><span>Indkomne forslag</span></li>
    <li><span class="num">6</span><span>Valg af bestyrelsesmedlemmer jvf. § 7.3 (eventuelt, valg hver 4. år)</span></li>
    <li><span class="num">7</span><span>Valg af suppleanter for de valgte medlemmer jvf. § 7.2</span></li>
    <li><span class="num">8</span><span>Eventuelt</span></li>
  </ol>
</div>
<p>På vegne af DIBS<br>DIBS-kontor, Brøndbyøstervej 180, 2605 Brøndby<br>medlem@mitdibf.dk</p>
"""

GF2020 = """
<div class="card">
  <p>Eftersom vi stod i corona-krisen og skulle følge myndighedernes retningslinjer, blev den ordinære generalforsamling holdt som onlineopkald.</p>
  <dl class="meta">
    <div><dt>Dato</dt><dd>19. april 2020 kl. 15:00–17:00</dd></div>
    <div><dt>Deltagere</dt><dd>20 (heraf 14 på mobilen)</dd></div>
    <div><dt>Dirigent</dt><dd>Kasem Ahmad Said</dd></div>
    <div><dt>Referent</dt><dd>Ahmed Macine</dd></div>
  </dl>
  <p class="muted">Deltagere nævnt i referatet: Ahmed Macine, Jamal Hazouri, Kasem Said Ahmad, Mohammed Beiroumi, Youssef Al Haj.</p>
</div>
<div class="section"><h2>Dagsorden</h2>
<ol>
<li>Valg af dirigent og referent</li>
<li>Bestyrelsens beretning forelægges til orientering</li>
<li>Regnskabet for det foregående år forelægges til orientering</li>
<li>Budgetforslag for næstkommende år forelægges til orientering</li>
<li>Indkomne forslag</li>
<li>Valg af intern revisor</li>
<li>Eventuelle spørgsmål og henvendelser</li>
</ol>
<p>Da det ikke var muligt at træffe større beslutninger i onlineopkaldet, gennemgik forsamlingen beretning og forelæggelse af regnskab.</p></div>
<div class="section"><h2>Beretning — 2019</h2>
<ul>
<li>Kontoret på Dortheavej er lukket. Henvendelser sker til kontoret på gravpladsen. Telefonnummeret beholdes.</li>
<li>Der er ansat en kontormedhjælper mandag–fredag kl. 10:00–13:00.</li>
<li>COWI bruges som revisionsfirma fra 2019.</li>
<li>Aktive medlemsfamilier pr. 15. april 2020: 2.767 familier · 10.096 medlemmer i alt.</li>
<li>Slettede familier: 605 · slettede medlemmer: 1.668.</li>
<li>36 medlemsbegravelser dækket i 2019 · 967.226 kr. udbetalt.</li>
<li>Bestyrelsen har besluttet, at begravelseshjælp fra Udbetaling Danmark skal støtte familien og ikke foreningen.</li>
<li>Medlemskontingent for 2020 steget fra 100 til 150 kr. på grund af begravelsesomkostninger.</li>
<li>DIBS arbejder på et internetbaseret medlemsprogram, hvor medlemmer selv kan ændre oplysninger.</li>
</ul></div>
<div class="section"><h2>Spørgsmål</h2>
<p><strong>Ekstra toiletter på gravpladsen.</strong> Bestyrelsen arbejder på grund til en ny gravplads. Henvendelsen viderestilles til fonden, som ejer gravpladsen.</p>
<p><strong>Årsregnskab.</strong> Mohammed Beiroumi fremlagde årsregnskabet for 2019. Årsregnskabet for 2018 vil blive lagt på hjemmesiden.</p>
<p><strong>Kontakt.</strong> Oplysninger findes på hjemmesiden: telefon og mail til kontoret.</p></div>
<p>Referent: Ahmed Macine · Dirigent: Kasem Said Ahmad</p>
"""

REF2022 = """
<div class="card">
  <dl class="meta">
    <div><dt>Første møde</dt><dd>København den 14. maj 2022 kl. 14:00</dd></div>
    <div><dt>Anden del</dt><dd>Søndag den 12. juni 2022 · ca. 60–70 deltagere</dd></div>
    <div><dt>Dirigent</dt><dd>Abu Yusef Al-Awadi</dd></div>
    <div><dt>Referent</dt><dd>Ahmed Macine</dd></div>
  </dl>
  <p>Dagsorden blev godkendt.</p>
</div>
<div class="section"><h2>Formandsberetning</h2>
<p>Formand Mohammed Beiroumi redegjorde for opdatering af DIBS-hjemmesiden og medlemsstyring — et arbejde på over 1.000 timer. Medlemmer kan nu tilføje et barn til medlemskabet. Systemet kan sende SMS og opkrævninger til e-Boks.</p>
<p>Formanden skelnede mellem fonden, som ejer gravpladsen og står for den daglige drift, og DIBS, som er støtteforeningen for medlemmerne. Bachir Nazmi, formand for Dansk Islamisk Begravelsesfond, bekræftede skelnen. Vedtægterne ændres og godkendes af bestyrelsen i DIBS.</p>
<p><strong>Statistik fremlagt af Abu Chadi:</strong> 10.699 aktive medlemmer · 43 døde medlemmer.</p>
<p>Medlemmer foreslog flere hænder — én eller to medarbejdere til de opgaver, der venter.</p>
<p>Tidligere referater for de sidste to år ligger på hjemmesiden (svar fra Abu Chadi).</p></div>
<div class="section"><h2>Årsregnskab og budget</h2>
<p>Abu Chadi fremlagde årsregnskabet, som også er lagt på hjemmesiden. Der var fejl, blandt andet en stigning i porto fra 0 kr. til 19.000 kr. samt fejl i balancen. Årsregnskabet blev ikke godkendt. Bestyrelse og revisor holder møde for at rette fejlene. Formanden erkendte fejlene. Næste årsregnskab fremlægges af revisoren. Budget 2022 blev fremlagt; bestyrelsen godkender og tilpasser det.</p></div>
<div class="section"><h2>Indkomne forslag og valg</h2>
<p>Der var ingen indkomne forslag.</p>
<p>Fem pladser på valg: tre menige bestyrelsesmedlemmer og to suppleanter. Stemmer:</p>
<table class="figures">
  <thead><tr><th>Navn</th><th>Stemmer</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Hafsa Khan</td><td>51</td><td>Bestyrelse</td></tr>
    <tr><td>Nouman Mostaq</td><td>48</td><td>Bestyrelse</td></tr>
    <tr><td>Humeira Soheil</td><td>45</td><td>Bestyrelse</td></tr>
    <tr><td>Saadia Soheil</td><td>42</td><td>Suppleant</td></tr>
    <tr><td>Nabil Al Awadi</td><td>24</td><td>Suppleant</td></tr>
    <tr><td>Mohamed Yahya Mansour</td><td>21</td><td></td></tr>
    <tr><td>Mohammad Saraj</td><td>18</td><td></td></tr>
  </tbody>
</table>
</div>
<p>Med venlig hilsen<br>Ahmed Macine</p>
"""

INDSAMLING = """
<p class="muted">Typesat udgave af det indberettede indsamlingsregnskab. Tal er uændrede. Den underskrevne blanket følger efter omslaget i arkivet, hvor den findes.</p>
<dl class="meta">
  <div><dt>Indsamlingsnævnet</dt><dd>j.nr. 29-700-02410</dd></div>
  <div><dt>Periode</dt><dd>1. juni 2020 – 31. maj 2021</dd></div>
  <div><dt>Indsamler</dt><dd>Dansk Islamisk Begravelsesfondens Støtteforening</dd></div>
  <div><dt>Formål</dt><dd>Begravelsesudgifter</dd></div>
</dl>
<table class="figures">
  <thead><tr><th>Post</th><th>Beløb</th></tr></thead>
  <tbody>
    <tr><td>Indkomne bidrag</td><td>63.106,00 kr.</td></tr>
    <tr><td>Administrationsudgifter</td><td>20.301,25 kr.</td></tr>
    <tr><td class="muted">heraf bankgebyr</td><td>301,25 kr.</td></tr>
    <tr><td><strong>Indsamlingens overskud</strong></td><td><strong>42.904,75 kr.</strong></td></tr>
    <tr><td>Anvendt til begravelsesudgifter</td><td>43.000,00 kr.</td></tr>
    <tr><td>Resterende overskud</td><td>0,00 kr.</td></tr>
  </tbody>
</table>
<p>Undertegnede erklærer, at indsamlingen er foretaget i overensstemmelse med indsamlingsloven og indsamlingsbekendtgørelsen. Denne side er en læsevenlig opsætning af de indberettede tal — ikke en ny underskrift.</p>
"""

WRAPS = [
    ("DIBSRegnskab2025.pdf", "Årsrapport 2025", "Regnskab", "Officielt årsregnskab med ledelsespåtegning. De følgende sider er den underskrevne rapport."),
    ("DIBSRegnskab2024.pdf", "Årsrapport 2024", "Regnskab", "Officielt årsregnskab med ledelsespåtegning. De følgende sider er den underskrevne rapport."),
    ("DIBSRegnskab2023.pdf", "Årsrapport 2023", "Regnskab", "Officielt årsregnskab med ledelsespåtegning. De følgende sider er den underskrevne rapport."),
    ("udkastRegnskab2022.pdf", "Årsrapport 2022", "Udkast · 17. regnskabsår", "Udkast til årsrapport. De følgende sider er dokumentet som indsendt."),
    ("Dibsaarsrapport2021.pdf", "Årsrapport 2021", "16. regnskabsår · Crowe", "Årsrapport opstillet af Crowe. De følgende sider er den underskrevne rapport."),
    ("Dibsregnskab2020.pdf", "Årsrapport 2020", "Regnskab", "Årsrapport. De følgende sider er kildedokumentet."),
    ("gf2021.pdf", "Generalforsamling 2021", "Referat", "Referat. De følgende sider er kildedokumentet."),
    ("Revisionserklaering2020.pdf", "Revisionserklæring 2020–21", "Indsamling", "Revisionserklæring for indsamlingen. De følgende sider er den underskrevne erklæring."),
]


def main() -> None:
    ensure_fonts()
    backup_originals()
    TMP.mkdir(exist_ok=True)

    typed = [
        ("DIBSVedtaegter2026.pdf", "Vedtægter", "Gældende fra 20. august 2026", "Dansk Islamisk Begravelsesfondens Støtteforening · CVR 29598827", VEDTAEGTER),
        ("DIBSGF2026.pdf", "Generalforsamling 2026", "Indkaldelse", "Søndag den 6. september 2026 · Hvidovre", GF2026),
        ("dibsgf2020.pdf", "Generalforsamling 2020", "Referat · online", "19. april 2020", GF2020),
        ("Ref2022.pdf", "Generalforsamling 2022", "Referat", "14. maj og 12. juni 2022", REF2022),
        ("INDSAMLINGSREGNSKAB.pdf", "Indsamlingsregnskab 2020–2021", "Indsamlingsnævnet", "j.nr. 29-700-02410", INDSAMLING),
    ]

    for filename, title, kicker, lede, body in typed:
        html = wrap(title, kicker, lede, body, cover=False)
        print_html(html, DOCS / filename)
        if filename == "INDSAMLINGSREGNSKAB.pdf":
            original = ORIGINALS / filename
            if original.exists():
                prepend_cover(DOCS / filename, original, DOCS / filename)
                print("appended original collection form")

    for filename, title, kicker, lede in WRAPS:
        original = ORIGINALS / filename
        if not original.exists():
            original = DOCS / filename
        cover_html = wrap(title, kicker, lede, "", cover=True)
        cover_pdf = TMP / f"cover-{filename}"
        print_html(cover_html, cover_pdf)
        prepend_cover(cover_pdf, original, DOCS / filename)
        print(f"wrapped {filename}")

    print("done")


if __name__ == "__main__":
    main()

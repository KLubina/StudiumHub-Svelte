<script lang="ts">
  // Definiere die Callback-Funktion aus Svelte 5 Runes / Props
  let { onSelectProgram } = $props<{ onSelectProgram: (key: string) => void }>();

  // Strukturiertes Daten-Array aller Studiengänge, um redundanten HTML-Code zu vermeiden
  const categories = [
    {
      title: "0. Favoriten",
      programs: [
        { key: "fhnw-cs-assessment", title: "BSc Informatik - Nur Assessment", inst: "FHNW" },
        { key: "fhnw-eit", title: "BSc Elektro- und Informationstechnik", inst: "FHNW" },
        { key: "fhnw-wirtschaftsinformatik", title: "BSc Wirtschaftsinformatik", inst: "FHNW" },
        { key: "fhzh-cs-tz", title: "BSc Informatik (Teilzeit)", inst: "ZHAW" },
        { key: "fhzh-elektrotechnik", title: "BSc Elektrotechnik", inst: "ZHAW" },
        { key: "zhaw-win-bis-tz", title: "Wirtschaftsinformatik", inst: "ZHAW" },
        { key: "zhaw-betriebsoekonomie", title: "BSc Betriebsökonomie", inst: "ZHAW" },
        { key: "zhaw-physio", title: "BSc Physiotherapie", inst: "ZHAW" }
      ]
    },
    {
      title: "1. Informatik Teilzeit",
      programs: [
        { key: "ffhs-informatik", title: "BSc Informatik - Teilzeit", inst: "FFHS" },
        { key: "ost-cs-assessment", title: "BSc Informatik - Teilzeit - Assessment", inst: "OST" },
        { key: "fhbern-cs-tz", title: "BSc Informatik - Teilzeit - Assessment", inst: "BFH" },
        { key: "hslu-cs-tz", title: "BSc Informatik - Teilzeit - Assessment", inst: "HSLU" },
        { key: "fhgr-aise", title: "BSc Artificial Intelligence in Software Engineering - Teilzeit", inst: "FH Graubünden" }
      ]
    },
    {
      title: "1. Informatik",
      programs: [
        { key: "fernuni-hagen-cs", title: "BSc Informatik (Vollzeit)", inst: "FernUni Hagen" },
        { key: "eth-cse", title: "BSc Rechnergestützte Wissenschaften", inst: "ETH Zürich" },
        { key: "eth-cs", title: "BSc Informatik", inst: "ETH Zürich" },
        { key: "fhzh-cs", title: "BSc Informatik (Vollzeit)", inst: "ZHAW" },
        { key: "zhaw-data-science", title: "Data Science", inst: "ZHAW" },
        { key: "fhzh-medizininformatik", title: "Medizininformatik", inst: "ZHAW" },
        { key: "ost-cs", title: "BSc Informatik", inst: "OST" },
        { key: "fhgr-cds", title: "BSc Computational and Data Science", inst: "FH Graubünden" },
        { key: "fhbern-cs", title: "BSc Informatik", inst: "BFH" },
        { key: "uzh-informatik", title: "BSc Informatik UZH", inst: "Universität Zürich" },
        { key: "hslu-cs", title: "BSc Informatik", inst: "HS Luzern" },
        { key: "fhnw-cs", title: "BSc Informatik - Vollzeit - Alt", inst: "FHNW" },
        { key: "hssh-it", title: "BSc Information Technology", inst: "HS Schaffhausen" },
        { key: "aspira-ce", title: "BSc Computer Engineering", inst: "Aspira College Split" },
        { key: "fesb-cs-prof", title: "BSc Računarstvo (stručni)", inst: "FESB Split" }
      ]
    },
    {
      title: "1. Elektrotechnik",
      programs: [
        { key: "eth-itet", title: "BSc Elektro- und Informationstechnologie", inst: "ETH Zürich" },
        { key: "fhzh-elektrotechnik", title: "BSc Elektrotechnik", inst: "ZHAW" },
        { key: "fhnw-eit", title: "BSc Elektro- und Informationstechnik", inst: "FHNW" },
        { key: "fesb-eit-uni", title: "BSc Elektrotehnika i informacijska tehnologija", inst: "FESB Split" },
        { key: "eth-msc-itet", title: "MSc Elektro- und Informationstechnologie", inst: "ETH Zürich" },
        { key: "fhbern-eit", title: "BSc Elektrotechnik", inst: "BFH" },
        { key: "fhlu-eit", title: "BSc Elektro- und Informationstechnologie", inst: "HS Luzern" },
        { key: "fhost-eit", title: "BSc Electrical and Computer Engineering", inst: "OST" },
        { key: "fesb-ee-prof", title: "BSc Elektrotehnika (stručni)", inst: "FESB Split" },
        { key: "fesb-cs-uni", title: "BSc Računarstvo (sveučilišni)", inst: "FESB Split" }
      ]
    },
    {
      title: "2. weitere Ingenieurwissenschaften",
      programs: [
        { key: "eth-rig", title: "BSc Raumbezogene Ingenieurwissenschaften", inst: "ETH Zürich" },
        { key: "eth-masch", title: "BSc Maschineningenieurwissenschaften", inst: "ETH Zürich" },
        { key: "eth-matw", title: "BSc Materialwissenschaften", inst: "ETH Zürich" }
      ]
    },
    {
      title: "3. Naturwissenschaften",
      programs: [
        { key: "eth-math", title: "BSc Mathematik", inst: "ETH Zürich" },
        { key: "eth-physik", title: "BSc Physik", inst: "ETH Zürich" },
        { key: "eth-hst", title: "BSc Gesundheitswissenschaften", inst: "ETH Zürich" },
        { key: "eth-lmw", title: "BSc Lebensmittelwissenschaften", inst: "ETH Zürich" },
        { key: "zhaw-food-science", title: "Food Science", inst: "ZHAW" },
        { key: "zhaw-applied-digital-life-sciences", title: "Applied Digital Life Sciences", inst: "ZHAW" }
      ]
    },
    {
      title: "4. Wirtschaftswissenschaften",
      programs: [
        { key: "eth-mtec", title: "MSc MTEC", inst: "ETH Zürich" },
        { key: "unisg-bwl", title: "BWL", inst: "Universität St.Gallen" },
        { key: "uzh-bwl", title: "BSc Betriebswirtschaftslehre UZH", inst: "Universität Zürich" },
        { key: "zhaw-win-bis-tz", title: "Wirtschaftsinformatik", inst: "ZHAW" },
        { key: "zhaw-betriebsoekonomie", title: "BSc Betriebsökonomie", inst: "ZHAW" },
        { key: "fhnw-wirtschaftsinformatik", title: "BSc Wirtschaftsinformatik", inst: "FHNW", customClass: "fhnw" }
      ]
    },
    {
      title: "5. Rechtswissenschaften",
      programs: [
        { key: "uzh-law", title: "Bachelor Rechtswissenschaften", inst: "Universität Zürich" }
      ]
    },
    {
      title: "6. Medizin",
      programs: [
        { key: "uzh-humanmedizin", title: "Bachelor Humanmedizin", inst: "Universität Zürich" },
        { key: "zhaw-physio", title: "BSc Physiotherapie", inst: "ZHAW" },
        { key: "zhaw-ergotherapie", title: "BSc Ergotherapie", inst: "ZHAW" },
        { key: "zhaw-gesundheitsfoerderung", title: "BSc Gesundheitsförderung und Prävention", inst: "ZHAW" }
      ]
    },
    {
      title: "7. Wissenschaften vom Menschen und seiner Kultur",
      programs: [
        { key: "uzh-geschichte", title: "Bachelor Geschichte", inst: "Universität Zürich" },
        { key: "uzh-polisci", title: "Bachelor Politikwissenschaft", inst: "Universität Zürich" },
        { key: "uzh-ethnologie", title: "Bachelor Ethnologie", inst: "Universität Zürich" },
        { key: "uzh-kommunikation", title: "Bachelor Kommunikationswissenschaft", inst: "Universität Zürich" },
        { key: "uzh-pop-kultur", title: "Bachelor Populäre Kulturen", inst: "Universität Zürich" },
        { key: "uzh-soziologie", title: "Bachelor Soziologie", inst: "Universität Zürich" }
      ]
    },
    {
      title: "8. Sportwissenschaften",
      programs: [
        { key: "unibas-sbg", title: "BSc Sport, Bewegung und Gesundheit", inst: "Universität Basel" }
      ]
    }
  ];

  function handleClick(e: MouseEvent, key: string) {
    e.preventDefault();
    onSelectProgram(key);
  }
</script>

<div>
  <h1>Alle Visualisierungen</h1>

  {#each categories as cat}
    <h2 class="category-header">{cat.title}</h2>
    <div class="visualizations-grid">
      {#each cat.programs as prog}
        <a 
          href="?studiengang={prog.key}" 
          onclick={(e) => handleClick(e, prog.key)}
          class="visualization-card {prog.customClass || ''}"
        >
          <div class="visualization-card-title">{prog.title}</div>
          <div class="visualization-card-institution">{prog.inst}</div>
        </a>
      {/each}
    </div>
  {/each}
</div>
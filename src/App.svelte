<script>
  import { onMount } from 'svelte'; // Wichtig: In Svelte 5 heisst es "onMount", nicht "onMounted"!
  import FilterControls from './lib/FilterControls.svelte';
  import StudyContainer from './lib/StudyContainer.svelte';
  import Visualizations from './lib/Visualizations.svelte';

  // HIER DEINE NEUE CSS-ORDNERSTRUKTUR IMPORTIEREN:
  import './css/core/base.css';
  import './css/main.css';
  import './css/components/header.css';
  import './css/components/filters.css';
  import './css/components/sections.css';
  import './css/components/studiengang-card.css';
  import './css/components/visualization-cards.css';
  import './css/components/floating-nav.css';
  import './css/components/utility.css';
  import './css/responsive/responsive.css';

  let allData = $state([]);
  let currentView = $state('institution'); 
  let filters = $state({ type: '', institution: 'group_zurich', category: '' }); 
  let showMinors = $state(false);
  let isLoading = $state(true);

  function normalizeInstitution(raw, type) {
    return {
      name: raw.name,
      website: raw.website,
      type: type,
      categories: (raw.kategorien || []).map(kat => ({
        name: kat.name,
        subcategories: kat.unterkategorien?.map(uk => ({
          name: uk.name,
          programs: uk.studiengaenge?.map(p => ({ ...p, description: p.beschreibung, degree: p.grad })) || []
        })),
        programs: kat.studiengaenge?.map(p => ({ ...p, description: p.beschreibung, degree: p.grad }))
      }))
    };
  }

  // Korrektur zu onMount (Svelte-Standard)
  onMount(async () => {
    const uniFiles = ["universitaet-basel.json", "universitaet-luzern.json", "universitaet-st-gallen.json", "universitaet-bern.json", "universitaet-freiburg.json", "eth-zuerich.json", "universitaet-zuerich.json"];
    const fhFiles = ["berner-fachhochschule.json", "fh-graubuenden.json", "fhnw.json", "ostschweizer-fachhochschule.json", "zhaw.json", "zhdk.json", "hslu.json", "ffhs.json"];

    try {
      // Weil all-swiss-studies-listed im public-Ordner liegt, greifen wir mit einem führenden / darauf zu
      const uniPromises = uniFiles.map(f => fetch(`/all-swiss-studies-listed/uni/${f}`).then(r => r.json()));
      const fhPromises = fhFiles.map(f => fetch(`/all-swiss-studies-listed/fh/${f}`).then(r => r.json()));
      
      const unis = await Promise.all(uniPromises);
      const fhs = await Promise.all(fhPromises);

      allData = [
        ...unis.map(d => normalizeInstitution(d, 'uni')),
        ...fhs.map(d => normalizeInstitution(d, 'fh'))
      ];
    } catch (err) {
      console.error("Fehler beim Laden der JSONs:", err);
    } finally {
      isLoading = false;
    }
  });
</script>

<header>
  <div class="container">
    <h1>StudiumHub</h1>
    <div class="subtitle">
      <a href="https://www.swissuniversities.ch/themen/lehre-studium/akkreditierte-schweizer-hochschulen" target="_blank" rel="noopener noreferrer" style="color: white; font-size: 0.9rem;">
        Alle akkreditierte Schweizer Hochschulen
      </a>
      <br>
      <a href="https://www.berufsberatung.ch/dyn/show/8804" target="_blank" rel="noopener noreferrer" style="color: white; font-size: 0.9rem;">
        Beschäftigungssituation 1 Jahr nach Abschluss
      </a>
    </div>
  </div>
</header>

<div class="container">
  <FilterControls bind:currentView bind:filters bind:showMinors {allData} />

  {#if isLoading}
    <div class="no-results"><p>Lade Studiengänge...</p></div>
  {:else}
    {#if currentView === 'all_visualizations'}
      <Visualizations />
    {:else}
      <StudyContainer {allData} {currentView} {filters} {showMinors} />
    {/if}
  {/if}
</div>
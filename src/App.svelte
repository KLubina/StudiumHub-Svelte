<script>
  import { onMount } from 'svelte';
  import FilterControls from './lib/FilterControls.svelte';
  import StudyContainer from './lib/StudyContainer.svelte';
  import Visualizations from './lib/Visualizations.svelte';
  import SpecificProgramView from './routes/SpecificProgramView.svelte';

  // CSS IMPORTS (Reihenfolge beibehalten)
  import './static/assets/css/core/variables.css';
  import './static/assets/css/core/layout.css';
  import './static/assets/css/core/typography.css';
  import './css/core/base.css';
  import './css/main.css';
  import './css/components/header.css';
  import './css/components/floating-nav.css';
  import './css/components/filters.css';
  import './css/components/sections.css';
  import './css/components/studiengang-card.css';
  import './css/components/visualization-cards.css';
  import './static/assets/css/core/hub-button.css';
  import './static/assets/css/core/legend.css';
  import './static/assets/css/core/module.css';
  import './static/assets/css/optional/color-manager.css';
  import './static/assets/css/optional/indicators.css';
  import './static/assets/css/optional/kp-counter.css';
  import './static/assets/css/optional/major-minor-selector.css';
  import './static/assets/css/optional/module-clickable.css';
  import './static/assets/css/optional/module-lists.css';
  import './static/assets/css/optional/study-links.css';
  import './static/assets/css/optional/tooltip.css';
  import './static/assets/css/optional/wahlmodule.css';
  import './css/components/utility.css';
  import './css/responsive/responsive.css';

  /** @type {any[]} */
  let allData = $state([]);
  let currentView = $state('institution'); 
  let filters = $state({ type: '', institution: 'group_zurich', category: '' }); 
  let showMinors = $state(false);
  let isLoading = $state(true);
  let errorMessage = $state(''); 
  let activeStudiengang = $state('');

  function normalizeInstitution(raw, type) {
    if (!raw) return { name: 'Unbekannt', website: '', type, categories: [] };
    return {
      name: raw.name,
      website: raw.website,
      type: type,
      categories: (raw.kategorien || []).map((/** @type {any} */ kat) => ({
        name: kat.name,
        subcategories: kat.unterkategorien?.map((/** @type {any} */ uk) => ({
          name: uk.name,
          programs: uk.studiengaenge?.map((/** @type {any} */ p) => ({ ...p, description: p.beschreibung, degree: p.grad })) || []
        })) || [],
        programs: kat.studiengaenge?.map((/** @type {any} */ p) => ({ ...p, description: p.beschreibung, degree: p.grad })) || []
      }))
    };
  }

  function openProgram(key) {
    activeStudiengang = key;
    currentView = 'program_view';
    const newUrl = `${window.location.pathname}?studiengang=${key}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  function closeProgram() {
    currentView = 'all_visualizations';
    activeStudiengang = '';
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  onMount(async () => {
    const uniFiles = ["universitaet-basel.json", "universitaet-luzern.json", "universitaet-st-gallen.json", "universitaet-bern.json", "universitaet-freiburg.json", "eth-zuerich.json", "universitaet-zuerich.json"];
    const fhFiles = ["berner-fachhochschule.json", "fh-graubuenden.json", "fhnw.json", "ostschweizer-fachhochschule.json", "zhaw.json", "zhdk.json", "hslu.json", "ffhs.json"];

    try {
      const fetchJson = async (/** @type {string} */ url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
        return res.json();
      };
      const unis = await Promise.all(uniFiles.map(f => fetchJson(`/all-swiss-studies-listed/uni/${f}`)));
      const fhs = await Promise.all(fhFiles.map(f => fetchJson(`/all-swiss-studies-listed/fh/${f}`)));
      allData = [...unis.map(d => normalizeInstitution(d, 'uni')), ...fhs.map(d => normalizeInstitution(d, 'fh'))];
      setTimeout(() => isLoading = false, 50);
    } catch (/** @type {any} */ err) {
      errorMessage = err?.message;
      isLoading = false;
    }
  });
</script>

<div class="main-wrapper">
  {#if isLoading}
    <div class="loading-overlay">Lade Studiengänge...</div>
  {:else if errorMessage}
    <div class="error-banner">{errorMessage}</div>
  {:else}
    
    {#if currentView !== 'program_view'}
      <div class="filter-bar">
        <FilterControls bind:currentView bind:filters bind:showMinors {allData} />
      </div>
    {/if}

    <main class="content-area">
      {#if currentView === 'all_visualizations'}
        <Visualizations onSelectProgram={openProgram} />
      {:else if currentView === 'program_view'}
        <div class="detail-view">
          <button onclick={closeProgram} class="hub-button">← Zurück zum StudiumHub</button>
          <SpecificProgramView key={activeStudiengang} />
        </div>
      {:else}
        <div class="study-list">
          <StudyContainer {allData} {currentView} {filters} {showMinors} />
        </div>
      {/if}
    </main>

  {/if}
</div>

<style>
  /* Diese Stile stellen sicher, dass das Grundlayout die Breite einhält */
  .main-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px; }
  .filter-bar { margin-bottom: 30px; }
  .content-area { display: flex; flex-direction: column; gap: 20px; }
</style>
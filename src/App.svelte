<script>
  import { onMount } from 'svelte';
  import FilterControls from './lib/FilterControls.svelte';
  import StudyContainer from './lib/StudyContainer.svelte';
  import Visualizations from './lib/Visualizations.svelte';
  import SpecificProgramView from './routes/SpecificProgramView.svelte';

  // ==========================================
  // KORRIGIERTE CSS-IMPORTS AUS DEINEM BAUM
  // ==========================================
  
  // 1. Aus dem Ordner: src/css/
  import './css/main.css';
  import './css/core/base.css';
  import './css/components/filters.css';
  import './css/components/floating-nav.css';
  import './css/components/header.css';
  import './css/components/sections.css';
  import './css/components/studiengang-card.css';
  import './css/components/utility.css';
  import './css/components/visualization-cards.css';
  import './css/responsive/responsive.css';

  // 2. Aus dem Ordner: src/static/assets/css/core/
  import './static/assets/css/core/variables.css';
  import './static/assets/css/core/layout.css';
  import './static/assets/css/core/typography.css';
  import './static/assets/css/core/hub-button.css';
  import './static/assets/css/core/legend.css';
  import './static/assets/css/core/module.css';

  // 3. Aus dem Ordner: src/static/assets/css/optional/
  import './static/assets/css/optional/color-manager.css';
  import './static/assets/css/optional/indicators.css';
  import './static/assets/css/optional/kp-counter.css';
  import './static/assets/css/optional/major-minor-selector.css';
  import './static/assets/css/optional/module-clickable.css';
  import './static/assets/css/optional/module-lists.css';
  import './static/assets/css/optional/study-links.css';
  import './static/assets/css/optional/tooltip.css';
  import './static/assets/css/optional/wahlmodule.css';

  // ==========================================
  // STATE MANAGEMENT (Svelte 5)
  // ==========================================
  /** @type {any[]} */
  let allData = $state([]);
  let currentView = $state('institution'); 
  let filters = $state({ type: '', institution: 'group_zurich', category: '' }); 
  let showMinors = $state(false);
  let isLoading = $state(true);
  let errorMessage = $state(''); // Für visuelles Feedback bei Fehlern
  
  let activeStudiengang = $state('');

  /**
   * Normalisiert die Rohdaten einer Institution.
   * @param {any} raw - Die rohen JSON-Daten der Hochschule
   * @param {string} type - Der Typ der Hochschule ('uni' oder 'fh')
   */
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

  /**
   * Öffnet die Visualisierungs-Detailansicht für einen Studiengang.
   * @param {string} key - Der eindeutige Schlüssel des Studiengangs
   */
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
    // Listen entsprechen exakt deinen Dateinamen im public-Verzeichnis
    const uniFiles = [
      "universitaet-basel.json", 
      "universitaet-luzern.json", 
      "universitaet-st-gallen.json", 
      "universitaet-bern.json", 
      "universitaet-freiburg.json", 
      "eth-zuerich.json", 
      "universitaet-zuerich.json"
    ];
    
    const fhFiles = [
      "berner-fachhochschule.json", 
      "fh-graubuenden.json", 
      "fhnw.json", 
      "ostschweizer-fachhochschule.json", 
      "zhaw.json", 
      "zhdk.json", 
      "hslu.json", 
      "ffhs.json"
    ];

    try {
      const fetchJson = async (/** @type {string} */ url) => {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP-Fehler ${res.status} beim Laden von: ${url}`);
        }
        return res.json();
      };

      // Erstelle alle Lade-Anfragen parallel
      const uniPromises = uniFiles.map(f => fetchJson(`/all-swiss-studies-listed/uni/${f}`));
      const fhPromises = fhFiles.map(f => fetchJson(`/all-swiss-studies-listed/fh/${f}`));
      
      const unis = await Promise.all(uniPromises);
      const fhs = await Promise.all(fhPromises);

      // Daten verarbeiten und speichern
      allData = [
        ...unis.map(d => normalizeInstitution(d, 'uni')),
        ...fhs.map(d => normalizeInstitution(d, 'fh'))
      ];

      // Verhindert das vorzeitige Erzwingen des Layouts im Browser
      setTimeout(() => {
        isLoading = false;
      }, 50);

    } catch (/** @type {any} */ err) {
      console.error("Fehler beim Laden der Daten:", err);
      errorMessage = err?.message || "Unbekannter Fehler beim Laden der JSON-Daten.";
      isLoading = false;
    }
  });
</script>

<div class="container">
  {#if isLoading}
    <div class="no-results"><p>Lade Studiengänge...</p></div>
  {:else if errorMessage}
    <div class="no-results" style="color: #d32f2f; border: 2px solid #d32f2f; padding: 20px; margin: 20px; border-radius: 6px; background-color: #ffebee; text-align: left;">
      <h3 style="margin-top: 0;">⚠️ Fehler beim Laden der Daten</h3>
      <p>{errorMessage}</p>
      <p style="font-size: 0.9em; color: #555;">
        Bitte öffne im Browser <strong>F12 -> Netzwerk (Network)</strong> und lade mit F5 neu, um zu sehen, welche Datei blockiert wird.
      </p>
    </div>
  {:else}
    {#if currentView !== 'program_view'}
      <FilterControls bind:currentView bind:filters bind:showMinors {allData} />
    {/if}

    {#if currentView === 'all_visualizations'}
      <Visualizations onSelectProgram={openProgram} />
    {:else if currentView === 'program_view'}
      <button onclick={closeProgram} class="hub-button" style="margin-top: 20px; cursor: pointer;">
        ← Zurück zum StudiumHub
      </button>
      <SpecificProgramView key={activeStudiengang} />
    {:else}
      <StudyContainer {allData} {currentView} {filters} {showMinors} />
    {/if}
  {/if}
</div>
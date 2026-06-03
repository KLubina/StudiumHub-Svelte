<script>
  import { onMount } from 'svelte';
  import FilterControls from './lib/FilterControls.svelte';
  import StudyContainer from './lib/StudyContainer.svelte';
  import Visualizations from './lib/Visualizations.svelte';
  import SpecificProgramView from './routes/SpecificProgramView.svelte';

  // CSS-Imports (Pfade bei Bedarf an deine Struktur anpassen)
  import './css/core/variables.css';
  import './css/core/layout.css';
  import './css/core/typography.css';
  import './css/core/hub-button.css';

  /** @type {any[]} */
  let allData = $state([]);
  let currentView = $state('institution'); 
  let filters = $state({ type: '', institution: 'group_zurich', category: '' }); 
  let showMinors = $state(false);
  let isLoading = $state(true);
  let errorMessage = $state(''); // Speichert Fehler für die Anzeige auf dem Bildschirm
  
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
    // Listen aller zu ladenden JSON-Dateien
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
      // Abgesicherte Fetch-Funktion mit HTTP-Statusprüfung
      const fetchJson = async (/** @type {string} */ url) => {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} beim Laden von: ${url}`);
        }
        return res.json();
      };

      // Erstelle alle Lade-Aufträge (Promises)
      const uniPromises = uniFiles.map(f => fetchJson(`/all-swiss-studies-listed/uni/${f}`));
      const fhPromises = fhFiles.map(f => fetchJson(`/all-swiss-studies-listed/fh/${f}`));
      
      // Warte parallel auf alle Dateien
      const unis = await Promise.all(uniPromises);
      const fhs = await Promise.all(fhPromises);

      // Daten mappen und dem State übergeben
      allData = [
        ...unis.map(d => normalizeInstitution(d, 'uni')),
        ...fhs.map(d => normalizeInstitution(d, 'fh'))
      ];

      // Kurze Verzögerung, damit Stylesheets fertig verarbeitet werden können
      // Verhindert den Fehler: "Layout was forced before the page was fully loaded"
      setTimeout(() => {
        isLoading = false;
      }, 50);

    } catch (/** @type {any} */ err) {
      console.error("Kritischer Fehler beim Laden der JSONs:", err);
      errorMessage = err?.message || "Ein unbekannter Fehler ist beim Laden der Studiengangsdaten aufgetreten.";
      isLoading = false; // Beendet das Laden, damit der Fehler angezeigt wird
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
        Hinweis: Überprüfe, ob der Ordner <code>all-swiss-studies-listed</code> exakt so in deinem <strong><code>public/</code></strong>-Verzeichnis liegt. Falls du die App im Browser geöffnet hast, drücke <strong>F12</strong> und schaue in die Registerkarte <strong>Netzwerk (Network)</strong> für Details.
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
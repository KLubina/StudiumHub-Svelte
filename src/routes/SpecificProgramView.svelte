<script lang="ts">
  import { onMount } from 'svelte';
  import ProgramHeader from '../lib/components/ProgramHeader.svelte';
  import ModuleGrid from '../lib/components/ModuleGrid.svelte';
  import ColorLegend from '../lib/components/ColorLegend.svelte';
  import TooltipPopover from '../lib/components/TooltipPopover.svelte';
  import WahlmodulDialog from '../lib/components/WahlmodulDialog.svelte';

  // Props empfangen (Svelte 5 Syntax via $props)
  let { key = 'eth-cs' } = $props<{ key: string }>();

  let isLoading = $state(true);
  let errorMsg = $state('');

  let generalConfig = $state<Record<string, any>>({});
  let modulesData = $state<Array<Record<string, any>>>([]);
  let colorConfig = $state<Record<string, any>>({});
  let moduleDetails = $state<Record<string, any>>({});

  let selectedWahlmodule = $state<Record<string, any[]>>({}); 
  let activeTooltip = $state<Record<string, any> | null>(null);    
  let activeWahlmodulDialog = $state<Record<string, any> | null>(null);  

  // Effekt triggert jedes Mal, wenn sich der `key` ändert!
  $effect(() => {
    if (key) {
      loadStudiengangData(key);
    }
  });

  async function loadStudiengangData(studiengangKey: string) {
    isLoading = true;
    errorMsg = '';
    
    document.body.setAttribute('data-studiengang', studiengangKey);

    // UZH-Spezial-CSS bereinigen / hinzufügen
    const existingUzh = document.getElementById('uzh-common-css');
    if (existingUzh) existingUzh.remove();

    if (studiengangKey.startsWith('uzh-')) {
      const link = document.createElement('link');
      link.id = 'uzh-common-css';
      link.rel = 'stylesheet';
      link.href = `/program-specific/uzh-common/uzh-common.css`; // Pfad korrigiert auf Root-Basis
      document.head.appendChild(link);
    }

    try {
      await loadLegacyScripts(studiengangKey);
      
      const globalWin = window as any;
      generalConfig = globalWin.StudiengangGeneralConfig || { title: studiengangKey };
      moduleDetails = globalWin.StudiengangModuleDetails || {};
      colorConfig = globalWin.StudiengangCategoriesConfig || globalWin.CSEColorConfig || { kategorien: [] };
      
      const dataKey = Object.keys(globalWin).find(k => k.endsWith('ModulesData') || k === 'StudiengangModules');
      modulesData = dataKey ? globalWin[dataKey] : [];
      
      if (generalConfig?.title) {
        document.title = generalConfig.title;
      }

      isLoading = false;
    } catch (err: any) {
      console.error(err);
      errorMsg = `Fehler beim Laden des Studiengangs: ${err?.message || 'Unbekannt'}`;
      isLoading = false;
    }
  }

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Vorherigen gleichen Script-Tag löschen, um Re-Evaluation zu erzwingen
      const oldScript = document.querySelector(`script[src="${src}"]`);
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script failed to load: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadLegacyScripts(studiengangKey: string) {
    // WICHTIG: Da Vite im Root '/' ausliefert, entfernen wir `../` und greifen direkt zu.
    const basePath = `/program-specific/${studiengangKey}`;
    
    await loadScript(`${basePath}/standard-config/general-config.js`).catch(() => {});
    await loadScript(`${basePath}/standard-config/standardcategories-config.js`).catch(() => {});
    await loadScript(`${basePath}/data/basic-modules-data.js`);
    await loadScript(`${basePath}/data/basic-modules-details.js`).catch(() => {});

    // Stylesheets reaktiv austauschen
    updateStyleLink('program-colors-css', `${basePath}/standard-config/colors/colors.css`);
    updateStyleLink('program-classes-css', `${basePath}/standard-config/colors/classes.css`);
    updateStyleLink('program-layout-css', `${basePath}/individual/layout.css`);
  }

  function updateStyleLink(id: string, href: string) {
    let link = document.getElementById(id) as HTMLLinkElement;
    if (link) {
      link.href = href;
    } else {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  // Reaktive Berechnungen (Svelte 5 $derived Rune verwenden!)
  let allActiveModules = $derived(modulesData.flatMap(m => m?.isPlaceholder ? (selectedWahlmodule[m.name] || []) : [m]));
  let totalKP = $derived(allActiveModules.reduce((sum, m) => sum + (parseInt(m?.ects) || 0), 0));
</script>

<svelte:window onclick={() => activeTooltip = null} />

{#if isLoading}
  <div class="loading" style="padding: 50px; text-align: center; font-size: 1.2rem;">
    Lade spezifische Programmdaten für "{key}" via Svelte...
  </div>
{:else if errorMsg}
  <div class="error" style="color: red; padding: 20px; text-align: center;">{errorMsg}</div>
{:else}
  <div class="container">
    <ProgramHeader {generalConfig} />
    
    <ModuleGrid 
      modules={modulesData} 
      {selectedWahlmodule}
      {moduleDetails}
      bind:activeTooltip 
      bind:activeWahlmodulDialog 
    />
    
    <ColorLegend {colorConfig} {totalKP} {allActiveModules} />
  </div>
{/if}

{#if activeTooltip}
  <TooltipPopover tooltip={activeTooltip} />
{/if}

{#if activeWahlmodulDialog}
  <WahlmodulDialog 
    studiengangKey={key} 
    dialogData={activeWahlmodulDialog} 
    bind:selectedWahlmodule
    on:close={() => activeWahlmodulDialog = null}
  />
{/if}
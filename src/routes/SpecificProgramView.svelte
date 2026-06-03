<script lang="ts">
  import { onMount } from 'svelte';
  import ProgramHeader from '../lib/components/ProgramHeader.svelte';
  import ModuleGrid from '../lib/components/ModuleGrid.svelte';
  import ColorLegend from '../lib/components/ColorLegend.svelte';
  import TooltipPopover from '../lib/components/TooltipPopover.svelte';
  import WahlmodulDialog from '../lib/components/WahlmodulDialog.svelte';

  // Import-Stylesheets (unverändert)
  import '../assets/css/core/variables.css';
  import '../assets/css/core/layout.css';
  import '../assets/css/core/typography.css';
  import '../assets/css/core/hub-button.css';
  import '../assets/css/core/module.css';
  import '../assets/css/core/legend.css';
  import '../assets/css/optional/tooltip.css';
  import '../assets/css/optional/kp-counter.css';
  import '../assets/css/optional/indicators.css';
  import '../assets/css/optional/wahlmodule.css';

  let studiengangKey: string = '';
  let isLoading: boolean = true;
  let errorMsg: string = '';

  let generalConfig: Record<string, any> = {};
  let modulesData: Array<Record<string, any>> = [];
  let colorConfig: Record<string, any> = {};
  let moduleDetails: Record<string, any> = {};

  let selectedWahlmodule: Record<string, any[]> = {}; 
  let activeTooltip: Record<string, any> | null = null;    
  let activeWahlmodulDialog: Record<string, any> | null = null;  

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    studiengangKey = urlParams.get('studiengang') || 'eth-cs';
    
    document.body.setAttribute('data-studiengang', studiengangKey);

    if (studiengangKey.startsWith('uzh-')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `../program-specific/uzh-common/uzh-common.css`;
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
  });

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Script failed to load'));
      document.head.appendChild(script);
    });
  }

  async function loadLegacyScripts(key: string) {
    const basePath = `../program-specific/${key}`;
    
    await loadScript(`${basePath}/standard-config/general-config.js`).catch(() => {});
    await loadScript(`${basePath}/standard-config/standardcategories-config.js`).catch(() => {});
    await loadScript(`${basePath}/data/basic-modules-data.js`);
    await loadScript(`${basePath}/data/basic-modules-details.js`).catch(() => {});

    const colorsLink = document.createElement('link');
    colorsLink.rel = 'stylesheet';
    colorsLink.href = `${basePath}/standard-config/colors/colors.css`;
    document.head.appendChild(colorsLink);

    const classesLink = document.createElement('link');
    classesLink.rel = 'stylesheet';
    classesLink.href = `${basePath}/standard-config/colors/classes.css`;
    document.head.appendChild(classesLink);

    const layoutLink = document.createElement('link');
    layoutLink.rel = 'stylesheet';
    layoutLink.href = `${basePath}/individual/layout.css`;
    document.head.appendChild(layoutLink);
  }

  $: allActiveModules = modulesData.flatMap(m => m?.isPlaceholder ? (selectedWahlmodule[m.name] || []) : [m]);
  $: totalKP = allActiveModules.reduce((sum, m) => sum + (parseInt(m?.ects) || 0), 0);
</script>

<svelte:window on:click={() => activeTooltip = null} />

{#if isLoading}
  <div class="loading" style="padding: 50px; text-align: center; font-size: 1.2rem;">
    Lade spezifische Programmdaten via Svelte...
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
    studiengangKey={studiengangKey} 
    dialogData={activeWahlmodulDialog} 
    bind:selectedWahlmodule
    on:close={() => activeWahlmodulDialog = null}
  />
{/if}
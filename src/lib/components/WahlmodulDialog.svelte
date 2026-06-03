<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let studiengangKey: string = '';
  export let dialogData: Record<string, any> | null = null;
  export let selectedWahlmodule: Record<string, any[]> = {};

  const dispatch = createEventDispatcher();
  let availableModules: Array<Record<string, any>> = [];
  let searchTerm: string = '';
  let isLoading: boolean = true;

  onMount(async () => {
    if (!dialogData?.source) {
      isLoading = false;
      return;
    }
    
    const fullPath = `../program-specific/${studiengangKey}/data/${dialogData.source.replace('./', '')}`;
    
    try {
      await loadScript(fullPath);
      
      const fileName = dialogData.source.split('/').pop() || '';
      const sourceToVarMap: Record<string, string> = {
        'wahlmodule-data.js': 'PolisciWahlmoduleData',
        'seminar-data.js': 'PolisciSeminarData',
        'vertiefungsmodule-data.js': 'PolisciVertiefungsmoduleData',
        'specialisationmodule-data.js': 'SpecialisationModuleData',
        'major-modules-data.js': 'StudiengangWahlmoduleData',
        'erweiterung-modules-data.js': 'StudiengangErweiterungWahlmoduleData',
        'wahlmodules.js': 'StudiengangWahlmoduleData',
        'vertiefungsmodule.js': 'StudiengangVertiefungsmoduleData',
      };
      
      const globalWin = window as any;
      const rawData = globalWin[sourceToVarMap[fileName]] || globalWin.WahlmoduleData || [];
      const currentlySelected = selectedWahlmodule[dialogData.placeholderName] || [];

      if (Array.isArray(rawData)) {
        availableModules = rawData.map(m => ({
          ...m,
          checked: currentlySelected.some(sel => sel.name === m.name)
        }));
      }
      
      isLoading = false;
    } catch (err: any) {
      alert('Fehler beim Laden der Wahlmodule: ' + (err?.message || 'Unbekannter Fehler'));
      close();
    }
  });

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Script load error'));
      document.head.appendChild(script);
    });
  }

  function close() {
    dispatch('close');
  }

  function confirm() {
    if (dialogData?.placeholderName) {
      const selected = availableModules.filter(m => m.checked);
      selectedWahlmodule[dialogData.placeholderName] = selected;
      selectedWahlmodule = { ...selectedWahlmodule };
    }
    close();
  }

  $: filteredModules = availableModules.filter(m => 
    !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: totalSelectedEcts = availableModules.filter(m => m.checked).reduce((sum, m) => sum + (m.ects || 0), 0);
  $: totalSelectedCount = availableModules.filter(m => m.checked).length;
</script>

<div class="wahlmodul-overlay" on:click={close} on:keydown={close} role="button" tabindex="-1" aria-label="Dialog schließen">
  <div class="wahlmodul-dialog" on:click|stopPropagation on:keydown|stopPropagation role="document">
    <div class="wahlmodul-header">
      <h3>Wahlmodule für "{dialogData?.placeholderName || ''}"</h3>
      <button class="wahlmodul-close" on:click={close} title="Schließen">×</button>
    </div>

    <div class="wahlmodul-body">
      {#if isLoading}
        <div style="padding: 20px; text-align: center;">Lade Wahlmodulkatalog...</div>
      {:else}
        <div class="wahlmodul-filter">
          <input type="text" placeholder="Module durchsuchen..." bind:value={searchTerm}>
        </div>
        <div class="wahlmodul-list">
          {#each filteredModules as m, idx}
            <div class="wahlmodul-item">
              <input type="checkbox" id="wm-{idx}" bind:checked={m.checked}>
              <label for="wm-{idx}">
                <span class="wahlmodul-name">{m.name}</span>
                <span class="wahlmodul-ects">{m.ects || 0} ECTS</span>
              </label>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="wahlmodul-footer">
      <div class="wahlmodul-selected-info">
        <span>{totalSelectedCount}</span> Module ausgewählt (<span>{totalSelectedEcts}</span> ECTS)
      </div>
      <button class="wahlmodul-cancel" on:click={close}>Abbrechen</button>
      <button class="wahlmodul-confirm" on:click={confirm}>Bestätigen</button>
    </div>
  </div>
</div>
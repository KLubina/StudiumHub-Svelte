<script lang="ts">
  import ModuleCard from './ModuleCard.svelte';
  
  export let modules: Array<Record<string, any>> = [];
  export let selectedWahlmodule: Record<string, any[]> = {};
  export let moduleDetails: Record<string, any> = {};
  export let activeTooltip: Record<string, any> | null = null;
  export let activeWahlmodulDialog: Record<string, any> | null = null;

  // Akkumulator explizit typisiert, um Index-Fehler (7053) zu vermeiden
  $: groupedYears = modules.reduce((acc: Record<string, Record<string, any[]>>, m) => {
    const y = m?.year || 1;
    const s = m?.semester || 1;
    if (!acc[y]) acc[y] = {};
    if (!acc[y][s]) acc[y][s] = [];
    acc[y][s].push(m);
    return acc;
  }, {});

  function triggerTooltip(event: MouseEvent, moduleItem: Record<string, any>) {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    
    activeTooltip = {
      module: moduleItem,
      details: moduleDetails[moduleItem.name] || null,
      x: rect.right + 10 + window.scrollX,
      y: rect.top + window.scrollY
    };
  }
</script>

<div class="specificprogram" id="specificprogram">
  {#each Object.keys(groupedYears).sort((a, b) => Number(a) - Number(b)) as year}
    <div class="jahr">
      <h3 class="year-title">{year}. Jahr</h3>
      
      {#each Object.keys(groupedYears[year]).sort((a, b) => Number(a) - Number(b)) as semester}
        <div class="semester">
          <h4 class="semester-title">
            {Number(semester) % 2 === 1 ? 'Herbstsemester' : 'Frühlingssemester'}
          </h4>
          
          <div class="module-container">
            {#each groupedYears[year][semester] as module}
              
              {#if module?.isPlaceholder}
                <ModuleCard 
                  {module} 
                  isPlaceholder={true} 
                  onCardClick={(e) => {
                    e.stopPropagation();
                    activeWahlmodulDialog = { placeholderName: module.name, source: module.wahlmodulSource };
                  }} 
                />
                
                {#if selectedWahlmodule[module.name]}
                  <div class="wahlmodul-selected-container" style="display: contents;">
                    {#each selectedWahlmodule[module.name] as wahlmodul}
                      <ModuleCard 
                        module={wahlmodul} 
                        details={moduleDetails[wahlmodul.name]}
                        onCardClick={(e) => triggerTooltip(e, wahlmodul)} 
                      />
                    {/each}
                  </div>
                {/if}
              {:else}
                <ModuleCard 
                  {module} 
                  details={moduleDetails[module.name]}
                  onCardClick={(e) => triggerTooltip(e, module)} 
                />
              {/if}

            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>
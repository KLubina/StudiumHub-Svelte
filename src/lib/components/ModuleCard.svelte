<script lang="ts">
  export let module: Record<string, any>;
  export let isPlaceholder: boolean = false;
  export let details: Record<string, any> | null = null;
  export let onCardClick: (event: MouseEvent) => void;

  const baseSize = 100;
  $: scale = Math.sqrt((module?.ects || 4) / 4);
  $: sizeStyle = `width: ${baseSize * scale}px; height: ${baseSize * scale}px;`;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      // Erstelle ein simuliertes MouseEvent für den Callback
      onCardClick(new MouseEvent('click'));
    }
  }
</script>

<div 
  class="modul {module?.standardcategory || 'unknown'} {isPlaceholder ? 'modul-platzhalter' : ''}" 
  style={sizeStyle}
  on:click={onCardClick}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
  data-ects={module?.ects || 0}
>
  <div class="modul-titel">{module?.name}</div>
  <div class="modul-kp">{module?.ects || 0} KP</div>

  {#if isPlaceholder}
    <span class="edit-badge">✏️</span>
  {/if}

  {#if details}
    <div class="indicators-container">
      {#if details?.vorlesungslink}<div class="video-indicator" title="Vorlesungsvideos verfügbar">🎥</div>{/if}
      {#if details?.skript}<div class="script-indicator" title="Skript verfügbar">📄</div>{/if}
      {#if details?.pruefungen}<div class="exam-indicator" title="Alte Prüfungen verfügbar">📝</div>{/if}
      {#if details?.link}<div class="link-indicator" title="VVZ Seite verfügbar">📖</div>{/if}
      {#if details?.kurslink}<div class="kurslink-indicator" title="Kursunterlagen verfügbar">📚</div>{/if}
    </div>
  {/if}
</div>
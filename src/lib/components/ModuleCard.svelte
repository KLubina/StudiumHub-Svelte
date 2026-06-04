<script lang="ts">
    let {
        module,
        cssClass = 'unknown',
        isPlaceholder = false,
        details = null,
        onCardClick,
    }: {
        module: Record<string, any>,
        cssClass?: string,
        isPlaceholder?: boolean,
        details?: Record<string, any> | null,
        onCardClick: (event: MouseEvent) => void,
    } = $props();

    const baseSize = 100;

    let scale     = $derived(Math.sqrt((module?.ects || 4) / 4));
    let sizeStyle = $derived(`width: ${baseSize * scale}px; height: ${baseSize * scale}px;`);

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            onCardClick(new MouseEvent('click'));
        }
    }
</script>

<div
    class="modul {cssClass} {isPlaceholder ? 'modul-platzhalter' : ''}"
    style={sizeStyle}
    onclick={onCardClick}
    onkeydown={handleKeyDown}
    role="button"
    tabindex="0"
    data-ects={module?.ects || 0}
>
    <div class="modul-titel">{module?.name}</div>
    <div class="modul-kp">{module?.ects || 0} KP</div>

    {#if isPlaceholder}
        <span class="edit-badge">+</span>
    {/if}

    {#if details}
        <div class="indicators-container">
            {#if details?.vorlesungslink}<div class="video-indicator"   title="Vorlesungsvideos verfügbar"></div>{/if}
            {#if details?.skript}        <div class="script-indicator"  title="Skript verfügbar"></div>{/if}
            {#if details?.pruefungen}    <div class="exam-indicator"    title="Alte Prüfungen verfügbar"></div>{/if}
            {#if details?.link}          <div class="link-indicator"    title="VVZ Seite verfügbar"></div>{/if}
            {#if details?.kurslink}      <div class="kurslink-indicator" title="Kursunterlagen verfügbar"></div>{/if}
        </div>
    {/if}
</div>
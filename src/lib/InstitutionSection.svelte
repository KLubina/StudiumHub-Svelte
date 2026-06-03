<script>
  let { uni } = $props();
  let collapsed = $state(true); 

  /** @param {string} text */
  function sanitizeId(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /** @param {KeyboardEvent} e */
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      collapsed = !collapsed;
    }
  }
</script>

<div class="uni-section {collapsed ? 'collapsed' : ''}" id="section-{sanitizeId(uni.name)}">
  <div 
    class="uni-header" 
    onclick={() => collapsed = !collapsed}
    onkeydown={handleKeyDown}
    role="button"
    tabindex="0"
  >
    <div>
      <div class="uni-title">{uni.name}</div>
      <div class="uni-website">
        <a href={uni.website} target="_blank" rel="noopener noreferrer" onclick={(e) => e.stopPropagation()}>
          → Website besuchen
        </a>
      </div>
    </div>
    <span class="toggle-icon">{collapsed ? '▼' : '▲'}</span>
  </div>

  <div class="uni-content">
    {#each uni.categories as cat}
      <div class="category-section">
        <div class="category-title">{cat.name}</div>

        {#if cat.programs && cat.programs.length > 0}
          <div class="studiengang-list">
            {#each cat.programs as p}
              <a href="/study-visualization/standard/specificprogram-template.html?studiengang={p.id || 'unknown'}" class="studiengang-item">
                <div class="studiengang-title">{p.name}</div>
                <div class="studiengang-meta">{p.degree || ''} {p.ects ? `• ${p.ects}` : ''}</div>
              </a>
            {/each}
          </div>
        {/if}

        {#if cat.subcategories}
          {#each cat.subcategories as sub}
            <div class="subcategory-section" style="margin-left: 15px; margin-top: 10px;">
              <div class="subcategory-title" style="font-weight: 600; color: #555;">{sub.name}</div>
              <div class="studiengang-list">
                {#each sub.programs as p}
                  <a href="/study-visualization/standard/specificprogram-template.html?studiengang={p.id || 'unknown'}" class="studiengang-item">
                    <div class="studiengang-title">{p.name}</div>
                    <div class="studiengang-meta">{p.degree || ''} {p.ects ? `• ${p.ects}` : ''}</div>
                  </a>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
</div>
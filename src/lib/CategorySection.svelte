<script>
  let { category } = $props();
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

<div class="uni-section {collapsed ? 'collapsed' : ''}" id="section-{sanitizeId(category.name)}">
  <div 
    class="uni-header" 
    onclick={() => collapsed = !collapsed}
    onkeydown={handleKeyDown}
    role="button"
    tabindex="0"
  >
    <div>
      <div class="uni-title">{category.name}</div>
    </div>
    <span class="toggle-icon">{collapsed ? '▼' : '▲'}</span>
  </div>

  <div class="uni-content">
    {#each category.institutions as inst}
      <div class="institution-section" style="border-left: 3px solid #007bff; padding-left: 10px; margin-bottom: 15px;">
        <div class="category-title" style="font-size: 1.1rem; color: #333;">
          <span style="font-size: 0.8rem; color: #777;">{inst.type === 'uni' ? '[Uni]' : '[FH]'}</span> {inst.name}
          <a href={inst.website} target="_blank" rel="noopener noreferrer" style="font-size: 0.8rem; margin-left: 10px; color: #007bff;">→ Link</a>
        </div>

        {#if inst.programs && inst.programs.length > 0}
          <div class="studiengang-list">
            {#each inst.programs as p}
              <a href="/study-visualization/standard/specificprogram-template.html?studiengang={p.id || 'unknown'}" class="studiengang-item">
                <div class="studiengang-title">{p.name}</div>
                <div class="studiengang-meta">{p.degree || ''} {p.ects ? `• ${p.ects}` : ''}</div>
              </a>
            {/each}
          </div>
        {/if}

        {#if inst.subcategories}
          {#each inst.subcategories as sub}
            <div class="subcategory-group" style="margin-left: 15px; margin-top: 5px;">
              <div style="font-size: 0.9rem; font-weight: bold; color: #666;">{sub.name}</div>
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
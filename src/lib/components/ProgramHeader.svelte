<script lang="ts">
  // Typisierung als generisches Objekt, um Property-Fehler zu vermeiden
  export let generalConfig: Record<string, any> = {};
</script>

<div class="hub-button-container">
  <a href="../../index.html" class="hub-button">← Zurück zum Hub</a>
</div>

<h1 id="specificprogram-title">{generalConfig?.title || 'Specificprogram'}</h1>
<h2 id="specificprogram-subtitle">{@html generalConfig?.subtitleHtml || 'mind. 180 KP insgesamt'}</h2>
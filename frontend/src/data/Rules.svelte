<script>
  import { vkrulesStore } from "../socket.js";
  import TemplateMain from "../TemplateMain.svelte";
  import Rule from "./Rule.svelte";
</script>

<TemplateMain>
  <div class="container">
    {#if $vkrulesStore.loading}
      <h3>загрузка параметров</h3>
    {:else}
      {#each $vkrulesStore.rules as rule, i}
        <Rule {i} {rule} />
      {/each}
    {/if}
  </div>
</TemplateMain>

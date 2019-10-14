<script>
  import ErrPage from "./ErrPage.svelte";
  import { location, querystring } from "svelte-spa-router";
</script>

<ErrPage title="ОШИБКА" text="страница {$location} не найдена" />

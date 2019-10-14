<script>
  import Router from "svelte-spa-router";

  import ErrPageNotFound from "./errs/ErrPageNotFound.svelte";
  import Home from "./Home.svelte";
  import LoginForm from "./user/LoginForm.svelte";
  import Rules from "./data/Rules.svelte";
  import Results from "./data/Results.svelte";

  const routes = new Map();

  routes.set("/", Home);
  routes.set(/^\/home/i, Home);
  routes.set(/^\/login/i, LoginForm);
  routes.set(/^\/rules/i, Rules);
  routes.set(/^\/results/i, Results);

  routes.set("*", ErrPageNotFound);
</script>

<Router {routes} />

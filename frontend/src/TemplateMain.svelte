<script>
  import MainMenu from "./mainMenu/MainMenu.svelte";
</script>

<MainMenu />

<!--<LoginForm />-->
<div class="clearfix">
  <!--<svelte:component this={$mainForm.form} />-->
  <!--загрузка..-->
  <slot />

</div>

<div class="clearfix">
  <div class="py-3">
    <!-- отступ для футера -->
    <br />
  </div>
</div>

<footer class="footer mt-auto py-3 fixed-bottom">
  <div class="row px-3">
    <div class="col-5 col-md">
      <span class="text-muted">
        ©
        <a href="http://anykey.vrashke.net">anykey</a>
        2019
      </span>
    </div>
    <div class="col-2 col-md" />
    <div class="col-5 col-md text-right">
      <div class="text-muted">все данные получены из открытых источников</div>
    </div>
  </div>
</footer>

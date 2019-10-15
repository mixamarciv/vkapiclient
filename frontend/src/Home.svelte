<script>
  import { push } from "svelte-spa-router";
  import TemplateMain from "./TemplateMain.svelte";
</script>

<TemplateMain>
  <div class="jumbotron">
    <div class="container">
      <h1 class="display-3">ВНИМАНИЕ</h1>

      <p>
        скрипт загружает данные из открытых источников через
        <a target="_blank" href="https://vk.com/dev.php?method=streaming_api">
          Streaming API
        </a>
      </p>
      <p>
        <a href="#/login">авторизуйтесь</a>
        для просмотра загруженных данных и редактирования критериев загрузки
      </p>
    </div>
  </div>
</TemplateMain>

<script>
  import { vkrulesStore } from "../socket.js";
  export let i = 0;
  export let rule = {};
  let ruleValue = rule.value;
</script>

<style>
  .dark-input {
    background: #414a5a;
    border: 1px solid #222427;
    color: #c2c2c2;
  }
</style>

<div class="alert alert-dismissible alert-primary">
  <strong>[{i}] {rule.tag}</strong>
  <input
    type="text"
    class="form-control-sm dark-input mx-2 px-2 col-8"
    placeholder="укажите ключевые слова"
    id="input"
    bind:value={ruleValue} />

</div>

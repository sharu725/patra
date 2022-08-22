<script>
  import { decode } from "js-base64";
  export let data;
  let { slug } = data;
  const note = decode(slug);
  console.log(note);
</script>

{@html note}

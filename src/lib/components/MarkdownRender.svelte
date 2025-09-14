<script>
  import Markdown from "svelte-exmarkdown";
  import "katex/dist/katex.min.css";
  import rehypeKatex from "rehype-katex";
  import remarkMath from "remark-math";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import rehypeRaw from "rehype-raw";

  const plugins = [
    { remarkPlugin: [remarkMath], rehypePlugin: [rehypeKatex] },
    { rehypePlugin: [rehypeRaw] },
    gfmPlugin(),
  ];

  let { md = $bindable("") } = $props();
</script>

<Markdown {md} {plugins} />

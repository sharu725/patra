import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const defaultValue = `## Patra | Share your notes!
You can share short notes with just a link. No database. No storage!

- write short articles in **markdown** and share the link!
- write around **100,000 characters** which is roughly **15k words**.
- content stored locally. Page **refresh will not lose progress**!
- works **offline** too!
- create **tables** as well!


|Header 1 |Header 2  | Header 3|
|-------- | -------- | --------|
| data 1  | data 2   |  data 3 |
| data 11 | data 12  |  data 13|

- embed maps


<iframe style="border:0; display:block; width:100%" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2664.642326877131!2d76.59443713513481!3d12.366147804839871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1712681027838!5m2!1sen!2sin" height="450"  allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

- check the link generated at the bottom.

### Features
- markdown support
- light-weight
- SSR by default

### Use this as a Todo list app

- ~do a thing~
- do another thing

\`\`\`html
<p>Highlight code blocks</p>
\`\`\`

The note will remain until overwritten.`;
export const patraData = writable(
  (browser && localStorage.getItem("patraData")) || defaultValue
);

patraData.subscribe((val) => browser && (localStorage.patraData = val));

export const siteTitle = "Patra";

import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const defaultValue = `## Patra | Share your notes!
You can share short notes with just a link. No database. No storage!

- write short articles in **markdown** and share the link!
- write around **100,000 characters** which is roughly **15k words**.
- content stored locally. Page **refresh will not lose progress**!
- create **tables** as well!

|Header 1 |Header 2  | Header 3|
|-------- | -------- | --------|
| data 1  | data 2   |  data 3 |
| data 11 | data 12  |  data 13|

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

The note will remain until overwritten.    
`;
export const patraData = writable(
  (browser && localStorage.getItem("patraData")) || defaultValue
);

patraData.subscribe((val) => browser && (localStorage.patraData = val));

export const siteTitle = "Patra";

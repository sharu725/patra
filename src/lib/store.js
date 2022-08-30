import { writable } from "svelte/store";
import { browser } from "$app/env";

export const patraData = writable(
  (browser && localStorage.getItem("patraData")) ||
    `## Patra | Share your notes!
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

### Use this as a Todo list app

- ~do a thing~
- do another thing

The note will remain until overwritten.
    
    
`
);

patraData.subscribe((val) => browser && (localStorage.patraData = val));

export const siteTitle = "Patra";

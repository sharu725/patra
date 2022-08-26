import { writable } from "svelte/store";
import { browser } from "$app/env";

export const patraData = writable(
  (browser && localStorage.getItem("patraData")) ||
    `
# H1 heading

## H2 heading

### H3 heading

--------

**bold text**

*italicized text*

--------

1. First item
2. Second item
3. Third item

- First item
- Second item
- Third item

|Header 1 |Header 2  | Header 3|
--- | --- | ---|
|data 1|data 2|data 3|
|data 11|data 12|data 13|
`
);

patraData.subscribe((val) => browser && (localStorage.patraData = val));

export const siteTitle = "Patra";

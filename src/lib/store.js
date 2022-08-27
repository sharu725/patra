import { writable } from "svelte/store";
import { browser } from "$app/env";

export const patraData = writable(
  (browser && localStorage.getItem("patraData")) ||
    `# Patra | Share your notes

You can share short notes just with a link. No database. No storage!

You can write short articles in markdown and share the link!

You can refresh the page but your notes remain as-is!

You can create tables as well!

|Header 1 |Header 2  | Header 3|
|-------- | -------- | --------|
| data 1  | data 2   |  data 3 |
| data 11 | data 12  |  data 13|`
);

patraData.subscribe((val) => browser && (localStorage.patraData = val));

export const siteTitle = "Patra";

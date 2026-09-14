import { cp, rm } from "node:fs/promises";
const output = new URL("../out/", import.meta.url);
const destination = new URL("../../kanatzidis-demo/", import.meta.url);
await rm(destination, { recursive: true, force: true });
await cp(output, destination, { recursive: true });
console.log("Updated /kanatzidis-demo/ static files.");

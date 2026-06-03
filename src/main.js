import { mount } from "svelte";
import App from "./App.svelte";

const target = document.getElementById("app");

if (!target) {
  throw new Error(
    "Target-Element '#app' wurde in der index.html nicht gefunden!",
  );
}

const app = mount(App, {
  target: target,
});

export default app;

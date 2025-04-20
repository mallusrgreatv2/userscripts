// ==UserScript==
// @name         SillyDev Downtime Checker
// @namespace    https://discopika.tk
// @version      1.0.0
// @description  Prompt when the node is rate limited
// @author       mallusrgreat
// @match        https://panel.sillydev.co.uk/server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panel.sillydev.co.uk
// @grant        none
// @license      MIT
// ==/UserScript==

(async function () {
  "use strict";
  const data = await fetch("https://silly.darklegacymc.tk/data").then((x) =>
    x.json()
  );
  const serverId = document.URL.match(
    /^https?:\/\/[a-z.]+\/server\/([a-z0-9]{8})/
  )[1];
  const serverData = await fetch(
    `https://panel.sillydev.co.uk/api/client/servers/${serverId}`
  ).then((x) => x.json());
  const nodeData = data[serverData.attributes.node];
  if (!nodeData)
    return console.log(`Data for node ${serverData.attributes.node} not found`);
  let message = "";
  if (nodeData.rateLimitTime)
    message += `The ${
      serverData.attributes.node
    } node is currently rate limited on Discord! Expires ${formatRateLimitTime(
      nodeData.rateLimitTime
    )} (${nodeData.rateLimitTime.toLocaleString()} seconds)`;
  if (nodeData.down)
    message += `${message.length ? "\n" : ""}The ${
      serverData.attributes.node
    } node is currently down!`;
  if (message) alert(message);
})();
function formatRateLimitTime(seconds) {
  if (seconds >= 3600) {
    return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
      Math.floor(seconds / 3600),
      "hour"
    );
  } else if (seconds >= 60) {
    return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
      Math.floor(seconds / 60),
      "minute"
    );
  } else {
    return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
      seconds,
      "second"
    );
  }
}

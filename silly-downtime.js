// ==UserScript==
// @name         SillyDev Downtime Checker
// @namespace    https://discopika.tk
// @version      1.0.0
// @description  Prompt when the node is rate limited or down (with proper mutation observer)
// @author       mallusrgreat
// @match        https://panel.sillydev.co.uk/server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panel.sillydev.co.uk
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  let lastURL = location.href;
  let timeout = null;

  async function checkStatus() {
    const match = lastURL.match(/^https?:\/\/[a-z.]+\/server\/([a-z0-9]{8})/);
    if (!match) return;

    const serverId = match[1];

    try {
      const data = await fetch("https://silly.darklegacymc.tk/data").then(
        (res) => res.json()
      );
      const serverData = await fetch(
        `https://panel.sillydev.co.uk/api/client/servers/${serverId}`
      ).then((res) => res.json());
      const node = serverData.attributes.node;
      const nodeData = data[node];

      if (!nodeData) {
        console.log(`No data for node ${node}`);
        return;
      }

      let message = "";

      if (nodeData.rateLimitTime) {
        message += `The ${node} node is currently rate-limited on Discord! Expires ${formatTime(
          nodeData.rateLimitTime
        )} (${nodeData.rateLimitTime.toLocaleString()} seconds).`;
      }

      if (nodeData.down) {
        message += `${
          message.length ? "\n" : ""
        }The ${node} node is currently down!`;
      }

      if (message) alert(message);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  function formatTime(seconds) {
    const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
    if (seconds >= 3600) return rtf.format(Math.floor(seconds / 3600), "hour");
    if (seconds >= 60) return rtf.format(Math.floor(seconds / 60), "minute");
    return rtf.format(seconds, "second");
  }

  const observer = new MutationObserver(() => {
    if (location.href !== lastURL) {
      lastURL = location.href;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        checkStatus();
      }, 500);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  checkStatus();
})();

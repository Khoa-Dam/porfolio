

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("terminal-overlay");
  const terminalBody = document.getElementById("terminal-body");

  if (!overlay || !terminalBody) {
    console.error("Terminal elements not found!");
    if (overlay) overlay.style.display = "none";
    return;
  }

  const sequence = [
    { type: "command", text: "whoami" },
    { type: "delay", duration: 200 },
    {
      type: "output",
      text: "Kaito",
      color: "text-info",
    },
    { type: "delay", duration: 600 },
    { type: "command", text: "open https://khoa-dam.github.io/porfolio/" },
    { type: "delay", duration: 400 },
    {
      type: "output",
      text: "[INFO] Connecting to portfolio...",
      color: "text-muted",
    },
    { type: "delay", duration: 800 },
    { type: "output", text: "Hi everyone, I'm Kaito.", color: "text-warning" },
    { type: "delay", duration: 400 },
    { type: "output", text: "Welcome to my portfolio." },
    { type: "delay", duration: 400 },
    {
      type: "output",
      text: "[OK] Assets loaded successfully.",
      color: "text-success",
    },
    { type: "delay", duration: 1800 },
  ];

  const commandSpeed = 80;
  const outputSpeed = 40;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const typeLine = async (line, element, speed) => {
    for (let i = 0; i < line.length; i++) {
      element.textContent += line.charAt(i);
      await delay(speed);
    }
  };

  const runTerminal = async () => {
    document.body.classList.add("no-scroll");

    for (const item of sequence) {
      if (item.type === "command") {
        const lineEl = document.createElement("div");
        lineEl.classList.add("terminal-line");
        lineEl.innerHTML = `<span class="prompt">></span> <span class="text-content"></span><span class="cursor"></span>`;
        terminalBody.appendChild(lineEl);

        const textContentEl = lineEl.querySelector(".text-content");
        await typeLine(item.text, textContentEl, commandSpeed);

        const cursorEl = lineEl.querySelector(".cursor");
        if (cursorEl) cursorEl.remove();
      } else if (item.type === "output") {
        if (item.inline) {
          const lastLineEl = terminalBody.lastElementChild;
          if (lastLineEl) {
            lastLineEl.innerHTML += " ";
            const inlineTextEl = document.createElement("span");
            if (item.color) {
              inlineTextEl.classList.add(item.color);
            }
            lastLineEl.appendChild(inlineTextEl);
            await typeLine(item.text, inlineTextEl, outputSpeed);
          }
        } else {
          const lineEl = document.createElement("div");
          lineEl.classList.add("terminal-line");
          if (item.color) {
            lineEl.classList.add(item.color);
          }
          terminalBody.appendChild(lineEl);
          lineEl.innerHTML =
            '<span class="text-content"></span><span class="cursor"></span>';
          const textContentEl = lineEl.querySelector(".text-content");
          await typeLine(item.text, textContentEl, outputSpeed);
          const cursorEl = lineEl.querySelector(".cursor");
          if (cursorEl) cursorEl.remove();
        }
      } else if (item.type === "delay") {
        await delay(item.duration);
      }
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    const finalLine = document.createElement("div");
    finalLine.classList.add("terminal-line");
    finalLine.innerHTML = `<span class="prompt">></span> <span class="cursor"></span>`;
    terminalBody.appendChild(finalLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;

    await delay(1200);

    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    overlay.addEventListener("transitionend", () => overlay.remove(), {
      once: true,
    });
  };

  runTerminal();
});

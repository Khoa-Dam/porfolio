(async () => {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  let data = [];
  try {
    const res = await fetch("data/projects.json", { cache: "no-store" });
    if (res.ok) data = await res.json();
  } catch (_) {
    // ignore
  }

  // Fallback demo data
  if (!Array.isArray(data) || !data.length) {
    data = [
      {
        title: "Vendor — NFT Marketplace",
        desc: "On-chain marketplace with listings, bids, analytics.",
        image: "assets/images/proj-vendor.jpg",
        tags: ["Next.js", "Aptos", "Web3"],
      },
      {
        title: "MoveLazy — VSCode Extension",
        desc: "Ship Move contracts faster with templates & tools.",
        image: "assets/images/proj-movelazy.jpg",
        tags: ["VSCode", "Move", "Tooling"],
      },
      {
        title: "BaseHub Games",
        desc: "Gaming hub (Caro, WordChain) with OnchainKit.",
        image: "assets/images/proj-basehub.jpg",
        tags: ["Next.js", "Base", "Games"],
      },
    ];
  }

  const tpl = (p) => `
    <article class="card">
      <div class="card-media">${
        p.image ? `<img src="${p.image}" alt="${p.title}">` : ""
      }</div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.desc || ""}</div>
        ${
          Array.isArray(p.tags) && p.tags.length
            ? `<div class="card-tags">${p.tags
                .map((t) => `<span class="tag">${t}</span>`)
                .join("")}</div>`
            : ""
        }
      </div>
    </article>
  `;

  grid.innerHTML = data.map(tpl).join("");
})();

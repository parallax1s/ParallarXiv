function extractArxivId(input) {
  const trimmed = input.trim();
  // Accept full DOI URLs like https://doi.org/10.48550/arXiv.1234.56789
  let match = trimmed.match(
    /^(?:https?:\/\/doi\.org\/)?10\.48550\/arXiv\.(.+)$/i,
  );
  if (match) return match[1];
  // Accept arXiv identifiers such as arXiv:1234.56789v2
  match = trimmed.match(/^arXiv:(.+)$/i);
  if (match) return match[1];
  // Finally, accept a bare arXiv id like 1234.56789v2
  match = trimmed.match(/^[\w.-]+$/);
  if (match) return match[0];
  return null;
}

async function fetchArxivByDoi(doi) {
  const arxivId = extractArxivId(doi);
  if (!arxivId) {
    return { error: "Not a valid arXiv DOI" };
  }
  const url = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(
    arxivId,
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");
  const entry = xml.querySelector("entry");
  if (!entry) {
    return { error: "No entry found" };
  }
  const authors = Array.from(entry.getElementsByTagName("author")).map(
    (a) => a.getElementsByTagName("name")[0].textContent,
  );
  return {
    title: entry.querySelector("title")?.textContent.trim(),
    summary: entry.querySelector("summary")?.textContent.trim(),
    authors,
    published: entry.querySelector("published")?.textContent,
    link: entry.querySelector("id")?.textContent,
  };
}

document.getElementById("doi-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const doi = document.getElementById("doi-input").value.trim();
  const results = document.getElementById("results");
  results.textContent = "Loading...";
  try {
    const data = await fetchArxivByDoi(doi);
    results.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    results.textContent = err.message;
  }
});

async function fetchArxivByDoi(doi) {
  const match = doi.match(/^10\.48550\/arXiv\.(.+)$/i);
  if (!match) {
    return { error: "Not a valid arXiv DOI" };
  }
  const arxivId = match[1];
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

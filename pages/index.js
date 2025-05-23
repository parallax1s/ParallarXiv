import Head from 'next/head';
import Script from 'next/script';
import { useCallback } from 'react';

export default function Home() {
  const init = useCallback(() => {
    if (!window.d3) return;
    const d3 = window.d3;

    function buildHierarchy(data) {
      const hierarchy = {};
      for (const [topic, details] of Object.entries(data.topics)) {
        hierarchy[topic] = {};
        for (const [cat, subs] of Object.entries(details.categories)) {
          hierarchy[topic][cat] = {};
          subs.forEach(sub => {
            hierarchy[topic][cat][sub] = [];
          });
        }
      }
      data.papers.forEach(p => {
        const arr = hierarchy[p.topic][p.category][p.subcategory];
        if (arr.length < 5) arr.push(p.title);
      });
      return hierarchy;
    }

    function render(hierarchy) {
      const container = d3.select('#viz');
      const levels = [];
      let levelDepth = 0;
      const topicKeys = Object.keys(hierarchy);
      const topicStep = (2 * Math.PI) / topicKeys.length;
      topicKeys.forEach((topic, i) => {
        levels.push({ name: topic, angle: i * topicStep, radius: 150, depth: 0 });
        const cats = Object.keys(hierarchy[topic]);
        const catStep = (2 * Math.PI) / cats.length;
        cats.forEach((cat, j) => {
          levels.push({ name: cat, angle: j * catStep, radius: 250, depth: 1 });
          const subs = Object.keys(hierarchy[topic][cat]);
          const subStep = (2 * Math.PI) / subs.length;
          subs.forEach((sub, k) => {
            levels.push({ name: sub, angle: k * subStep, radius: 350, depth: 2 });
            const papers = hierarchy[topic][cat][sub];
            const paperStep = (2 * Math.PI) / papers.length;
            papers.forEach((paper, p) => {
              levels.push({ name: paper, angle: p * paperStep, radius: 450, depth: 3 });
            });
          });
        });
        levelDepth = 3;
      });
      container.selectAll('div')
        .data(levels)
        .enter()
        .append('div')
        .attr('class', 'node')
        .style('transform', d =>
          `translate(-50%, -50%) rotate(${d.angle}rad) translate(${d.radius}px) rotate(${-d.angle}rad) translateZ(${d.depth * 200}px)`
        )
        .text(d => d.name);

      window.addEventListener('scroll', () => {
        const depth = window.scrollY;
        container.style('transform', `translateZ(${-depth}px)`);
      });
    }

    fetch('/papers.json')
      .then(r => r.json())
      .then(data => render(buildHierarchy(data)))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Head>
        <title>ParallarXiv</title>
        <style>{`body { margin: 0; overflow-y: scroll; perspective: 1000px; height: 200vh; background: #000; color: #fff; }
        #viz { position: fixed; width: 100%; height: 100%; top: 0; left: 0; transform-style: preserve-3d; }
        .node { position: absolute; transform-style: preserve-3d; white-space: nowrap; font-size: 12px; }`}</style>
      </Head>
      <h1>Deployment OK</h1>
      <div id="viz"></div>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js" onLoad={init} />
    </>
  );
}

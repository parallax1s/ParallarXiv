function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

export function generateTopicHierarchy() {
  const topics = [];
  topics.push({
    name: 'Biophysics',
    associatedWith: ['Biology', 'Physics'],
    subcategories: [
      { name: 'Optogenetics', subcategories: [] },
      {
        name: 'Neurobiophysics',
        subcategories: [
          { name: 'Membrane Ion Channel Properties', subcategories: [] },
        ],
      },
    ],
  });

  for (let i = 2; i <= 15; i++) {
    const subcategories = Array.from({ length: 3 }, (_, j) => ({
      name: `Subtopic ${i}.${j + 1}`,
      subcategories: [
        { name: `Detail ${i}.${j + 1}.1`, subcategories: [] },
        { name: `Detail ${i}.${j + 1}.2`, subcategories: [] },
      ],
    }));

    topics.push({
      name: `Topic ${i}`,
      associatedWith: [],
      subcategories,
    });
  }

  return topics;
}

export function generatePapers(count = 5000) {
  const topicHierarchy = generateTopicHierarchy();
  const topics = topicHierarchy.map(t => t.name);
  const papersByTopic = topics.map(() => []);
  const papers = [];

  for (let id = 1; id <= count; id++) {
    const topicIndex = randomInt(0, topics.length - 1);
    const topicNode = topicHierarchy[topicIndex];
    let subCategory = null;
    let subSubCategory = null;
    if (topicNode.subcategories.length) {
      const subCatNode = sample(topicNode.subcategories);
      subCategory = subCatNode.name;
      if (subCatNode.subcategories.length) {
        subSubCategory = sample(subCatNode.subcategories).name;
      }
    }

    const paper = {
      id,
      name: `${id}`,
      topic: topicNode.name,
      subCategory,
      subSubCategory,
      citations: [],
      citationCount: 0,
    };
    papersByTopic[topicIndex].push(paper);
    papers.push(paper);
  }

  for (const paper of papers) {
    const topicIndex = topics.indexOf(paper.topic);
    const sameTopic = papersByTopic[topicIndex].filter(p => p.id !== paper.id);
    const otherPapers = papers.filter(p => p.topic !== paper.topic);
    const citationNum = randomInt(10, 20);
    for (let i = 0; i < citationNum; i++) {
      const fromSameDomain = Math.random() < 0.7;
      const source = fromSameDomain && sameTopic.length > 0 ? sample(sameTopic) : sample(otherPapers);
      paper.citations.push(source.id);
    }
    paper.citationCount = Math.round(citationNum * (Math.random() * 3 + 1));
  }

  return { papers, topicHierarchy };
}

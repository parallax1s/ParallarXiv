function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

export function generatePapers(count = 5000) {
  const topics = Array.from({ length: 15 }, (_, i) => `Topic ${i + 1}`);
  const papersByTopic = topics.map(() => []);
  const papers = [];

  for (let id = 1; id <= count; id++) {
    const topicIndex = randomInt(0, topics.length - 1);
    const paper = {
      id,
      name: `${id}`,
      topic: topics[topicIndex],
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

  return papers;
}

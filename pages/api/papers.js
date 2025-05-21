import { generatePapers } from '../../lib/generatePapers';

export default function handler(req, res) {
  const { count } = req.query;
  const num = parseInt(count, 10) || 5000;
  const { papers, topicHierarchy } = generatePapers(num);
  res.status(200).json({ papers, topicHierarchy });
}

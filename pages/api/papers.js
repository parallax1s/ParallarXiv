import { generatePapers } from '../../lib/generatePapers';

export default function handler(req, res) {
  const { count } = req.query;
  const num = parseInt(count, 10) || 5000;
  const data = generatePapers(num);
  res.status(200).json(data);

}

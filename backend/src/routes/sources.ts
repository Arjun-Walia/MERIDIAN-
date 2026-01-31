import { Router, Request, Response } from 'express';

const router = Router();

// Get all connected data sources
router.get('/', (req: Request, res: Response) => {
  res.json({
    sources: [
      { id: 'jira', name: 'Jira', status: 'disconnected' },
      { id: 'mongodb', name: 'MongoDB', status: 'connected' },
      { id: 'slack', name: 'Slack', status: 'disconnected' },
      { id: 'ats', name: 'ATS', status: 'disconnected' }
    ]
  });
});

// Connect a new data source
router.post('/connect', (req: Request, res: Response) => {
  const { sourceId, config } = req.body;
  // TODO: Implement source connection logic
  res.json({ message: `Connecting to ${sourceId}...`, status: 'pending' });
});

// Disconnect a data source
router.post('/disconnect', (req: Request, res: Response) => {
  const { sourceId } = req.body;
  // TODO: Implement source disconnection logic
  res.json({ message: `Disconnected from ${sourceId}`, status: 'disconnected' });
});

export default router;

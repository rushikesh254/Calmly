import Session from "../models/Session.js";
import MoodLog from "../models/MoodLog.js";
import JournalEntry from "../models/JournalEntry.js";
import Resource from "../models/Resource.js";

// NOTE: For demo purposes we pass attendeeEmail in query (should use auth in production)
export const attendeeSummary = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "email query required" });
    const now = new Date();

    const [upcomingCount, moodCount, journalCount, resourceCount] =
      await Promise.all([
        Session.countDocuments({
          attendee_email: email.toLowerCase(),
          session_date: { $gte: now },
        }),
        MoodLog.countDocuments({}), // TODO: filter by userId when auth known
        JournalEntry.countDocuments({}), // TODO: filter by attendeeId
        Resource.countDocuments({}),
      ]);

    res.json({
      upcomingSessions: upcomingCount,
      moodEntries: moodCount,
      journalEntries: journalCount,
      resourcesViewed: resourceCount, // placeholder: real "viewed" metric requires tracking
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

// Server-Sent Events stream for attendee dashboard metrics.
export const attendeeSummaryStream = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).end();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let closed = false;
    req.on("close", () => {
      closed = true;
      if (interval) globalThis.clearInterval(interval);
    });

    const send = (data) => {
      if (closed) return;
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const computeAndSend = async () => {
      try {
        const now = new Date();
        const [upcomingCount, moodCount, journalCount, resourceCount] =
          await Promise.all([
            Session.countDocuments({
              attendee_email: email.toLowerCase(),
              session_date: { $gte: now },
            }),
            MoodLog.countDocuments({}),
            JournalEntry.countDocuments({}),
            Resource.countDocuments({}),
          ]);
        send({
          upcomingSessions: upcomingCount,
          moodEntries: moodCount,
          journalEntries: journalCount,
          resourcesViewed: resourceCount,
          generatedAt: new Date().toISOString(),
        });
      } catch (err) {
        send({ error: "failed" });
      }
    };

    // Initial push
    computeAndSend();
    // Poll every 10s (change streams would be nicer but requires replica set)
    const interval = globalThis.setInterval(computeAndSend, 10000);
  } catch (err) {
    next(err);
  }
};

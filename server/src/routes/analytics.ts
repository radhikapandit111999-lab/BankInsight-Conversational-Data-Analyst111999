
import { Router, Request, Response } from "express";
import { z } from "zod";
import { processAnalyticsQuestion } from "../services/analyticsService.js";

const router = Router();

const questionSchema = z.object({
  question: z.string().trim().min(3).max(500)
});

router.post("/query", (req: Request, res: Response) => {
  const validation = questionSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      answer: "Please provide a valid question.",
      errors: validation.error.issues
    });
  }

  const result = processAnalyticsQuestion(
    validation.data.question
  );

  return res.status(result.success ? 200 : 400).json(result);
});

export default router;

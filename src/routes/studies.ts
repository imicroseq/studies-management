import {
  addSubmittersToStudy,
  createStudy,
  getStudies,
  removeSubmitterFromStudy,
} from "../services/studies";
import { NextFunction, Request, Response } from "express";
import express from "express";
import authFilter from "../components/authFilter";

const router = express.Router();

router.get(
  "/",
  authFilter,
  (req: Request, res: Response, next: NextFunction) => {
    console.debug("Fetching studies");
    const sampleType = req.query.sampleType?.toString();
    getStudies(sampleType)
      .then((studies) =>
        res.json({ success: true, message: "Found studies", data: studies })
      )
      .catch(next);
  }
);

router.post(
  "/",
  authFilter,
  (req: Request, res: Response, next: NextFunction) => {
    console.debug(
      `Creating study '${req.body.studyId}' in '${req.body.sampleType}' sample type`
    );
    createStudy(req.body)
      .then((study) =>
        res.json({
          success: true,
          message: "Study successfully created!",
          data: study,
        })
      )
      .catch(next);
  }
);

router.post(
  "/submitters",
  authFilter,
  (req: Request, res: Response, next: NextFunction) => {
    console.debug("Adding submitters");
    addSubmittersToStudy(req.body)
      .then((result) =>
        res.json({
          success: true,
          message: "User successfully added!",
          data: result,
        })
      )
      .catch(next);
  }
);

router.delete(
  "/submitters",
  authFilter,
  (req: Request, res: Response, next: NextFunction) => {
    console.debug("Removing submitters");
    const removeReq = {
      sampleType: req.query.sampleType?.toString() || "",
      studyId: req.query.studyId?.toString() || "",
      submitter: req.query.submitter?.toString() || "",
    };
    removeSubmitterFromStudy(removeReq)
      .then((result) =>
        res.json({
          success: true,
          message: "User successfully removed!",
          data: result,
        })
      )
      .catch(next);
  }
);

export default router;

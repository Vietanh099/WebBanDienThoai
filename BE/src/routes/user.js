import express from "express";
import { getAll,remove} from "../controllers/user";
const router = express.Router();

router.get("/users", getAll);
router.delete("/users/:id",remove);

export default router;
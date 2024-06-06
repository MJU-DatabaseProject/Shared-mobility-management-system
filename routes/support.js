const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 모든 질문 가져오기
  router.get("/", (req, res) => {
    const query =
      "SELECT support_id, support_text, resp_stat, reg_date, user_id, response_text FROM support";
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // 특정 질문 가져오기
  router.get("/:id", (req, res) => {
    const supportId = req.params.id;
    const query = "SELECT * FROM support WHERE support_id = ?";
    db.query(query, [supportId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result[0]);
    });
  });

  // 답변 저장하기
  router.post("/:id", (req, res) => {
    const supportId = req.params.id;
    const { response_text } = req.body;
    const query =
      "UPDATE support SET resp_stat = 'Y', response_text = ?, resp_date = NOW() WHERE support_id = ?";

    db.query(query, [response_text, supportId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
  });

  return router;
};

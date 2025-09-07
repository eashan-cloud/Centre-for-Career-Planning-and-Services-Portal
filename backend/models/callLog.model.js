import pool from "../config/postgredb.js";

const CallLog = {
  // Create a new log
  async createLog({ contact_id, caller_id, call_mode, call_outcome, duration, conversation_summary, next_follow_up_date, remarks, admin_comments, recruitment_cycle }) {
    const query = `
      INSERT INTO call_logs 
        (contact_id, caller_id, call_mode, call_outcome, duration, conversation_summary, next_follow_up_date, remarks, admin_comments, recruitment_cycle)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [contact_id, caller_id, call_mode, call_outcome, duration, conversation_summary, next_follow_up_date, remarks, admin_comments, recruitment_cycle];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get all logs
  async getAllLogs() {
    const query = `
      SELECT cl.*, hc.full_name AS hr_name, u.full_name AS caller_name
      FROM call_logs cl
      JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
      JOIN users u ON cl.caller_id = u.user_id
      ORDER BY cl.call_timestamp DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get a single log by ID
  async getLogById(log_id) {
    const query = `
      SELECT cl.*, hc.full_name AS hr_name, u.full_name AS caller_name
      FROM call_logs cl
      JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
      JOIN users u ON cl.caller_id = u.user_id
      WHERE cl.log_id = $1;
    `;
    const result = await pool.query(query, [log_id]);
    return result.rows[0];
  },

  // Update a log
  async updateLog(log_id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key}=$${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) return null;

    const query = `
      UPDATE call_logs
      SET ${fields.join(", ")}
      WHERE log_id=$${idx}
      RETURNING *;
    `;
    values.push(log_id);

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete a log
    async deleteLog(log_id) {
        const query = `
        DELETE FROM call_logs
        WHERE log_id = $1
        RETURNING *;
        `;
        const result = await pool.query(query, [log_id]);
        return result.rows[0];
    }

};

export default CallLog;

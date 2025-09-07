import pool from '../config/postgredb.js'


export default {
  // CREATE a new HR contact
async createHRContact(contact) {
  const {
    full_name,
    company_id,
    designation,
    email,
    phone_1,
    phone_2,
    linkedin_profile,
    source,
    status = 'active',
    notes,
    added_by_user_id,
    assigned_to_user_id,
    is_approved = false,
  } = contact;

  const query = `
    WITH inserted AS (
      INSERT INTO hr_contacts
        (full_name, company_id, designation, email, phone_1, phone_2, linkedin_profile, source, status, notes, added_by_user_id, assigned_to_user_id, is_approved)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    )
    SELECT i.*, c.company_name
    FROM inserted i
    LEFT JOIN companies c ON i.company_id = c.company_id;
  `;

  const values = [
    full_name,
    company_id,
    designation,
    email,
    phone_1,
    phone_2,
    linkedin_profile,
    source,
    status,
    notes,
    added_by_user_id,
    assigned_to_user_id,
    is_approved,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
},

  // READ all HR contacts (with added_by and assigned_to user names)
async getAllHRContacts() {
  const query = `
    SELECT 
      hc.*,
      u1.full_name AS added_by_user_name,
      u2.full_name AS assigned_to_user_name
    FROM hr_contacts hc
    LEFT JOIN users u1 ON hc.added_by_user_id = u1.user_id
    LEFT JOIN users u2 ON hc.assigned_to_user_id = u2.user_id
    ORDER BY hc.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
},

  // READ one HR contact by ID (with user names)
async getHRContactById(contact_id) {
  const query = `
    SELECT 
      hc.*,
      u1.full_name AS added_by_user_name,
      u2.full_name AS assigned_to_user_name
    FROM hr_contacts hc
    LEFT JOIN users u1 ON hc.added_by_user_id = u1.user_id
    LEFT JOIN users u2 ON hc.assigned_to_user_id = u2.user_id
    WHERE hc.contact_id = $1
  `;

  const result = await pool.query(query, [contact_id]);
  return result.rows[0];
},

  // UPDATE an HR contact by ID
  async updateHRContact(contact_id, contact) {
    const {
      full_name,
      company_id,
      designation,
      email,
      phone_1,
      phone_2,
      linkedin_profile,
      source,
      status,
      notes,
      assigned_to_user_id,
      is_approved,
    } = contact;

    const result = await pool.query(
      `UPDATE hr_contacts
       SET full_name=$1, company_id=$2, designation=$3, email=$4, phone_1=$5, phone_2=$6, linkedin_profile=$7, source=$8, status=$9, notes=$10, assigned_to_user_id=$11, is_approved=$12, updated_at=NOW()
       WHERE contact_id=$13
       RETURNING *`,
      [
        full_name,
        company_id,
        designation,
        email,
        phone_1,
        phone_2,
        linkedin_profile,
        source,
        status,
        notes,
        assigned_to_user_id,
        is_approved,
        contact_id,
      ]
    );

    return result.rows[0];
  },





async assignCallerToHR(contact_id, assigned_to_user_id) {
  const query = `
    UPDATE hr_contacts
    SET assigned_to_user_id = $1, updated_at = NOW()
    WHERE contact_id = $2
    RETURNING *`;

  const values = [assigned_to_user_id, contact_id];
  const result = await pool.query(query, values);
  return result.rows[0];
},





  // DELETE an HR contact by ID
  async deleteHRContact(contact_id) {
    const result = await pool.query(
      `DELETE FROM hr_contacts WHERE contact_id=$1 RETURNING *`,
      [contact_id]
    );
    return result.rows[0];
  },
};

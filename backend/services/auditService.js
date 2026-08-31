import AuditLog from '../models/AuditLog.js';

export const logAction = async ({ actor, action, targetTicket, details }) => {
  try {
    await AuditLog.create({
      actor,
      action,
      targetTicket,
      details: details || {}
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

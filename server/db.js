import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_AUDIT_LOGS } from '../src/data/demoScenarios.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data_store.json');

export class Database {
  constructor() {
    this.ensureDataFile();
  }

  ensureDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = {
        auditLogs: INITIAL_AUDIT_LOGS,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
  }

  getData() {
    try {
      this.ensureDataFile();
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed reading data file:', err);
      return { auditLogs: INITIAL_AUDIT_LOGS };
    }
  }

  saveData(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Failed saving data file:', err);
    }
  }

  getAuditLogs() {
    const data = this.getData();
    return data.auditLogs || [];
  }

  addAuditRecord(record) {
    const data = this.getData();
    data.auditLogs = [record, ...(data.auditLogs || [])];
    this.saveData(data);
    return record;
  }

  updateHumanReview(recordId, reviewData) {
    const data = this.getData();
    const logs = data.auditLogs || [];
    const index = logs.findIndex(r => r.id === recordId);

    if (index !== -1) {
      logs[index].humanReview = {
        ...reviewData,
        timestamp: new Date().toISOString()
      };
      data.auditLogs = logs;
      this.saveData(data);
      return logs[index];
    }
    return null;
  }

  resetDemoData() {
    const data = {
      auditLogs: INITIAL_AUDIT_LOGS,
      lastUpdated: new Date().toISOString()
    };
    this.saveData(data);
    return data.auditLogs;
  }
}

export const db = new Database();

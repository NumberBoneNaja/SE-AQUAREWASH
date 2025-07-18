export interface HistoryInterface {
    machine_id: number;
    action: string;
    timestamp: string;
    changes?: string | Record<string, { old: any; new: any }>;
  }
  
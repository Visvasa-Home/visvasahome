type DemoOTPCallback = (data: { otp: string; method: string; phoneNumber: string }) => void;
type DemoLogCallback = (log: { id: string; type: 'sms' | 'whatsapp' | 'payment' | 'system'; text: string; timestamp: Date }) => void;

class DemoEventBusClass {
  private otpListeners: Set<DemoOTPCallback> = new Set();
  private logListeners: Set<DemoLogCallback> = new Set();
  private logs: Array<{ id: string; type: 'sms' | 'whatsapp' | 'payment' | 'system'; text: string; timestamp: Date }> = [];
  private latestOtp: { otp: string; method: string; phoneNumber: string } | null = null;

  subscribeOtp(callback: DemoOTPCallback) {
    this.otpListeners.add(callback);
    return () => this.otpListeners.delete(callback);
  }

  subscribeLogs(callback: DemoLogCallback) {
    this.logListeners.add(callback);
    return () => this.logListeners.delete(callback);
  }

  emitOtp(otp: string, method: string, phoneNumber: string) {
    this.latestOtp = { otp, method, phoneNumber };
    this.otpListeners.forEach(cb => cb({ otp, method, phoneNumber }));
    this.addLog(method as 'sms' | 'whatsapp', `Generated OTP: ${otp} for phone ${phoneNumber}`);
  }

  addLog(type: 'sms' | 'whatsapp' | 'payment' | 'system', text: string) {
    const log = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
      timestamp: new Date()
    };
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs.pop(); // limit log size
    this.logListeners.forEach(cb => cb(log));
  }

  getLogs() {
    return this.logs;
  }

  getLatestOtp() {
    return this.latestOtp;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const DemoEventBus = new DemoEventBusClass();

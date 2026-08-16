import axiosInstance from '../../../core/api/axiosInstance';

export interface IssueQRPayload {
  ticket_unit_id: string;
  order_id: string;
  event_id: string;
}

export interface IssueQRResponse {
  qr_content: string;
}

export interface ScanQRPayload {
  qr_content: string;
}

export interface ScanQRResponse {
  ticket_unit_id: string;
  event_id: string;
}

export const checkinApi = {
  issueTicketQR: (payload: IssueQRPayload) =>
    axiosInstance.post<IssueQRResponse>('/api/v1/checkin/issue', payload).then((r) => r.data),

  scanTicketQR: (payload: ScanQRPayload) =>
    axiosInstance.post<ScanQRResponse>('/api/v1/checkin/scan', payload).then((r) => r.data),
};

import type { 
  GenerateIconsRequest, 
  GenerateIconsResponse, 
  GeneratedIcon,
  ApiError,
  PresetStyleId
} from '../types';

const API_BASE_URL = '/api';

export class ApiRequestError extends Error {
  statusCode: number;
  details?: ApiError;

  constructor(message: string, statusCode: number, details?: ApiError) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function generateIcons(
  request: GenerateIconsRequest
): Promise<GenerateIconsResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiRequestError(
      data.error || 'Failed to generate icons',
      response.status,
      data
    );
  }

  return data as GenerateIconsResponse;
}

export async function regenerateIcon(
  subject: string,
  presetStyle: PresetStyleId,
  color: string,
  index: number
): Promise<GeneratedIcon> {
  const response = await fetch(`${API_BASE_URL}/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, presetStyle, color, index }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiRequestError(
      data.error || 'Failed to regenerate icon',
      response.status,
      data
    );
  }

  return data.icon as GeneratedIcon;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

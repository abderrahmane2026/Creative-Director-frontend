const API_URL = process.env.REACT_APP_API_URL;

// ── Works ──
export const getAllWorks = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_URL}/works${params ? '?' + params : ''}`);
  return res.json();
};

export const getWorkById = async (id) => {
  const res = await fetch(`${API_URL}/works/${id}`);
  return res.json();
};

export const rateWork = async (id, value) => {
  const res = await fetch(`${API_URL}/works/${id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  return res.json();
};

// ── Bookings ──
export const createBooking = async (bookingData) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  return res.json();
};
// ── Clients ──
export const getClients = async () => {
  const res = await fetch(`${API_URL}/clients`);
  return res.json();
};
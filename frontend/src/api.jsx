const BASE_URL = "http://127.0.0.1:8000/api";

// Header de autenticación
const getAuthHeader = (token) => {
  return {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json"
  };
};

// ---------------------- BEVERAGES ----------------------

export const getBeverages = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/beverages/`, {
      headers: getAuthHeader(token)
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getBeverages:", err);
    return [];
  }
};

export const createBeverage = async (token, beverageData) => {
  try {
    const res = await fetch(`${BASE_URL}/beverages/`, {
      method: "POST",
      headers: getAuthHeader(token),
      body: JSON.stringify(beverageData)
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("createBeverage:", err);
    return null;
  }
};

export const updateBeverage = async (token, id, beverageData) => {
  try {
    const res = await fetch(`${BASE_URL}/beverages/${id}/`, {
      method: "PUT",
      headers: getAuthHeader(token),
      body: JSON.stringify(beverageData)
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("updateBeverage:", err);
    return null;
  }
};

export const deleteBeverage = async (token, id) => {
  try {
    const res = await fetch(`${BASE_URL}/beverages/${id}/`, {
      method: "DELETE",
      headers: getAuthHeader(token)
    });
    return res.ok;
  } catch (err) {
    console.error("deleteBeverage:", err);
    return false;
  }
};

// ---------------------- CLEANERS ----------------------

export const getCleaners = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/cleaners/`, {
      headers: getAuthHeader(token)
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getCleaners:", err);
    return [];
  }
};

export const createCleaner = async (token, cleanerData) => {
  try {
    const res = await fetch(`${BASE_URL}/cleaners/`, {
      method: "POST",
      headers: getAuthHeader(token),
      body: JSON.stringify(cleanerData)
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("createCleaner:", err);
    return null;
  }
};

export const updateCleaner = async (token, id, cleanerData) => {
  try {
    const res = await fetch(`${BASE_URL}/cleaners/${id}/`, {
      method: "PUT",
      headers: getAuthHeader(token),
      body: JSON.stringify(cleanerData)
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("updateCleaner:", err);
    return null;
  }
};

export const deleteCleaner = async (token, id) => {
  try {
    const res = await fetch(`${BASE_URL}/cleaners/${id}/`, {
      method: "DELETE",
      headers: getAuthHeader(token)
    });
    return res.ok;
  } catch (err) {
    console.error("deleteCleaner:", err);
    return false;
  }
};

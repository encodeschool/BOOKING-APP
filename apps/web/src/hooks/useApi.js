import { useState, useEffect } from "react";
import { apiClient } from "../lib/api";

export function useBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await apiClient.getBusinesses();
        setBusinesses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return { businesses, loading, error };
}

export function useServices(businessId) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId) return;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getServices(businessId);
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [businessId]);

  return { services, loading, error };
}

export function useStaff(businessId) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId) return;

    const fetchStaff = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getStaff(businessId);
        setStaff(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [businessId]);

  return { staff, loading, error };
}

export function useAvailableSlots(businessId, serviceId, date) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId || !serviceId || !date) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getAvailableSlots(businessId, serviceId, date);
        setSlots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [businessId, serviceId, date]);

  return { slots, loading, error };
}

export function useAvailableDates(businessId, serviceId, staffId) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId || !serviceId) return;

    const fetchDates = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getAvailableDates(businessId, serviceId, staffId);
        setDates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [businessId, serviceId, staffId]);

  return { dates, loading, error };
}
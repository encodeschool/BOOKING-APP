import { useEffect, useState } from "react";
import {
  API_BASE_URL,
  createBusiness,
  createService,
  createStaff,
  getBusinesses,
  getBusinessBookings,
  getProfile,
  getServices,
  getStaff,
  getWorkingHours,
  login,
  saveWorkingHours,
  updateBookingStatus,
} from "./lib/api";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const BOOKING_ACTIONS = {
  PENDING: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
};

const EMPTY_HOURS = DAYS.reduce((acc, day) => {
  acc[day] = {
    dayOfWeek: day,
    startTime: "09:00",
    endTime: "18:00",
    isClosed: false,
  };
  return acc;
}, {});

function formatLabel(text) {
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^|\s)\w/g, (letter) => letter.toUpperCase());
}

function statValue(bookings, status) {
  return bookings.filter((item) => item.status === status).length;
}

function toTimeInput(value) {
  return value ? value.slice(0, 5) : "";
}

function findName(items, id, fallback) {
  const match = items.find((item) => item.id === id);
  return match?.name || fallback;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("admin-token") || "");
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [workingHours, setWorkingHours] = useState(EMPTY_HOURS);
  const [authForm, setAuthForm] = useState({
    email: "ergashev.nurik12@gmail.com",
    password: "",
  });
  const [businessForm, setBusinessForm] = useState({ name: "", address: "", phone: "" });
  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    description: "",
  });
  const [staffForm, setStaffForm] = useState({ name: "", role: "", phone: "" });
  const [statusReason, setStatusReason] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedBusiness = businesses.find((item) => String(item.id) === String(selectedBusinessId)) || null;
  const serviceName = (id) => findName(services, id, `Service #${id}`);
  const staffName = (id) => findName(staff, id, `Staff #${id}`);

  useEffect(() => {
    if (!token) {
      return;
    }
    bootstrap(token);
  }, [token]);

  async function bootstrap(activeToken) {
    try {
      setLoading(true);
      setError("");
      const [profileResponse, businessResponse] = await Promise.all([
        getProfile(activeToken),
        getBusinesses(activeToken),
      ]);

      setProfile(profileResponse);
      setBusinesses(businessResponse);

      if (businessResponse.length > 0) {
        const nextBusinessId = String(businessResponse[0].id);
        setSelectedBusinessId(nextBusinessId);
        await loadBusinessContext(activeToken, nextBusinessId);
      } else {
        resetBusinessContext();
      }
    } catch (err) {
      setError(err.message);
      localStorage.removeItem("admin-token");
      setToken("");
    } finally {
      setLoading(false);
    }
  }

  async function loadBusinessContext(activeToken, businessId) {
    if (!businessId) {
      resetBusinessContext();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [servicesResponse, staffResponse, workingHoursResponse, bookingsResponse] = await Promise.all([
        getServices(activeToken, businessId),
        getStaff(activeToken, businessId),
        getWorkingHours(activeToken, businessId),
        getBusinessBookings(activeToken, businessId),
      ]);

      setServices(servicesResponse);
      setStaff(staffResponse);
      setBookings(bookingsResponse);
      hydrateWorkingHours(workingHoursResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetBusinessContext() {
    setServices([]);
    setStaff([]);
    setBookings([]);
    setWorkingHours(EMPTY_HOURS);
  }

  function hydrateWorkingHours(items) {
    const next = JSON.parse(JSON.stringify(EMPTY_HOURS));
    items.forEach((item) => {
      next[item.dayOfWeek] = {
        dayOfWeek: item.dayOfWeek,
        startTime: toTimeInput(item.startTime),
        endTime: toTimeInput(item.endTime),
        isClosed: item.closed ?? item.isClosed ?? false,
      };
    });
    setWorkingHours(next);
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await login(authForm);
      localStorage.setItem("admin-token", response.token);
      setToken(response.token);
      setMessage(`Signed in as ${response.email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBusiness(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const created = await createBusiness(token, businessForm);
      const nextBusinesses = [...businesses, created];
      setBusinesses(nextBusinesses);
      setBusinessForm({ name: "", address: "", phone: "" });
      setSelectedBusinessId(String(created.id));
      await loadBusinessContext(token, created.id);
      setMessage(`Business "${created.name}" created`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateService(event) {
    event.preventDefault();
    if (!selectedBusinessId) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const created = await createService(token, {
        ...serviceForm,
        businessId: Number(selectedBusinessId),
        price: Number(serviceForm.price),
        durationMinutes: Number(serviceForm.durationMinutes),
      });
      setServices((current) => [...current, created]);
      setServiceForm({ name: "", price: "", durationMinutes: "", description: "" });
      setMessage(`Service "${created.name}" created`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStaff(event) {
    event.preventDefault();
    if (!selectedBusinessId) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const created = await createStaff(token, {
        ...staffForm,
        businessId: Number(selectedBusinessId),
      });
      setStaff((current) => [...current, created]);
      setStaffForm({ name: "", role: "", phone: "" });
      setMessage(`Staff member "${created.name}" created`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveWorkingDay(dayOfWeek) {
    if (!selectedBusinessId) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await saveWorkingHours(token, {
        businessId: Number(selectedBusinessId),
        ...workingHours[dayOfWeek],
      });
      setMessage(`${formatLabel(dayOfWeek)} hours saved`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBookingStatus(bookingId, status) {
    try {
      setLoading(true);
      setError("");
      const updated = await updateBookingStatus(token, bookingId, {
        status,
        reason: statusReason[bookingId] || "",
      });
      setBookings((current) =>
        current.map((item) => (item.id === bookingId ? updated : item)),
      );
      setMessage(`Booking #${bookingId} moved to ${formatLabel(status)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin-token");
    setToken("");
    setProfile(null);
    setBusinesses([]);
    setSelectedBusinessId("");
    resetBusinessContext();
    setMessage("");
    setError("");
  }

  if (!token) {
    return (
      <div className="min-h-screen px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-4xl border border-white/50 bg-shell/80 p-8 shadow-panel backdrop-blur md:p-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-ember">Owner Console</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Run the entire booking operation from one responsive admin surface.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Sign in through the gateway, manage your business inventory, adjust working hours,
              and move bookings from pending to completed without leaving this screen.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Gateway", API_BASE_URL],
                ["Domain", "Businesses, staff, services, bookings"],
                ["Viewport", "Mobile-first responsive layout"],
              ].map(([title, value]) => (
                <div key={title} className="rounded-3xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{title}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-4xl border border-ink/10 bg-ink p-8 text-white shadow-panel md:p-10">
            <h2 className="text-2xl font-semibold">Sign In</h2>
            <p className="mt-2 text-sm text-slate-300">
              Use a business-owner account that can already access the backend through the gateway.
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <Field
                label="Email"
                value={authForm.email}
                onChange={(value) => setAuthForm((current) => ({ ...current, email: value }))}
                placeholder="owner@example.com"
              />
              <Field
                label="Password"
                type="password"
                value={authForm.password}
                onChange={(value) => setAuthForm((current) => ({ ...current, password: value }))}
                placeholder="Enter password"
              />
              {error ? <Banner tone="error" text={error} /> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-ember px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Enter Admin"}
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-4xl border border-white/40 bg-shell/80 p-5 shadow-panel backdrop-blur md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ember">Booking Platform Admin</p>
              <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Business operations cockpit</h1>
              <p className="mt-2 text-sm text-slate-600">
                Signed in as {profile?.email || "unknown"}{profile?.role ? ` • ${profile.role}` : ""}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={selectedBusinessId}
                onChange={async (event) => {
                  const nextId = event.target.value;
                  setSelectedBusinessId(nextId);
                  await loadBusinessContext(token, nextId);
                }}
                className="rounded-full border border-sand bg-white px-4 py-3 text-sm text-ink"
              >
                <option value="">Select business</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-ink/20 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white/70"
              >
                Log out
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <MetricCard label="Businesses" value={businesses.length} accent="text-ember" />
            <MetricCard label="Pending bookings" value={statValue(bookings, "PENDING")} accent="text-amber-700" />
            <MetricCard label="Confirmed" value={statValue(bookings, "CONFIRMED")} accent="text-pine" />
            <MetricCard label="Completed" value={statValue(bookings, "COMPLETED")} accent="text-slate-700" />
          </div>
        </header>

        {error ? <Banner tone="error" text={error} className="mb-4" /> : null}
        {message ? <Banner tone="success" text={message} className="mb-4" /> : null}
        {loading ? <Banner tone="success" text="Syncing with backend..." className="mb-4" /> : null}

        <main className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Panel
              title="Create Business"
              subtitle="Add the first business or expand your portfolio."
            >
              <form className="grid gap-3" onSubmit={handleCreateBusiness}>
                <Field
                  label="Business name"
                  value={businessForm.name}
                  onChange={(value) => setBusinessForm((current) => ({ ...current, name: value }))}
                />
                <Field
                  label="Address"
                  value={businessForm.address}
                  onChange={(value) => setBusinessForm((current) => ({ ...current, address: value }))}
                />
                <Field
                  label="Phone"
                  value={businessForm.phone}
                  onChange={(value) => setBusinessForm((current) => ({ ...current, phone: value }))}
                />
                <ActionButton disabled={loading}>Create business</ActionButton>
              </form>
            </Panel>

            <Panel
              title="Services"
              subtitle={selectedBusiness ? `Linked to ${selectedBusiness.name}` : "Select a business first."}
            >
              <form className="grid gap-3" onSubmit={handleCreateService}>
                <Field
                  label="Service name"
                  value={serviceForm.name}
                  onChange={(value) => setServiceForm((current) => ({ ...current, name: value }))}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Price"
                    type="number"
                    value={serviceForm.price}
                    onChange={(value) => setServiceForm((current) => ({ ...current, price: value }))}
                  />
                  <Field
                    label="Duration (minutes)"
                    type="number"
                    value={serviceForm.durationMinutes}
                    onChange={(value) => setServiceForm((current) => ({ ...current, durationMinutes: value }))}
                  />
                </div>
                <Field
                  label="Description"
                  value={serviceForm.description}
                  onChange={(value) => setServiceForm((current) => ({ ...current, description: value }))}
                />
                <ActionButton disabled={!selectedBusinessId || loading}>Create service</ActionButton>
              </form>
              <SimpleList
                emptyText="No services yet."
                items={services}
                renderItem={(service) => (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-ink">{service.name}</p>
                      <p className="text-sm text-slate-500">
                        {service.durationMinutes} min • ${service.price}
                      </p>
                    </div>
                    <StatusPill tone={service.active ? "green" : "gray"}>
                      {service.active ? "Active" : "Inactive"}
                    </StatusPill>
                  </div>
                )}
              />
            </Panel>

            <Panel
              title="Staff"
              subtitle={selectedBusiness ? "Assign bookable team members." : "Select a business first."}
            >
              <form className="grid gap-3" onSubmit={handleCreateStaff}>
                <Field
                  label="Staff name"
                  value={staffForm.name}
                  onChange={(value) => setStaffForm((current) => ({ ...current, name: value }))}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Role"
                    value={staffForm.role}
                    onChange={(value) => setStaffForm((current) => ({ ...current, role: value }))}
                  />
                  <Field
                    label="Phone"
                    value={staffForm.phone}
                    onChange={(value) => setStaffForm((current) => ({ ...current, phone: value }))}
                  />
                </div>
                <ActionButton disabled={!selectedBusinessId || loading}>Create staff member</ActionButton>
              </form>
              <SimpleList
                emptyText="No staff yet."
                items={staff}
                renderItem={(member) => (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-ink">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.role || "General"} • {member.phone || "No phone"}</p>
                    </div>
                    <StatusPill tone={member.active ? "green" : "gray"}>
                      {member.active ? "Active" : "Inactive"}
                    </StatusPill>
                  </div>
                )}
              />
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel
              title="Working Hours"
              subtitle={selectedBusiness ? "Save each day individually after changes." : "Select a business first."}
            >
              <div className="grid gap-3">
                {DAYS.map((day) => (
                  <div key={day} className="rounded-3xl border border-sand/70 bg-white/70 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-40">
                        <p className="font-semibold text-ink">{formatLabel(day)}</p>
                        <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={workingHours[day].isClosed}
                            onChange={(event) =>
                              setWorkingHours((current) => ({
                                ...current,
                                [day]: {
                                  ...current[day],
                                  isClosed: event.target.checked,
                                },
                              }))
                            }
                          />
                          Closed
                        </label>
                      </div>
                      <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <Field
                          label="Start"
                          type="time"
                          value={workingHours[day].startTime}
                          disabled={workingHours[day].isClosed}
                          onChange={(value) =>
                            setWorkingHours((current) => ({
                              ...current,
                              [day]: { ...current[day], startTime: value },
                            }))
                          }
                        />
                        <Field
                          label="End"
                          type="time"
                          value={workingHours[day].endTime}
                          disabled={workingHours[day].isClosed}
                          onChange={(value) =>
                            setWorkingHours((current) => ({
                              ...current,
                              [day]: { ...current[day], endTime: value },
                            }))
                          }
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!selectedBusinessId || loading}
                        onClick={() => handleSaveWorkingDay(day)}
                        className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Bookings"
              subtitle={selectedBusiness ? "Review requests and move them through the booking lifecycle." : "Select a business first."}
            >
              {bookings.length === 0 ? (
                <p className="text-sm text-slate-500">No bookings found for the selected business.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <article key={booking.id} className="rounded-3xl border border-sand/70 bg-white/80 p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold text-ink">Booking #{booking.id}</p>
                            <StatusPill tone={booking.status === "PENDING" ? "amber" : booking.status === "CONFIRMED" ? "green" : "gray"}>
                              {formatLabel(booking.status)}
                            </StatusPill>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            Client #{booking.clientId} • {staffName(booking.staffId)} • {serviceName(booking.serviceId)}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {booking.bookingDate} • {booking.startTime} - {booking.endTime}
                          </p>
                          {booking.notes ? <p className="mt-2 text-sm text-slate-500">Notes: {booking.notes}</p> : null}
                          {booking.statusReason ? (
                            <p className="mt-1 text-sm text-slate-500">Reason: {booking.statusReason}</p>
                          ) : null}
                        </div>
                        <div className="w-full max-w-sm space-y-3">
                          <Field
                            label="Status reason"
                            value={statusReason[booking.id] || ""}
                            onChange={(value) =>
                              setStatusReason((current) => ({
                                ...current,
                                [booking.id]: value,
                              }))
                            }
                            placeholder="Optional explanation"
                          />
                          <div className="flex flex-wrap gap-2">
                            {(BOOKING_ACTIONS[booking.status] || []).map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleBookingStatus(booking.id, status)}
                                className="rounded-full border border-ink/10 bg-shell px-3 py-2 text-sm font-semibold text-ink transition hover:bg-sand/50"
                              >
                                {formatLabel(status)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </main>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-4xl border border-white/50 bg-shell/80 p-5 shadow-panel backdrop-blur md:p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled = false }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-600">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-sand bg-white px-4 py-3 text-ink outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20 disabled:cursor-not-allowed disabled:bg-stone-100"
      />
    </label>
  );
}

function Banner({ text, tone, className = "" }) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass} ${className}`}>{text}</div>;
}

function MetricCard({ label, value, accent }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

function StatusPill({ children, tone }) {
  const toneClass = {
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    gray: "bg-slate-100 text-slate-600",
  }[tone];

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}

function SimpleList({ items, emptyText, renderItem }) {
  if (items.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-3xl border border-sand/70 bg-white/80 p-4">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

function ActionButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export default App;

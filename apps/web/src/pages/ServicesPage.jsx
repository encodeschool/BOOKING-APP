import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, MapPin, Clock, Star } from "lucide-react";
import { useBusinesses, useServices } from "../hooks/useApi";
import ImageCarousel from "../components/ImageCarousel";

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { businesses, loading: businessesLoading } = useBusinesses();
  const { services, loading: servicesLoading } = useServices(selectedBusiness?.id);

  useEffect(() => {
    const businessId = searchParams.get("business");
    if (businessId && businesses.length > 0) {
      const business = businesses.find((b) => b.id === parseInt(businessId));
      setSelectedBusiness(business || null);
    }
  }, [searchParams, businesses]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBusinessChange = (business) => {
    setSelectedBusiness(business);
    setSearchParams(business ? { business: business.id } : {});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Our Services</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Discover services made for you</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Browse by business, search by service name, and book with confidence across our partner network.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr] items-start">
          <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Choose a business</h2>
              <p className="mt-2 text-sm text-slate-500">Filter services by partner business.</p>
            </div>
            <div>
              {businessesLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-500">
                  <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                </div>
              ) : (
                <select
                  value={selectedBusiness?.id || ""}
                  onChange={(e) => {
                    const business = businesses.find((b) => b.id === parseInt(e.target.value));
                    handleBusinessChange(business);
                  }}
                  className="input-field"
                >
                  <option value="">All Businesses</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Why book here?</h3>
              <ul className="mt-4 space-y-3 text-slate-600 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />
                  Real-time availability for your convenience.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />
                  Verified partners for trusted service quality.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" />
                  Secure booking with easy confirmation.
                </li>
              </ul>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {selectedBusiness && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{selectedBusiness.name}</h2>
                    <p className="mt-2 text-slate-600">{selectedBusiness.description}</p>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <MapPin className="h-4 w-4" />
                    {selectedBusiness.address || "Address unavailable"}
                  </div>
                </div>
              </div>
            )}

            {servicesLoading ? (
              <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
                <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                Loading services...
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <div key={service.id} className="card">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.name}</h3>
                    <p className="text-slate-600 mb-5">{service.description}</p>
                    <div className="flex items-center justify-between text-slate-900 font-semibold">
                      <span>${service.price}</span>
                      <span className="text-sm text-slate-500">{service.duration} min</span>
                    </div>
                    <Link to="/booking" className="btn-secondary mt-5 inline-flex w-full justify-center">
                      Book now
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow-sm">
                No services found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

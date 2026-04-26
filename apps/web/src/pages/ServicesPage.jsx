import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Clock, Star } from "lucide-react";
import { useBusinesses, useServices } from "../hooks/useApi";

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { businesses, loading: businessesLoading } = useBusinesses();
  const { services, loading: servicesLoading } = useServices(selectedBusiness?.id);

  useEffect(() => {
    const businessId = searchParams.get("business");
    if (businessId && businesses.length > 0) {
      const business = businesses.find(b => b.id === parseInt(businessId));
      setSelectedBusiness(business);
    }
  }, [searchParams, businesses]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBusinessChange = (business) => {
    setSelectedBusiness(business);
    setSearchParams(business ? { business: business.id } : {});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">
            Discover and book from a wide range of services offered by our partner businesses.
          </p>
        </div>

        {/* Business Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a Business
          </label>
          {businessesLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          ) : (
            <select
              value={selectedBusiness?.id || ""}
              onChange={(e) => {
                const business = businesses.find(b => b.id === parseInt(e.target.value));
                handleBusinessChange(business);
              }}
              className="input-field max-w-md"
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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        {selectedBusiness ? (
          <div>
            {/* Business Info */}
            <div className="card mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBusiness.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedBusiness.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedBusiness.address}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedBusiness.workingHours}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-600">4.5</span>
                  </div>
                  <span className="text-sm text-gray-500">{selectedBusiness.category}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            {servicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div key={service.id} className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ${service.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.duration} min
                      </span>
                    </div>
                    <button className="w-full btn-primary mt-4">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No services found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Select a Business
            </h3>
            <p className="text-gray-600">
              Choose a business from the dropdown above to view their available services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
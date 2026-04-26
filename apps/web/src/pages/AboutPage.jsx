import { Users, Target, Award, Heart } from "lucide-react";

const AboutPage = () => {
  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Partner Businesses" },
    { number: "50+", label: "Cities Covered" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do, ensuring the best possible experience.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously improve our platform to make booking easier and more convenient.",
    },
    {
      icon: Award,
      title: "Quality",
      description: "We partner only with verified, high-quality businesses that meet our standards.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "We build strong relationships with our partners and customers to create lasting value.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Emily Davis",
      role: "Head of Operations",
      image: "/api/placeholder/150/150",
    },
    {
      name: "David Wilson",
      role: "Customer Success Manager",
      image: "/api/placeholder/150/150",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About BookEase
          </h1>
          <p className="text-xl md:text-2xl text-primary-100">
            Revolutionizing the way people book appointments with local businesses.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At BookEase, we believe that booking appointments should be simple, fast, and stress-free.
            We're on a mission to connect customers with the best local businesses while empowering
            businesses to grow their customer base through our innovative platform.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              BookEase was born from a simple frustration: booking appointments with local businesses
              was unnecessarily complicated. Long phone calls, confusing websites, and missed appointments
              were the norm. Our founders experienced this firsthand and decided to create a better way.
            </p>

            <p>
              In 2020, we launched BookEase with a vision to make appointment booking as simple as ordering
              food online. Today, we're proud to serve thousands of customers and hundreds of businesses
              across multiple cities, making the booking experience seamless for everyone involved.
            </p>

            <p>
              We're just getting started. Our commitment to innovation and customer satisfaction drives
              us to continuously improve our platform and expand our services to meet the evolving needs
              of our community.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              The passionate people behind BookEase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Whether you're a customer looking for great services or a business ready to grow,
            BookEase is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/booking" className="btn-secondary">
              Book Now
            </a>
            <a href="/contact" className="btn-secondary">
              Partner With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
'use client';

import { Button, Card } from '@/ui/design-system/components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';

export default function Home() {
  const router = useRouter();
  
  // AI Assistant for tour functionality
  const { initialize, startWorkflow } = useAIAssistant();
  
  const handleStartTourAndNavigate = () => {
    // Navigate to appointments page first
    router.push('/appointments');
    // Small delay to ensure page navigation, then start tour
    setTimeout(() => {
      initialize();
      startWorkflow('appointment_booking_tour');
    }, 500);
  };
  
  const serviceCategories = [
    {
      title: "Family Medicine",
      icon: "/icons/family-medicine.svg",
      description: "Comprehensive care for the entire family from birth and beyond.",
      href: "/services/family-medicine"
    },
    {
      title: "Pediatric Medicine",
      icon: "/icons/pediatric.svg",
      description: "Specialized care for children and adolescents.",
      href: "/services/pediatric-medicine"
    },
    {
      title: "Women's Health",
      icon: "/icons/womens-health.svg",
      description: "Comprehensive care addressing women's unique health needs.",
      href: "/services/womens-health"
    },
    {
      title: "Chiropractic",
      icon: "/icons/chiropractic.svg",
      description: "Non-surgical treatments for neck, back and joint pain.",
      href: "/services/chiropractic"
    },
    {
      title: "Podiatry",
      icon: "/icons/podiatry.svg",
      description: "Specialized care for feet and ankle conditions.",
      href: "/services/podiatry"
    },
    {
      title: "Dental",
      icon: "/icons/dental.svg",
      description: "Complete oral healthcare for adults and children.",
      href: "/services/dental"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Healthcare Made Simple
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-50">
                Schedule appointments, complete intake forms, and manage referrals all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="secondary" 
                    size="large"
                    onClick={() => router.push('/appointments')}
                    className="w-full sm:w-auto"
                  >
                    Schedule Now
                  </Button>
                  <button
                    onClick={handleStartTourAndNavigate}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-50 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 relative group"
                    aria-label="Take appointment booking tour"
                  >
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Take Guided Tour
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => router.push('/intake?patientId=demopatient123')}
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10"
                >
                  Patient Intake
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-2 rounded-lg shadow-xl">
                <Image
                  src="/images/Hero_image.jpg"
                  alt="Healthcare professional with patient"
                  width={600}
                  height={450}
                  className="rounded-md"
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QjxAOEA4Qi5AOTc5PkFDQUFBQUFBQUFBQUFBQUH/2wBDAR0XFyAeIBokHiA6LjpBO0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-4">Our Services</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Premier Healthcare offers a wide range of medical services to meet your family's needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {serviceCategories.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                onClick={() => router.push(service.href)}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-50 rounded-full">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={32}
                    height={32}
                    priority={index < 6} // Prioritize loading for visible icons
                    sizes="32px"
                    quality={90}
                  />
                </div>
                <h3 className="text-lg font-medium text-primary-700 mb-2">{service.title}</h3>
                <p className="text-sm text-neutral-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-3">Our Platform</div>
              <h2 className="text-2xl md:text-4xl font-bold text-primary-800 mb-4">
                Streamlined Healthcare Platform
              </h2>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Our digital platform makes managing your healthcare simple and efficient
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card
                className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-xl overflow-hidden border-0 shadow-lg"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-3 text-center">Patient Scheduling</h3>
                <p className="text-neutral-600 mb-6 text-center">
                  Find the perfect appointment time with your preferred provider. Our
                  scheduling system makes it easy to find and book appointments.
                </p>
                <div className="flex justify-center items-center gap-2 mt-auto">
                  <Button 
                    variant="primary" 
                    onClick={() => router.push('/appointments')}
                    rightIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Schedule Now
                  </Button>
                  <button
                    onClick={handleStartTourAndNavigate}
                    className="bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-md px-3 py-2 transition-all duration-300 relative group"
                    aria-label="Take appointment booking tour"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Take Guided Tour
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                </div>
              </Card>

              <Card 
                className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-xl overflow-hidden border-0 shadow-lg"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary-500"></div>
                <div className="flex justify-center mb-6">
                  <div className="bg-secondary-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-secondary-700 mb-3 text-center">Patient Intake Forms</h3>
                <p className="text-neutral-600 mb-6 text-center">
                  Complete your registration and intake forms online before your appointment.
                  Save time and reduce paperwork during your visit.
                </p>
                <div className="flex justify-center mt-auto">
                  <Button 
                    variant="secondary"
                    onClick={() => router.push('/intake?patientId=demopatient123')}
                    rightIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Start Intake
                  </Button>
                </div>
              </Card>

              <Card 
                className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-xl overflow-hidden border-0 shadow-lg"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-accent-500"></div>
                <div className="flex justify-center mb-6">
                  <div className="bg-accent-100 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-accent-700 mb-3 text-center">Referral Management</h3>
                <p className="text-neutral-600 mb-6 text-center">
                  Easily track and manage your referrals to specialists. Stay informed
                  at every step of the referral process.
                </p>
                <div className="flex justify-center mt-auto">
                  <Button 
                    variant="outline"
                    className="bg-white text-accent-600 border-accent-500 hover:bg-accent-50"
                    onClick={() => router.push('/referrals')}
                    rightIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Manage Referrals
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="text-center">
              <Button 
                variant="text"
                size="large"
                onClick={() => router.push('/services')}
                rightIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                }
              >
                Explore All Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We're proud to provide exceptional care to our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The online scheduling made it so easy to book my appointment. I was in and out quickly with great care!",
                name: "Sarah T.",
                role: "Patient since 2020"
              },
              {
                quote: "Being able to fill out forms beforehand saved so much time. The doctors are caring and really listen.",
                name: "Michael R.",
                role: "Patient since 2018"
              },
              {
                quote: "When I needed a specialist, the referral process was seamless. I'm so grateful for the coordination of care.",
                name: "Jennifer M.",
                role: "Patient since 2021"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-primary-700">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary-50 to-primary-100 border-y border-primary-200">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-sm border border-neutral-100">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-700">Ready to experience better healthcare?</h2>
            <p className="text-lg mb-8 text-neutral-600 max-w-2xl mx-auto">
              Join thousands of patients who trust Premier Healthcare for their medical needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={() => router.push('/appointments')}
                  className="w-full sm:w-auto"
                >
                  Schedule an Appointment
                </Button>
                <button
                  onClick={handleStartTourAndNavigate}
                  className="bg-primary-100 hover:bg-primary-200 text-primary-700 border border-primary-300 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 relative group"
                  aria-label="Take appointment booking tour"
                >
                  <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Take Guided Tour
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </button>
              </div>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => router.push('/contact')}
                className="w-full sm:w-auto border-primary-500 text-primary-700 hover:bg-primary-50"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-8 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-500 mb-4">
            Need assistance? Contact our support team
          </p>
          <Button 
            variant="outline"
            onClick={() => router.push('/help')}
          >
            Contact Support
          </Button>
        </div>
      </section>
    </div>
  );
}
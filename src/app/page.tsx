'use client';

import { Button, Card } from '@/ui/design-system/components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  
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
      href: "/services/pediatric"
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
                <Button 
                  variant="secondary" 
                  size="large"
                  onClick={() => router.push('/appointments')}
                  className="w-full sm:w-auto"
                >
                  Schedule Now
                </Button>
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
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-4">
                Streamlined Healthcare Platform
              </h2>
              <p className="text-lg text-neutral-600">
                Our digital platform makes managing your healthcare simple and efficient
              </p>
            </div>

            <div className="grid gap-8 mb-12">
              <Card
                title="Patient Scheduling"
                className="transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-primary-500"
              >
                <p className="text-neutral-600 mb-4">
                  Find the perfect appointment time with your preferred provider. Our
                  scheduling system makes it easy to find and book appointments.
                </p>
                <div className="flex justify-end">
                  <Button 
                    variant="primary" 
                    onClick={() => router.push('/appointments')}
                  >
                    Schedule Now
                  </Button>
                </div>
              </Card>

              <Card 
                title="Patient Intake Forms" 
                className="transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-secondary-500"
              >
                <p className="text-neutral-600 mb-4">
                  Complete your registration and intake forms online before your appointment.
                  Save time and reduce paperwork during your visit.
                </p>
                <div className="flex justify-end">
                  <Button 
                    variant="primary"
                    onClick={() => router.push('/intake?patientId=demopatient123')}
                  >
                    Start Intake
                  </Button>
                </div>
              </Card>

              <Card 
                title="Referral Management" 
                className="transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-accent-500"
              >
                <p className="text-neutral-600 mb-4">
                  Easily track and manage your referrals to specialists. Stay informed
                  at every step of the referral process.
                </p>
                <div className="flex justify-end">
                  <Button 
                    variant="primary"
                    onClick={() => router.push('/referrals')}
                  >
                    Manage Referrals
                  </Button>
                </div>
              </Card>
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
      <section className="py-12 md:py-16 bg-gradient-to-br from-accent-500 to-accent-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience better healthcare?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust Premier Healthcare for their medical needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => router.push('/appointments')}
              className="w-full sm:w-auto"
            >
              Schedule an Appointment
            </Button>
            <Button 
              variant="outline" 
              size="large"
              onClick={() => router.push('/contact')}
              className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10"
            >
              Contact Us
            </Button>
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
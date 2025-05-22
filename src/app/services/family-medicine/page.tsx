import Image from 'next/image';
import Link from 'next/link';

export default function FamilyMedicinePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[600px] w-full">
        <Image
          src="/images/family_medicne.jpg"
          alt="Family Medicine"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg text-white">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Family Medicine</h1>
              <p className="text-xl md:text-2xl">Comprehensive care for your entire family</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Comprehensive Family Healthcare</h2>
          <p className="mb-6 text-lg text-gray-700">
            Our family medicine practice provides continuous, comprehensive healthcare for individuals and families across all ages,
            genders, and types of diseases. We focus on building lasting relationships with our patients to better understand their
            health needs and provide personalized care.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive Care</h3>
              <p className="text-gray-700">Regular check-ups, screenings, and immunizations to keep your family healthy</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Chronic Disease Management</h3>
              <p className="text-gray-700">Ongoing care and management of conditions like diabetes, hypertension, and asthma</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Acute Care</h3>
              <p className="text-gray-700">Treatment for immediate health concerns, illnesses, and injuries</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Our Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Primary Care Services</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Annual physical examinations</li>
                <li>Vaccinations and immunizations</li>
                <li>Health screenings and lab tests</li>
                <li>Women's and men's health services</li>
                <li>Pediatric care</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Specialized Care</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Diabetes management</li>
                <li>Hypertension treatment</li>
                <li>Weight management</li>
                <li>Mental health services</li>
                <li>Geriatric care</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-blue-900 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Schedule Your Visit Today</h2>
          <p className="mb-6 text-lg">
            Take the first step towards better health for you and your family.
          </p>
          <Link 
            href="/appointments"
            className="inline-block rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-900 transition hover:bg-blue-50"
          >
            Book an Appointment
          </Link>
        </section>
      </div>
    </main>
  );
}
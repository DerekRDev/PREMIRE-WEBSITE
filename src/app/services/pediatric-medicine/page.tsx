import Image from 'next/image';
import Link from 'next/link';

export default function PediatricMedicinePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[600px] w-full">
        <Image
          src="/images/pediatrics.jpg"
          alt="Pediatric Medicine"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute inset-0 flex items-start justify-center pt-16 md:pt-24">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Pediatric Medicine</h1>
            <p className="text-xl md:text-2xl">Specialized healthcare for children and adolescents</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Expert Pediatric Care</h2>
          <p className="mb-6 text-lg text-gray-700">
            Our pediatric medicine department provides comprehensive healthcare services for infants, children, and adolescents.
            We create a friendly, comfortable environment where children can receive the medical attention they need while feeling
            safe and supported.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Well-Child Visits</h3>
              <p className="text-gray-700">Regular check-ups to monitor growth, development, and overall health</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Vaccinations</h3>
              <p className="text-gray-700">Complete immunization services following recommended schedules</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Behavioral Health</h3>
              <p className="text-gray-700">Support for developmental, behavioral, and mental health concerns</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Our Pediatric Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive Care</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Growth and development monitoring</li>
                <li>Childhood immunizations</li>
                <li>Vision and hearing screenings</li>
                <li>Nutrition counseling</li>
                <li>School and sports physicals</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Medical Care</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Acute illness treatment</li>
                <li>Chronic condition management</li>
                <li>Asthma and allergy care</li>
                <li>Developmental assessments</li>
                <li>Emergency care coordination</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16 rounded-xl bg-blue-50 p-8">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Why Choose Our Pediatric Care?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Child-Friendly Environment</h3>
                  <p className="text-gray-700">Welcoming spaces designed to make children comfortable</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Experienced Specialists</h3>
                  <p className="text-gray-700">Board-certified pediatricians with years of experience</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Comprehensive Care</h3>
                  <p className="text-gray-700">Complete healthcare services from birth through adolescence</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Family-Centered Approach</h3>
                  <p className="text-gray-700">Involving parents in every step of their child's care</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-blue-900 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Schedule Your Child's Visit</h2>
          <p className="mb-6 text-lg">
            Give your child the best start in life with quality pediatric care.
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
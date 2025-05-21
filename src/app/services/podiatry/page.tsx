import Image from 'next/image';
import Link from 'next/link';

export default function PodiatryPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[600px] w-full">
        <Image
          src="/images/podiatry.jpg"
          alt="Podiatry Care"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Podiatry</h1>
            <p className="text-xl md:text-2xl">Specialized care for foot and ankle conditions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Expert Foot & Ankle Care</h2>
          <p className="mb-6 text-lg text-gray-700">
            Our podiatry department provides comprehensive care for all foot and ankle conditions. From routine
            check-ups to complex surgical procedures, our experienced podiatrists are dedicated to keeping you
            mobile and pain-free.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Diagnostic Services</h3>
              <p className="text-gray-700">Advanced imaging and assessment techniques</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Treatment Options</h3>
              <p className="text-gray-700">Conservative and surgical solutions available</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive Care</h3>
              <p className="text-gray-700">Education and maintenance for long-term foot health</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Our Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">General Podiatry</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Routine foot care</li>
                <li>Nail disorders</li>
                <li>Corn and callus treatment</li>
                <li>Diabetic foot care</li>
                <li>Foot pain management</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Specialized Treatment</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Sports injuries</li>
                <li>Orthotics and bracing</li>
                <li>Wound care</li>
                <li>Surgical procedures</li>
                <li>Gait analysis</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conditions We Treat Section */}
        <section className="mb-16 rounded-xl bg-blue-50 p-8">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Conditions We Treat</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Common Conditions</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Plantar fasciitis</li>
                <li>Bunions</li>
                <li>Heel spurs</li>
                <li>Ingrown toenails</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Injuries</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Ankle sprains</li>
                <li>Sports injuries</li>
                <li>Fractures</li>
                <li>Tendonitis</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Special Care</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Diabetic foot care</li>
                <li>Arthritis</li>
                <li>Nerve conditions</li>
                <li>Circulation problems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Why Choose Our Podiatry Services?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Expert Care Team</h3>
                  <p className="text-gray-700">Board-certified podiatrists with extensive experience</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Advanced Technology</h3>
                  <p className="text-gray-700">State-of-the-art diagnostic and treatment equipment</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Comprehensive Care</h3>
                  <p className="text-gray-700">Full range of podiatric services under one roof</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Patient Education</h3>
                  <p className="text-gray-700">Detailed guidance for ongoing foot health</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-blue-900 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Take the First Step</h2>
          <p className="mb-6 text-lg">
            Don't let foot or ankle problems hold you back. Schedule your consultation today.
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
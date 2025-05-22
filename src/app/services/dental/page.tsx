import Image from 'next/image';
import Link from 'next/link';

export default function DentalPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[600px] w-full">
        <Image
          src="/images/dental.jpg"
          alt="Dental Care"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute inset-0 flex items-start justify-start pt-16 md:pt-24">
          <div className="container mx-auto px-8 text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Dental Care</h1>
            <p className="text-xl md:text-2xl">Complete oral healthcare for adults and children</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Comprehensive Dental Services</h2>
          <p className="mb-6 text-lg text-gray-700">
            Our dental department provides complete oral healthcare services for the whole family. From routine
            check-ups to advanced dental procedures, our experienced team ensures optimal oral health using
            state-of-the-art technology and gentle, patient-focused care.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive Care</h3>
              <p className="text-gray-700">Regular cleanings and examinations to maintain oral health</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Restorative Services</h3>
              <p className="text-gray-700">Advanced treatments to repair and enhance your smile</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Cosmetic Dentistry</h3>
              <p className="text-gray-700">Procedures to improve the appearance of your smile</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Our Dental Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">General Dentistry</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Routine cleanings and exams</li>
                <li>Fluoride treatments</li>
                <li>Dental sealants</li>
                <li>Fillings and crowns</li>
                <li>Root canal therapy</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Specialized Care</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Teeth whitening</li>
                <li>Dental implants</li>
                <li>Orthodontics</li>
                <li>Periodontal treatment</li>
                <li>Emergency dental care</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Treatment Categories Section */}
        <section className="mb-16 rounded-xl bg-blue-50 p-8">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Treatment Categories</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Regular check-ups</li>
                <li>Professional cleanings</li>
                <li>Oral cancer screenings</li>
                <li>Digital X-rays</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Restorative</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Dental crowns</li>
                <li>Bridges and implants</li>
                <li>Dentures</li>
                <li>Tooth-colored fillings</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Cosmetic</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Teeth whitening</li>
                <li>Veneers</li>
                <li>Bonding</li>
                <li>Smile makeovers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Why Choose Our Dental Services?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Modern Technology</h3>
                  <p className="text-gray-700">State-of-the-art equipment for precise, comfortable care</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Experienced Team</h3>
                  <p className="text-gray-700">Skilled dentists and staff with years of experience</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Comfortable Environment</h3>
                  <p className="text-gray-700">Relaxing atmosphere with patient comfort in mind</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Comprehensive Care</h3>
                  <p className="text-gray-700">All your dental needs addressed in one location</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-blue-900 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Schedule Your Dental Visit</h2>
          <p className="mb-6 text-lg">
            Take the first step toward a healthier, brighter smile today.
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
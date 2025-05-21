import Image from 'next/image';
import Link from 'next/link';

export default function WomensHealthPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[600px] w-full">
        <Image
          src="/images/womans_health.jpg"
          alt="Women's Health"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Women's Health</h1>
            <p className="text-xl md:text-2xl">Comprehensive care for every stage of life</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Specialized Women's Healthcare</h2>
          <p className="mb-6 text-lg text-gray-700">
            Our women's health department provides comprehensive, personalized care addressing the unique health needs of women
            at every life stage. From preventive care to specialized treatments, our experienced healthcare providers are
            committed to supporting your health and wellness journey.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive Care</h3>
              <p className="text-gray-700">Regular screenings, wellness exams, and health education</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Reproductive Health</h3>
              <p className="text-gray-700">Comprehensive reproductive and sexual health services</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Specialized Care</h3>
              <p className="text-gray-700">Treatment for women-specific health conditions</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Our Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Preventive Healthcare</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Annual wellness exams</li>
                <li>Cancer screenings</li>
                <li>Bone density testing</li>
                <li>Mammography referrals</li>
                <li>Preventive health counseling</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Reproductive Health</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Family planning services</li>
                <li>Pregnancy care and counseling</li>
                <li>Menopause management</li>
                <li>STI testing and treatment</li>
                <li>Fertility counseling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Life Stages Section */}
        <section className="mb-16 rounded-xl bg-blue-50 p-8">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Care Through Every Stage</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">Young Adult Care</h3>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Preventive healthcare</li>
                  <li>Reproductive health</li>
                  <li>Sexual health education</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">Adult Women's Health</h3>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Family planning</li>
                  <li>Pregnancy care</li>
                  <li>Preventive screenings</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">Mature Women's Care</h3>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>Menopause management</li>
                  <li>Bone health</li>
                  <li>Preventive care</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Why Choose Our Women's Health Services?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Expert Care Team</h3>
                  <p className="text-gray-700">Experienced healthcare providers specialized in women's health</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Comprehensive Services</h3>
                  <p className="text-gray-700">Complete range of women's health services under one roof</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Personalized Approach</h3>
                  <p className="text-gray-700">Care plans tailored to your individual needs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Comfortable Environment</h3>
                  <p className="text-gray-700">Private, welcoming spaces for your comfort</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-blue-900 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Take Charge of Your Health</h2>
          <p className="mb-6 text-lg">
            Schedule your appointment today and experience comprehensive women's healthcare.
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
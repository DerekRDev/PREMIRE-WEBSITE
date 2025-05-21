import Image from 'next/image';
import Link from 'next/link';

export default function ChiropracticPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[600px] w-full">
        <Image
          src="/images/chiro.jpg"
          alt="Chiropractic Care"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Chiropractic Care</h1>
            <p className="text-xl md:text-2xl">Natural, non-surgical solutions for pain relief and wellness</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Expert Chiropractic Care</h2>
          <p className="mb-6 text-lg text-gray-700">
            Our chiropractic department specializes in diagnosing and treating musculoskeletal system disorders,
            particularly those affecting the spine. Using hands-on spinal manipulation and other alternative treatments,
            we help restore mobility and alleviate pain without surgery or medication.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Pain Management</h3>
              <p className="text-gray-700">Natural relief from back, neck, and joint pain</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Spinal Alignment</h3>
              <p className="text-gray-700">Corrective techniques for proper spinal alignment</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Wellness Care</h3>
              <p className="text-gray-700">Preventive care for long-term health maintenance</p>
            </div>
          </div>
        </section>

        {/* Treatment Options Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Treatment Options</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Spinal Manipulation</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Manual adjustment techniques</li>
                <li>Flexion-distraction therapy</li>
                <li>Instrument-assisted manipulation</li>
                <li>Specific spinal adjustments</li>
                <li>Gentle mobilization</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Additional Therapies</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Therapeutic exercises</li>
                <li>Soft tissue therapy</li>
                <li>Electric stimulation</li>
                <li>Ultrasound therapy</li>
                <li>Heat and ice therapy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conditions We Treat Section */}
        <section className="mb-16 rounded-xl bg-blue-50 p-8">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Conditions We Treat</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Back & Neck Pain</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Lower back pain</li>
                <li>Upper back pain</li>
                <li>Neck strain</li>
                <li>Herniated discs</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Joint Issues</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Shoulder pain</li>
                <li>Hip problems</li>
                <li>Knee pain</li>
                <li>Arthritis</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-blue-900">Other Conditions</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Headaches</li>
                <li>Sciatica</li>
                <li>Sports injuries</li>
                <li>Work-related injuries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-900">Benefits of Chiropractic Care</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Natural Healing</h3>
                  <p className="text-gray-700">Drug-free approach to pain management and wellness</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Improved Mobility</h3>
                  <p className="text-gray-700">Enhanced range of motion and flexibility</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Preventive Care</h3>
                  <p className="text-gray-700">Maintain spine health and prevent future issues</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-900 p-2 text-white">✓</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Personalized Treatment</h3>
                  <p className="text-gray-700">Customized care plans for your specific needs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-blue-900 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Start Your Path to Wellness</h2>
          <p className="mb-6 text-lg">
            Experience natural pain relief and improved mobility with our expert chiropractic care.
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
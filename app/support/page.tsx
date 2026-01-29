import Link from 'next/link'

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Support</h1>
      <p className="text-lg mb-6">If you have any questions or need assistance, please reach out to us or explore our resources below.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Us Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold">Email Us</h2>
          <p className="text-gray-600">support@listcart.ai</p>
        </div>
        {/* FAQ Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <Link href="/faq" className="text-blue-600 hover:underline">Visit our FAQ page</Link>
        </div>
        {/* Report a Bug Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold">Report a Bug</h2>
          <Link href="https://github.com/your-repo/issues" className="text-blue-600 hover:underline">Report an issue on GitHub</Link>
        </div>
      </div>
    </div>
  );
}

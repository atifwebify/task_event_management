import Link from "next/link";
import { CalendarCheck, Filter, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-800">EventHub</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Simplify Your Event Management
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Organize, schedule, and manage all your events in one place. Whether
              it&apos;s online or in-person, EventHub makes event management effortless.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition text-center"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition text-center"
              >
                Existing User? Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Event Creation</h3>
              <p className="text-gray-600">
                Quickly create events with all the details you need, including
                online or in-person options.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CalendarCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                Avoid conflicts with our intelligent scheduling that prevents
                overlapping events.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
              <p className="text-gray-600">
                Find exactly what you need with powerful search and filtering
                options.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Event Management?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their events
            effortlessly with EventHub.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold">EventHub</span>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
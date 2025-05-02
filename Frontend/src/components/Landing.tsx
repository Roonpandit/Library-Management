import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Users,
  Clock,
  Bell,
  BarChart3,
  FileText,
  Download,
  Check,
  Menu,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "University Student",
    comment:
      "BookNest has transformed how I access library resources. The interface is intuitive and finding books has never been easier!",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Library Administrator",
    comment:
      "As an admin, BookNest gives me all the tools I need to manage our collection efficiently. The analytics are particularly helpful.",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Professor",
    comment:
      "I recommend BookNest to all my students. The notification system ensures they never miss return dates.",
    avatar: "/api/placeholder/40/40",
  },
];

const features = [
  {
    id: 1,
    title: "Extensive Book Catalog",
    description:
      "Browse through our comprehensive collection with powerful search and filter options.",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "User-Friendly Borrowing",
    description:
      "Borrow books with just a few clicks and manage all your loans in one place.",
    icon: Users,
  },
  {
    id: 3,
    title: "Smart Notifications",
    description:
      "Stay informed with timely alerts about due dates and library announcements.",
    icon: Bell,
  },
  {
    id: 4,
    title: "Detailed Analytics",
    description: "Access comprehensive reports and insights (admin only).",
    icon: BarChart3,
  },
  {
    id: 5,
    title: "Automated Billing",
    description: "Receive clear, itemized bills when returning books.",
    icon: FileText,
  },
  {
    id: 6,
    title: "PDF Downloads",
    description: "Download professional receipts and reports for your records.",
    icon: Download,
  },
];

const faqItems = [
  {
    question: "How do I register for BookNest?",
    answer:
      "Registration is simple! Click on the 'Register' button, fill in your details (name, email, password), and you'll be ready to start using BookNest immediately.",
  },
  {
    question: "What is the standard borrowing period?",
    answer:
      "The default borrowing period is 14 days, but you can select a shorter period if needed when checking out a book.",
  },
  {
    question: "Are there late fees for overdue books?",
    answer:
      "Yes, late fees apply to overdue books. You'll receive notifications before your due date to help you avoid these charges.",
  },
  {
    question: "Can I reserve books that are currently borrowed?",
    answer:
      "Currently, the reservation feature is under development and will be available in the next update.",
  },
  {
    question: "How do I access the admin dashboard?",
    answer:
      "Admin access is restricted to authorized personnel. If you're an administrator, you'll use special credentials provided by your system manager.",
  },
];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      featuresRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
      }
    );

    featureCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      }
    });

    gsap.fromTo(
      statsRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      testimonialsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const setFeatureCardRef = (el: HTMLDivElement | null, index: number) => {
    featureCardsRef.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      <nav className="bg-white shadow-md">
        <div className="fixed top-0 left-0 w-full z-50 bg-white  mx-auto px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-800" />
                <span
                  className="ml-2 text-3xl font-bold text-blue-800"
                  style={{ fontFamily: "Times New Roman, serif" }}
                >
                  BookNest
                </span>{" "}
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a
                  href="#features"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Testimonials
                </a>
                <a
                  href="#faq"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  FAQ
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <a
                href="https://library-management-six-livid.vercel.app/login"
                className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
              >
                Log in
              </a>
              <a
                href="https://library-management-six-livid.vercel.app/register"
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                style={{ borderRadius: "10px" }}
              >
                Register
              </a>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="fixed right-0 top-0 h-full bg-white shadow-2xl p-6 space-y-8 transform transition-transform duration-300 ease-in-out animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3 text-lg">
                {[
                  { href: "#features", label: "Features" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "#testimonials", label: "Testimonials" },
                  { href: "#faq", label: "FAQ" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block py-2 px-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 text-gray-800 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-5 space-y-4">
                <a
                  href="https://library-management-six-livid.vercel.app/login"
                  className="block w-full text-center py-2 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </a>
                <a
                  href="https://library-management-six-livid.vercel.app/register"
                  className="block w-full text-center py-2 rounded-[10px] bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative bg-white overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl font-['Times_New_Roman']">
                  <span className="block xl:inline text-7xl">
                    Modern Library
                  </span>{" "}
                  <span className="block text-blue-600 xl:inline text-5xl">
                    Management System
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Streamline your library operations with BookNest. Browse
                  books, manage borrowing, and access powerful administrative
                  tools all in one elegant platform.
                </p>
                <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
                  <button
                    onClick={() =>
                      (window.location.href =
                        "https://library-management-six-livid.vercel.app/login")
                    }
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-base md:text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Get Started
                  </button>

                  <button
                    onClick={() =>
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-base md:text-lg font-semibold shadow-sm hover:bg-blue-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg"
            alt="Library interior with books"
          />
        </div>
      </div>

      <div id="features" className="py-12 bg-white">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          ref={featuresRef}
        >
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-4xl leading-[1.35] font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:mx-auto font-['Times_New_Roman']">
              {" "}
              Everything You Need for Modern Library Management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              BookNest provides a comprehensive suite of tools for users and
              administrators to effectively manage library resources.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  ref={(el) => setFeatureCardRef(el, index)}
                  className="rounded-[10px] p-6 shadow-md transition-transform transform hover:scale-105 duration-300"
                >
                  <div className="flex items-center justify-center h-12 w-12 text-blue-600 mb-4 transition-transform transform hover:scale-110 duration-300">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" py-12" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-700 rounded-[10px] p-6">
              <div className="text-4xl font-bold text-white">10,000+</div>
              <div className="mt-2 text-lg text-blue-100">Books Available</div>
            </div>
            <div className="bg-blue-700 rounded-[10px] p-6">
              <div className="text-4xl font-bold text-white">5,000+</div>
              <div className="mt-2 text-lg text-blue-100">Active Users</div>
            </div>
            <div className="bg-blue-700 rounded-[10px] p-6">
              <div className="text-4xl font-bold text-white">99.9%</div>
              <div className="mt-2 text-lg text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Process
            </h2>
            <p className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-4xl font-['Times_New_Roman']">
              {" "}
              How it Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              A simple and intuitive process for book borrowing and management
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

            <div className="space-y-12 md:space-y-0">
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center mb-12">
                <div className="md:text-right md:pr-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Registration & Login
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Create your account or login to access the BookNest system.
                    Your personal dashboard will be ready immediately.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pl-8">
                  <div className="bg-white p-6 rounded-[10px] shadow-md ">
                    <img
                      src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                      alt="Registration screen"
                      className="rounded-[10px] transition-transform transform hover:scale-105 duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center mb-12">
                <div className="md:order-last md:text-left md:pl-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Browse & Select Books
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Browse through our extensive catalog with powerful filters.
                    Find your next great read with ease.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pr-8">
                  <div className="bg-white p-6 rounded-[10px] shadow-md">
                    <img
                      src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg"
                      alt="Book browsing screen"
                      className="rounded-[10px] transition-transform transform hover:scale-105 duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center mb-12">
                <div className="md:text-right md:pr-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Borrow & Return
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Borrow books with a few clicks and return them when you're
                    done. Automated notifications keep you informed of due
                    dates.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pl-8">
                  <div className="bg-white p-6 rounded-[10px] shadow-md">
                    <img
                      src="https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg"
                      alt="Borrowing screen"
                      className="rounded-[10px] transition-transform transform hover:scale-105 duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:order-last md:text-left md:pl-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Manage & Track
                  </h3>
                  <p className="mt-2 text-gray-600">
                    View your borrowing history, download receipts, and manage
                    your account all from one dashboard.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pr-8">
                  <div className="bg-white p-6 rounded-[10px] shadow-md">
                    <img
                      src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg"
                      alt="Dashboard screen"
                      className="rounded-[10px] transition-transform transform hover:scale-105 duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="testimonials" className="py-16 bg-white" ref={testimonialsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-['Times_New_Roman']">
              Users Review
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 p-6 rounded-[10px] shadow-md transition-transform transform hover:scale-105 hover:bg-gray-100 duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                    alt={testimonial.name}
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">
              For Administrators
            </h2>
            <p className="mt-2 text-5xl leading-[1] font-extrabold sm:text-4xl font-['Times_New_Roman']">
              Powerful Management Tools
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              BookNest provides comprehensive tools for library administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-[10px]">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-blue-400" />
                Book Management
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Add, edit, and remove books from your catalog</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Upload cover images and detailed book information</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Manage book categories and availability</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-700 p-6 rounded-[10px]">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-400" />
                User Management
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>View and manage user accounts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Block/unblock users as needed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>View user borrowing history and status</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-700 p-6 rounded-[10px]">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-400" />
                Borrow Management
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Track all active, returned, and overdue borrows</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Process returns and manage late fees</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Send reminders to users with overdue books</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-700 p-6 rounded-[10px]">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
                Reports & Analytics
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>View comprehensive dashboard with key metrics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Generate usage reports and borrowing statistics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Export data for external analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="faq" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              FAQ
            </h2>
            <p className="mt-2 text-5xl leading-[1] font-extrabold tracking-tight text-gray-900 sm:text-4xl font-['Times_New_Roman']">
              Frequently Asked Questions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Find answers to the most common questions about BookNest
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            {faqItems.map((item, index) => (
              <div key={index} className="py-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-start justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {item.question}
                  </span>
                  <span className="ml-6 flex-shrink-0">
                    {openFAQ === index ? (
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="mt-2 pr-12">
                    <p className="text-base text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Comparison
            </h2>
            <p className="mt-2 text-5xl leading-[1] font-extrabold tracking-tight text-gray-900 sm:text-4xl font-['Times_New_Roman']">
              Why Choose BookNest?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              See how BookNest compares to traditional library systems
            </p>
          </div>

          <div className="mt-12 space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-blue-300 transition-transform transform hover:scale-105 duration-300 mt-8">
              {" "}
              <div className="px-6 py-8 ">
                <h3 className="text-xl font-medium text-gray-900 text-center">
                  Traditional Systems
                </h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">Paper-based tracking</p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">
                      Manual notification system
                    </p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">
                      Limited search capabilities
                    </p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">No mobile access</p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">
                      Lacks analytics & insights
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-blue-500 rounded-2xl shadow-xl text-white transition-transform transform hover:scale-105 duration-300">
              <div className="px-6 py-8">
                <h3 className="text-xl font-medium text-center">BookNest</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-blue-50">
                      Fully digital management
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-blue-50">Automated notifications</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-blue-50">
                      Advanced search & filters
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-blue-50">
                      Mobile responsive design
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-blue-50">Comprehensive analytics</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-blue-300 transition-transform transform hover:scale-105 duration-300">
              {" "}
              <div className="px-6 py-8">
                <h3 className="text-xl font-medium text-gray-900 text-center">
                  Basic Digital Systems
                </h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">Digital tracking</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">
                      Basic notification system
                    </p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">
                      Limited search capabilities
                    </p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">Poor mobile experience</p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-500">Basic reporting only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">
                  BookNest
                </span>
              </div>
              <p className="text-gray-400">
                Simplifying library management for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-white"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@booknest.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-2 pt-4 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} BookNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

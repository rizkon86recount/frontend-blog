import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Section Header */}
        <section className="text-center py-16 px-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-white">
            About Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Learn more about our journey, values, and the mission behind Haltev
            Blog.
          </p>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            At Haltev Blog, our goal is to provide insightful articles on
            technology, trends, and educational content. We aim to create a
            platform where readers can find valuable information that helps them
            grow both personally and professionally.
          </p>

          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mt-8">
            Our Story
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Founded by passionate individuals, Haltev Blog started as a small
            initiative to share knowledge. Over the years, we’ve grown into a
            trusted resource for tech enthusiasts, students, and lifelong
            learners.
          </p>
        </section>
      </div>
    </>
  );
}

export default About;

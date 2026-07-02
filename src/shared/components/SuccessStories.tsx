import { ArrowLeft, Star, Quote, TrendingUp, Award } from 'lucide-react';

interface SuccessStoriesProps {
  onBack: () => void;
  onRegister: () => void;
}

const stories = [
  {
    name: 'Rajesh Kumar',
    profession: 'Electrician',
    location: 'Delhi',
    image: '👨‍🔧',
    rating: 4.9,
    jobs: 450,
    story: 'I was working odd jobs with no stable income. VisvasaHome gave me a platform to showcase my skills. Now I have regular customers who trust me and my monthly income has tripled.',
    before: '₹15,000/month',
    after: '₹45,000/month',
    timeframe: '8 months'
  },
  {
    name: 'Priya Sharma',
    profession: 'Home Cleaning Professional',
    location: 'Bangalore',
    image: '👩‍💼',
    rating: 4.8,
    jobs: 380,
    story: 'As a single mother, I needed flexible work. VisvasaHome not only provided me work but also trained me in professional cleaning standards. I now have 20+ repeat customers.',
    before: '₹12,000/month',
    after: '₹35,000/month',
    timeframe: '6 months'
  },
  {
    name: 'Amit Patel',
    profession: 'AC Repair Technician',
    location: 'Mumbai',
    image: '👨‍🔧',
    rating: 5.0,
    jobs: 520,
    story: 'I had the skills but no way to reach customers. VisvasaHome connected me with customers who value quality. I went from working for a company to running my own service business.',
    before: '₹20,000/month',
    after: '₹65,000/month',
    timeframe: '1 year'
  },
  {
    name: 'Sunita Devi',
    profession: 'Cook & Meal Prep Specialist',
    location: 'Pune',
    image: '👩‍🍳',
    rating: 4.9,
    jobs: 290,
    story: 'I love cooking and wanted to turn it into a career. VisvasaHome gave me the platform and the training. Now I cook for multiple families and earn with dignity.',
    before: '₹10,000/month',
    after: '₹28,000/month',
    timeframe: '5 months'
  },
  {
    name: 'Vikram Singh',
    profession: 'Plumber',
    location: 'Jaipur',
    image: '👨‍🔧',
    rating: 4.8,
    jobs: 410,
    story: 'After 15 years of experience, I was still struggling with inconsistent work. VisvasaHome changed that. The local area focus means I have customers in my neighborhood.',
    before: '₹18,000/month',
    after: '₹50,000/month',
    timeframe: '7 months'
  },
  {
    name: 'Meena Reddy',
    profession: 'Beauty & Salon Services',
    location: 'Hyderabad',
    image: '💆‍♀️',
    rating: 5.0,
    jobs: 340,
    story: 'I started with basic beauty services at home. VisvasaHome helped me get professional training and certifications. Now I offer premium services and have built my brand.',
    before: '₹14,000/month',
    after: '₹42,000/month',
    timeframe: '9 months'
  }
];

export function SuccessStories({ onBack, onRegister }: SuccessStoriesProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-6">Success Stories</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Real professionals. Real transformations. Real success.
            <br />
            See how VisvasaHome is changing lives across India.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2 text-[#2563EB]">5000+</div>
              <p className="text-gray-600">Active Professionals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-[#2563EB]">2.5x</div>
              <p className="text-gray-600">Average Income Growth</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-[#2563EB]">4.8</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-[#2563EB]">95%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Professional Transformations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From struggling to thriving - these are the stories of professionals who found their path with VisvasaHome
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{story.image}</div>
                  <div className="flex-1">
                    <h3 className="mb-1">{story.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{story.profession}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">📍 {story.location}</span>
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        {story.rating}
                      </span>
                      <span className="text-gray-500">{story.jobs} jobs</span>
                    </div>
                  </div>
                </div>

                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-blue-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 pl-6 italic">"{story.story}"</p>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Before</p>
                    <p className="text-sm text-gray-700">{story.before}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">After</p>
                    <p className="text-sm text-[#2563EB]">{story.after}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="text-sm text-gray-700">{story.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Themes */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">What Makes Them Successful?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common traits among our top performers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="mb-3">Quality First</h3>
              <p className="text-gray-600">
                They never compromise on service quality. Every job is done with care and professionalism.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="mb-3">Customer Relationships</h3>
              <p className="text-gray-600">
                They build trust with customers through honest communication and reliable service.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="mb-3">Continuous Learning</h3>
              <p className="text-gray-600">
                They take advantage of training programs and constantly improve their skills.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">In Their Own Words</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch video testimonials from our professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ramesh', profession: 'Carpenter', duration: '2:45' },
              { name: 'Kavita', profession: 'Housekeeper', duration: '3:10' },
              { name: 'Suresh', profession: 'Painter', duration: '2:30' }
            ].map((video, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="w-0 h-0 border-l-8 border-l-white border-y-6 border-y-transparent ml-1"></div>
                    </div>
                    <p className="text-sm">{video.duration}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="mb-1">{video.name}</h4>
                  <p className="text-sm text-gray-600">{video.profession}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recognition */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Recognition & Awards</h2>
            <p className="text-xl text-gray-300">
              Celebrating our top professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="mb-2">Professional of the Month</h4>
              <p className="text-sm text-gray-300">Monthly recognition program</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="mb-2">5-Star Excellence</h4>
              <p className="text-sm text-gray-300">Consistent quality ratings</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="mb-2">Growth Champion</h4>
              <p className="text-sm text-gray-300">Fastest growing professionals</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="mb-2">Community Leader</h4>
              <p className="text-sm text-gray-300">Helping fellow professionals</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who transformed their careers with VisvasaHome
          </p>
          <button 
            onClick={onRegister}
            className="px-8 py-4 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </div>
  );
}

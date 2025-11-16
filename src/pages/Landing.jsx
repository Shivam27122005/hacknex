import React from 'react'
import { Link } from 'react-router-dom'
import { Code, Zap, Trophy, Users, ArrowRight, CheckCircle, Star, Terminal, BookOpen, Target } from 'lucide-react'

const Landing = () => {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "500+ Problems",
      description: "From easy to advanced, covering all major algorithms and data structures"
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Online Code Editor",
      description: "Write, test, and submit solutions in multiple programming languages"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your growth with detailed stats and performance analytics"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Global Leaderboard",
      description: "Compete with developers worldwide and climb the ranks"
    }
  ]

  const stats = [
    { value: "500+", label: "Problems" },
    { value: "50K+", label: "Developers" },
    { value: "1M+", label: "Submissions" },
    { value: "24/7", label: "Support" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer @ Google",
      content: "Hack'nhex helped me land my dream job. The problems are well-structured and mirror real interview questions.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      content: "The best coding platform I've used. Clean interface, challenging problems, and excellent learning resources.",
      avatar: "MR"
    },
    {
      name: "Priya Sharma",
      role: "CS Student @ MIT",
      content: "Perfect for competitive programming practice. The leaderboard keeps me motivated to solve more problems daily.",
      avatar: "PS"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Hack'nhex</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Join 50,000+ developers worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Master Coding
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Through Practice
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Sharpen your programming skills with curated coding challenges. 
              Practice, learn, and compete with developers from around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/50"
              >
                <span>Start Coding Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/problems"
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-slate-700"
              >
                Explore Problems
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-slate-400 text-lg">
              Powerful features designed for serious developers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Editor Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Professional Code Editor
              </h2>
              <p className="text-slate-400 text-lg">
                Write clean code with our feature-rich online IDE. Syntax highlighting, 
                autocomplete, and instant execution in multiple languages.
              </p>
              <ul className="space-y-4">
                {[
                  'Support for 10+ programming languages',
                  'Real-time code execution and testing',
                  'Detailed test case feedback',
                  'Performance metrics and optimization tips'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-slate-800 px-4 py-3 flex items-center space-x-2 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400 text-sm ml-2">solution.js</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-purple-400">function</div>
                <div className="text-blue-400 ml-4">twoSum(nums, target) {'{'}</div>
                <div className="text-slate-500 ml-8">// Your solution here</div>
                <div className="text-green-400 ml-8">const map = new Map();</div>
                <div className="text-blue-400 ml-8">for (let i = 0; i &lt; nums.length; i++) {'{'}</div>
                <div className="text-yellow-400 ml-12">const complement = target - nums[i];</div>
                <div className="text-pink-400 ml-12">if (map.has(complement)) {'{'}</div>
                <div className="text-orange-400 ml-16">return [map.get(complement), i];</div>
                <div className="text-pink-400 ml-12">{'}'}</div>
                <div className="text-green-400 ml-12">map.set(nums[i], i);</div>
                <div className="text-blue-400 ml-8">{'}'}</div>
                <div className="text-blue-400 ml-4">{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-slate-400 text-lg">
              See what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-slate-300">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Level Up Your Skills?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of developers already improving their coding skills on Hack'nhex
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Hack'nhex</span>
              </div>
              <p className="text-slate-400 text-sm">
                Empowering developers to master coding through practice and competition.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/problems" className="hover:text-white transition-colors">Problems</Link></li>
                <li><Link to="/contests" className="hover:text-white transition-colors">Contests</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 Hack'nhex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

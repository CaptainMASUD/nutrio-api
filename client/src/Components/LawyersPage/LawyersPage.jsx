"use client"

import { useState } from "react"
import { Star, MapPin, Filter, Search } from "lucide-react"
import { motion } from "framer-motion"

const LawyersPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")

  const lawyers = [
    {
      id: 1,
      name: "Sarah Ahmed",
      specialty: "Family Law",
      experience: "8 years",
      rating: 4.9,
      cases: 150,
      location: "New York, NY",
      image: "https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Specializes in divorce, child custody, and domestic relations with a compassionate approach.",
      languages: ["English", "Arabic", "Bengali"],
      availability: "Available",
    },
    {
      id: 2,
      name: "Dr. Rahman Khan",
      specialty: "Property Law",
      experience: "12 years",
      rating: 4.8,
      cases: 200,
      location: "Los Angeles, CA",
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Expert in real estate transactions, property disputes, and land verification systems.",
      languages: ["English", "Urdu", "Hindi"],
      availability: "Busy",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      specialty: "Immigration Law",
      experience: "6 years",
      rating: 4.9,
      cases: 120,
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Dedicated to helping immigrants navigate complex legal processes and achieve their dreams.",
      languages: ["English", "Spanish"],
      availability: "Available",
    },
    {
      id: 4,
      name: "James Wilson",
      specialty: "Criminal Law",
      experience: "10 years",
      rating: 4.7,
      cases: 180,
      location: "Chicago, IL",
      image: "https://images.pexels.com/photos/5668774/pexels-photo-5668774.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Former prosecutor now defending the rights of the accused with extensive trial experience.",
      languages: ["English"],
      availability: "Available",
    },
    {
      id: 5,
      name: "Dr. Priya Patel",
      specialty: "Employment Law",
      experience: "9 years",
      rating: 4.8,
      cases: 165,
      location: "San Francisco, CA",
      image: "https://images.pexels.com/photos/5668856/pexels-photo-5668856.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Advocates for workers' rights, workplace discrimination, and employment contract disputes.",
      languages: ["English", "Hindi", "Gujarati"],
      availability: "Available",
    },
    {
      id: 6,
      name: "Michael Chen",
      specialty: "Business Law",
      experience: "11 years",
      rating: 4.9,
      cases: 220,
      location: "Seattle, WA",
      image: "https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Helps small businesses and startups with legal compliance, contracts, and corporate structure.",
      languages: ["English", "Mandarin"],
      availability: "Busy",
    },
  ]

  const specialties = [
    "All",
    "Family Law",
    "Property Law",
    "Immigration Law",
    "Criminal Law",
    "Employment Law",
    "Business Law",
  ]
  const locations = [
    "All",
    "New York, NY",
    "Los Angeles, CA",
    "Miami, FL",
    "Chicago, IL",
    "San Francisco, CA",
    "Seattle, WA",
  ]

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "All" || lawyer.specialty === selectedSpecialty
    const matchesLocation = selectedLocation === "All" || lawyer.location === selectedLocation

    return matchesSearch && matchesSpecialty && matchesLocation
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Find Your Legal Advocate</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Connect with experienced volunteer lawyers who are committed to providing quality legal assistance.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
              />
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <motion.button
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-slate-600">
            Showing {filteredLawyers.length} of {lawyers.length} lawyers
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredLawyers.map((lawyer) => (
            <motion.div
              key={lawyer.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-cyan-300"
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <motion.img
                    src={lawyer.image || "/placeholder.svg"}
                    alt={lawyer.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-cyan-200"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                      lawyer.availability === "Available" ? "bg-green-500" : "bg-amber-500"
                    }`}
                  ></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">{lawyer.name}</h3>
                <p className="text-cyan-600 font-medium mb-2">{lawyer.specialty}</p>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{lawyer.location}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-medium text-slate-800">{lawyer.experience}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cases:</span>
                  <span className="font-medium text-slate-800">{lawyer.cases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-medium text-slate-800">{lawyer.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-medium ${
                      lawyer.availability === "Available" ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {lawyer.availability}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 leading-relaxed">{lawyer.bio}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-2">Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Connect
                </motion.button>
                <motion.button
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Profile
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredLawyers.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-slate-600 text-lg">No lawyers found matching your criteria.</p>
            <p className="text-slate-600">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LawyersPage

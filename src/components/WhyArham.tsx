import { Users, Globe, Heart, Briefcase } from "lucide-react"

export default function WhyArham() {
  const features = [
    {
      title: "Unmatched Quality",
      description:
        "We use premium materials and adhere to rigorous standards to ensure our products exceed expectations, providing long-lasting performance.",
    },
    {
      title: "Tailored Solutions",
      description:
        "We offer customizable designs and products, ensuring we meet the unique needs and challenges of every industry we serve.",
    },
    {
      title: "Reliable Delivery",
      description:
        "We prioritize timely, dependable delivery so you can keep your operations running smoothly without delays.",
    },
  ]

  const stats = [
    {
      icon: Users,
      number: "14+",
      label: "Years of Business",
      color: "text-red-500",
    },
    {
      icon: Globe,
      number: "52+",
      label: "Countries Exported",
      color: "text-red-500",
    },
    {
      icon: Heart,
      number: "3,655+",
      label: "Happy Customers",
      color: "text-red-500",
    },
    {
      icon: Briefcase,
      number: "10,565+",
      label: "Successful Projects",
      color: "text-red-500",
    },
  ]

  return (
    <section className="bg-white py-16 ">
      <div className="w-full flex flex-col items-center mx-auto">
        {/* Main Content */}
        <div className="grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-12 mb-16 px-6">
          {/* Left Side - Title */}
          <div>
            <h2 className="text-[64px] lg:text-5xl font-bold text-[#020202] leading-tight">
              Why Arham Rubber International
            </h2>
          </div>

          {/* Right Side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-xl font-semibold text-[#020202]">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-[#F7F7F7] w-full flex flex-col items-center py-12 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  max-w-7xl px-6">
            {/* Left Side - Mission Statement */}
            <div>
              <h3 className="text-3xl font-bold text-[#020202] mb-4">Helping A Local Business Reinvent Itself</h3>
              <p className="text-gray-600">We reached here with our hard work and dedication</p>
            </div>

            {/* Right Side - Statistics */}
            <div className="grid grid-cols-2 gap-8 ">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <IconComponent className={`w-8 h-8 ${stat.color} mr-3`} />
                      <span className="text-3xl font-bold text-gray-900">{stat.number}</span>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

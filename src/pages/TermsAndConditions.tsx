import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react'

// Reusable Components
const SectionHeader = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="text-3xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-red-600 pb-3">
    {children}
  </h2>
);

const SubSectionHeader = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h3 id={id} className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
    {children}
  </h3>
);

const MinorSectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
    {children}
  </h4>
);

const ColoredCard = ({ children, bgColor = "bg-gray-50" }: { children: React.ReactNode; bgColor?: string }) => (
  <div className={`${bgColor} rounded-lg p-6 mb-8`}>
    {children}
  </div>
);

const BulletList = ({ items, bulletColor = "bg-red-600" }: { items: string[]; bulletColor?: string }) => (
  <ul className="space-y-3">
    {items.map((item, index) => (
      <li key={index} className="flex">
        <div className={`flex-shrink-0 w-2 h-2 ${bulletColor} rounded-full mt-2 mr-4`}></div>
        <span className="text-gray-700">{item}</span>
      </li>
    ))}
  </ul>
);

const HighlightedBox = ({ children, borderColor = "border-blue-500" }: { children: React.ReactNode; borderColor?: string }) => (
  <div className={`border-l-4 ${borderColor} pl-6 py-2 mb-4`}>
    {children}
  </div>
);

function TermsAndConditions() {
  return (
    <article>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header isHidden={false} />

      {/* Content Section */}
      <div className="max-w-4xl mt-24 mx-auto px-6 py-12">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-gray-700 mb-12 text-lg">Last updated: July 19, 2025</p>

        <div className="prose prose-lg prose-gray max-w-none">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Welcome to Arham Rubber. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>

            <SectionHeader id="acceptance">1. Acceptance of Terms</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <SectionHeader id="definitions">2. Definitions</SectionHeader>
            <p className="text-gray-600 mb-4">For the purposes of these Terms:</p>
            
            <ColoredCard>
              <BulletList items={[
                "\"Company\" (referred to as either \"the Company\", \"we\", \"us\" or \"our\") refers to Arham Rubber.",
                "\"Service\" refers to the website and all related services provided by Arham Rubber.",
                "\"User\" or \"you\" refers to the individual accessing or using the Service.",
                "\"Products\" refers to rubber products and related items offered by the Company.",
                "\"Content\" refers to all information, text, graphics, or other materials on the Service."
              ]} />
            </ColoredCard>

            <SectionHeader id="use-license">3. Use License</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              Permission is granted to temporarily download one copy of the materials on Arham Rubber's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>

            <ColoredCard bgColor="bg-yellow-50">
              <BulletList items={[
                "modify or copy the materials",
                "use the materials for any commercial purpose or for any public display",
                "attempt to reverse engineer any software contained on the website",
                "remove any copyright or other proprietary notations from the materials"
              ]} bulletColor="bg-yellow-600" />
            </ColoredCard>

            <SectionHeader id="products-services">4. Products and Services</SectionHeader>
            
            <SubSectionHeader>Product Information</SubSectionHeader>
            <p className="text-gray-600 leading-relaxed mb-4">
              We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>

            <SubSectionHeader>Pricing</SubSectionHeader>
            <ColoredCard bgColor="bg-blue-50">
              <p className="text-gray-700 leading-relaxed">
                All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. Prices displayed do not include applicable taxes or shipping costs unless explicitly stated.
              </p>
            </ColoredCard>

            <SectionHeader id="user-conduct">5. User Conduct</SectionHeader>
            <p className="text-gray-600 mb-4">You agree not to use the Service to:</p>

            <div className="space-y-3 mb-8">
              <HighlightedBox borderColor="border-red-500">
                <p><strong className="text-gray-900">Violate Laws:</strong> <span className="text-gray-600">Engage in any activity that violates applicable laws or regulations.</span></p>
              </HighlightedBox>
              <HighlightedBox borderColor="border-red-500">
                <p><strong className="text-gray-900">Harm Systems:</strong> <span className="text-gray-600">Interfere with or disrupt the Service or servers connected to the Service.</span></p>
              </HighlightedBox>
              <HighlightedBox borderColor="border-red-500">
                <p><strong className="text-gray-900">Unauthorized Access:</strong> <span className="text-gray-600">Attempt to gain unauthorized access to any systems or networks.</span></p>
              </HighlightedBox>
              <HighlightedBox borderColor="border-red-500">
                <p><strong className="text-gray-900">Misrepresentation:</strong> <span className="text-gray-600">Impersonate any person or entity or misrepresent your affiliation.</span></p>
              </HighlightedBox>
            </div>

            <SectionHeader id="intellectual-property">6. Intellectual Property</SectionHeader>
            <ColoredCard bgColor="bg-purple-50">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Arham Rubber and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </ColoredCard>

            <SectionHeader id="privacy">7. Privacy Policy</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <SectionHeader id="disclaimers">8. Disclaimers</SectionHeader>
            <ColoredCard bgColor="bg-orange-50">
              <p className="text-gray-700 leading-relaxed mb-4">
                THE INFORMATION ON THIS WEBSITE IS PROVIDED ON AN "AS IS" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE EXCLUDE ALL REPRESENTATIONS, WARRANTIES, CONDITIONS, AND TERMS WHETHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not warrant that the website will be uninterrupted or error-free, that defects will be corrected, or that the website or the server is free of viruses or other harmful components.
              </p>
            </ColoredCard>

            <SectionHeader id="limitation-liability">9. Limitation of Liability</SectionHeader>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                IN NO EVENT SHALL ARHAM RUBBER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability shall not exceed the amount paid by you for the products or services that are the subject of the claim.
              </p>
            </div>

            <SectionHeader id="indemnification">10. Indemnification</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              You agree to defend, indemnify, and hold harmless Arham Rubber from and against any claims, damages, costs, and expenses arising from your breach of these Terms or your use of the Service.
            </p>

            <SectionHeader id="termination">11. Termination</SectionHeader>
            <ColoredCard bgColor="bg-gray-50">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use the Service will cease immediately.
              </p>
            </ColoredCard>

            <SectionHeader id="governing-law">12. Governing Law</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              These Terms shall be interpreted and governed by the laws of Tamil Nadu, India, without regard to its conflict of law provisions.
            </p>

            <SectionHeader id="dispute-resolution">13. Dispute Resolution</SectionHeader>
            
            <SubSectionHeader>Informal Resolution</SubSectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              We encourage you to contact us first to resolve any disputes informally. Most concerns can be resolved quickly and amicably this way.
            </p>

            <SubSectionHeader>Formal Proceedings</SubSectionHeader>
            <ColoredCard bgColor="bg-indigo-50">
              <p className="text-gray-700 leading-relaxed">
                Any legal disputes shall be resolved through the courts of Coimbatore, Tamil Nadu, India. You agree to submit to the personal jurisdiction of these courts.
              </p>
            </ColoredCard>

            <SectionHeader id="changes">14. Changes to Terms</SectionHeader>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            <SectionHeader id="severability">15. Severability</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-6">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law.
            </p>

            <SectionHeader id="entire-agreement">16. Entire Agreement</SectionHeader>
            <p className="text-gray-600 leading-relaxed mb-8">
              These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
            </p>

            <SectionHeader id="contact">17. Contact Information</SectionHeader>
            <ColoredCard bgColor="bg-gradient-to-r from-red-50 to-red-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Address:</strong> 83/1 Madukkarai main road sidco industrial estate kurichi, Coimbatore - 641021
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Email:</strong> By visiting our 
                    <a href="/contact" className="text-red-600 hover:text-red-700 underline ml-2 font-semibold">
                      Contact Page
                    </a>
                  </span>
                </div>
              </div>
            </ColoredCard>

          </div>
        </div>
      </div>

      <Footer/>
    </div>
    </article>
  )
}

export default TermsAndConditions
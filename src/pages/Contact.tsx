
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ContactForm from "@/components/Contact";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <Header isHidden={false}/>

      {/* Enhanced Contact Section */}
      <ContactForm/>

      {/* Enhanced Footer */}
      <Footer/>
    </div>
  );
};

export default Contact;

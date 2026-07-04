import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import WhoWeHelp from '../components/WhoWeHelp.jsx'
import Work from '../components/Work.jsx'
import Process from '../components/Process.jsx'
import ServicesDetail from '../components/ServicesDetail.jsx'
import FounderPreview from '../components/FounderPreview.jsx'
import WhySection from '../components/WhySection.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <WhoWeHelp />
      <Work />
      <Process />
      <ServicesDetail />
      <FounderPreview />
      <WhySection />
      <Contact />
    </main>
  )
}

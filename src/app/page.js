'use client'

import dynamic from 'next/dynamic'

const Hero = dynamic(() => import('@/components/sections/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
})
const Projects = dynamic(() => import('@/components/sections/Projects'), { ssr: false })
const Skills = dynamic(() => import('@/components/sections/Skills'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })
import Certifications from '@/components/sections/Certifications'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
    </main>
  )
}

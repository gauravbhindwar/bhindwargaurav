import React from 'react'
import ViewAllProjects from '../../components/sections/ViewAllProjects'

export const metadata = {
  title: 'Projects - Gaurav Kumar | Full Stack Developer Portfolio',
  description: 'Explore my latest projects and web development work. Full Stack applications built with React, Next.js, Node.js, and modern technologies.',
  openGraph: {
    title: 'Projects - Gaurav Kumar | Full Stack Developer',
    description: 'Explore my latest projects and web development work.',
  },
}

const page = () => {
  return (
    <ViewAllProjects />
  )
}

export default page
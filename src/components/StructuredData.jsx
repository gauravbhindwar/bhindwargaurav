export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Gaurav Kumar",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies",
    "url": "https://gaurav.crewsity.com",
    "image": "https://gaurav.crewsity.com/gaurav.jpg",
    "sameAs": [
      "https://github.com/gauravbhindwar",
      "https://www.linkedin.com/in/gaurav-kumar-11615220a/"
    ],
    "knowsAbout": [
      "JavaScript",
      "TypeScript", 
      "React",
      "Next.js",
      "Node.js",
      "Full Stack Development",
      "Web Development",
      "Frontend Development",
      "Backend Development"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

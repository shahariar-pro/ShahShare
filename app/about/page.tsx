import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'About - ShahShare by Shahariar',
  description: 'Learn more about Shahariar and ShahShare',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">ShahShare</h1>
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">About ShahShare</h1>
            <p className="text-lg text-muted-foreground">
              Secure file sharing made simple and elegant
            </p>
          </div>

          {/* About ShahShare */}
          <Card className="p-6 border border-border space-y-4">
            <h2 className="text-2xl font-semibold">ShahShare</h2>
            <p className="text-muted-foreground leading-relaxed">
              ShahShare is a modern, secure file sharing application designed to make it easy 
              to share files with anyone. With features like password protection, automatic 
              expiry dates, and custom short links, you can share files your way.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Secure:</strong> Password protection and encrypted file storage
                </span>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Simple:</strong> Intuitive interface, no sign-up required
                </span>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Smart:</strong> Automatic file deletion, custom expiry dates
                </span>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Shareable:</strong> QR codes, custom links, copy-to-clipboard
                </span>
              </div>
            </div>
          </Card>

          {/* About Creator */}
          <Card className="p-6 border border-border space-y-4">
            <h2 className="text-2xl font-semibold">About the Creator</h2>
            
            <div className="bg-card/50 rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Full Name
                </label>
                <p className="text-lg font-semibold">DEWAN SHAHARIAR HOSSEN</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Email
                  </label>
                  <a
                    href="mailto:shahariar.professional@gmail.com"
                    className="text-primary hover:underline break-all"
                  >
                    shahariar.professional@gmail.com
                  </a>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    GitHub
                  </label>
                  <a
                    href="https://github.com/shahariar-pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    github.com/shahariar-pro
                  </a>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    LinkedIn
                  </label>
                  <a
                    href="https://linkedin.com/in/dewan-shahariar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    linkedin.com/in/dewan-shahariar
                  </a>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-4 border-t border-border">
                I'm a full-stack developer passionate about creating elegant, secure, and 
                user-friendly applications. ShahShare represents my commitment to building 
                tools that solve real-world problems with attention to design and functionality.
              </p>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 border border-border space-y-4">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions, suggestions, or feedback? Feel free to reach out!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="mailto:shahariar.professional@gmail.com">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
              </a>
              <a href="https://github.com/shahariar-pro" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Github className="w-4 h-4" />
                  Visit GitHub
                </Button>
              </a>
              <a href="https://linkedin.com/in/dewan-shahariar" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Linkedin className="w-4 h-4" />
                  Connect on LinkedIn
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}

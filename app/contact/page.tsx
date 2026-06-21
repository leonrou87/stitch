import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = { title: 'Contact' }

export default function Contact() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-serif text-4xl">Get in touch</h1>
      <div className="mt-4 max-w-prose space-y-3 text-ink-soft">
        <p>
          Questions, a trip that didn&apos;t land right, a partner link that broke, an idea for something we should
          build — send it over. A real person reads every message.
        </p>
        <p className="text-sm text-ink-mute">
          Leave your email if you want a reply. We get back to you within a day or two.
        </p>
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  )
}

"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import React from "react"

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

const generalFAQs: FAQItem[] = [
  {
    question: "What is Ad Conversions?",
    answer: (
      <>
        Ad Conversions is a swiss army knife toolbox for Google Ads, designed to
        accomodate the needs of small businesses and solo founders. RSA-Writer
        is our first tool. It automatically scrapes website content and
        generates high-quality ad copy tailored for Google&apos;s Responsive
        Search Ads format.
      </>
    )
  },
  {
    question: "What sites work?",
    answer:
      "RSA Writer works with most business websites, landing pages, and product pages. Simply paste in your URLs, and our tool will extract the relevant information needed to create compelling ads."
  },
  {
    question: "Who can benefit from using RSA Writer?",
    answer:
      "RSA Writer is built for small business owners as there aren't many tools out there that have low costs and help people save time in Google Ads. But there are plans for all sizes of businesses."
  },

  {
    question:
      "What is the difference between RSA Writer and other ad creation tools?",
    answer:
      "RSA Writer is specifically designed for Google Search Ads, with AI trained on writing effective RSA copy. Unlike generic AI tools, it automatically scrapes website content and structures the output according to Google's best practices for headline and description variations."
  },
  {
    question: "How do credits work?",
    answer:
      "1 credit = 1 complete ad generation process. It costs 0.5 credits to scrape a URL, and 0.5 credits to create an ad for that URL. Different plans offer various credit allocations to suit your needs."
  }
]

const billingFAQs: FAQItem[] = [
  {
    question: "Is RSA Writer free?",
    answer: "We offer a free plan with 5 credits per month."
  },
  {
    question: "Is there a pay per use plan instead of monthly?",
    answer:
      "Currently, we offer monthly subscription plans. However, we're considering implementing a pay-as-you-go option in the future. Contact us if you have specific requirements."
  },
  {
    question: "How many credits do scraping and ad generation cost?",
    answer:
      "It costs 0.5 credits to scrape a URL, and 0.5 credits to create an ad for that URL, for a total of 1 credit per complete ad generation process. Our plans include various credit allocations to meet different usage needs."
  },
  {
    question: "Do you charge for failed requests?",
    answer:
      "No, we only charge for successful scrapes and ad generations. If our system fails to scrape a URL or generate an ad due to technical issues on our side, you won't be charged credits for those attempts."
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards through our secure payment processor, Stripe. This includes Visa, Mastercard, American Express, and more."
  }
]

// Add new section for scraping and copy generation questions
const scrapingFAQs: FAQItem[] = [
  {
    question: "What information does RSA Writer extract from websites?",
    answer:
      "RSA Writer extracts key marketing elements from websites including headlines, value propositions, product benefits, calls to action, pricing information, and unique selling points. This information is then used to generate compelling Google Ads copy tailored to your business."
  },
  {
    question: "How does RSA Writer ensure the quality of extracted data?",
    answer:
      "RSA Writer uses a combination of HTML parsing, content analysis, and AI filtering to ensure only relevant, high-quality content is extracted. Our system removes boilerplate content, navigation elements, footers, and other non-essential information to focus on the valuable marketing copy."
  },
  {
    question: "How is RSA Writer's AI trained to generate effective ad copy?",
    answer: (
      <>
        I won't bullshit you and say 'it's trained on thousands of ads blah blah
        blah... no it is trained by me, who works with clients running Google
        Ads every day. I built it to solve my own problems.
        <ul className="mt-2 list-disc pl-6">
          <li>I've trained it on copy best-practices I've learned</li>
          <li>
            It knows the character limits so you won't be frustrated by that
          </li>
          <li>
            It uses specific numbers & shipping times from your website instead
            of generic fluff
          </li>
        </ul>
        But try it out for free, I'm sure it won't disappoint.
      </>
    )
  },
  {
    question:
      "How is RSA Writer faster than using Google's AI or Google Ads Editor?",
    answer: (
      <>
        Google's AI is not on your side bro... and it generates shite copy you
        know this. Plus if you're using Google Ads Editor then you're advanced
        already this is for business owners not experts.
        <ul className="mt-2 list-disc pl-6">
          <li>
            <strong>Website-specific:</strong> Our tool scrapes your actual
            website content so you get specific numbers, shipping times, etc for
            your biz.
          </li>
          <li>
            <strong>Correct Settings</strong> When you publish your ad with our
            tool, the best settings for Google Search are applied automatically,
            instead of you having to tick multiple settings.
          </li>
          <li>
            <strong>Brand Voice... Nahhh:</strong> Our copy is focused on
            getting CONVERSIONS, not pleasing the 'brand voice' sissys
          </li>
          <li>
            <strong>No More Clicking 400 Times:</strong> Create ads for multiple
            URLs at once, saving significant time and headache in the dashboard.
          </li>
        </ul>
        We're simply better.
      </>
    )
  },

  {
    question: "Can I customize the ad copy generated by RSA Writer?",
    answer:
      "Absolutely. While RSA Writer produces ready-to-use ad copy, you can easily edit any headline or description before publishing. Our system provides you with suggested variations, but you maintain full control over the final content to ensure it perfectly matches your campaign goals."
  }
]

export function FAQ() {
  return (
    <div id="faq" className="mx-auto mt-32 max-w-4xl px-6 lg:px-8">
      <div className="rounded-3xl bg-gray-50 px-6 py-16 dark:bg-gray-900/40">
        <div className="text-center">
          <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-800">
            FAQ
          </div>
          <h2 className="mt-6 text-4xl font-medium tracking-tight">
            Frequently Asked
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Everything you need to know about Ad Conversion&apos;s RSA Writer
          </p>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-medium">General</h3>
          <div className="mt-4 border-t">
            <Accordion type="single" collapsible className="w-full">
              {generalFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`general-${index}`}>
                  <AccordionTrigger className="py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-medium">Scraping & Ad Generation</h3>
          <div className="mt-4 border-t">
            <Accordion type="single" collapsible className="w-full">
              {scrapingFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`scraping-${index}`}>
                  <AccordionTrigger className="py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-medium">Billing</h3>
          <div className="mt-4 border-t">
            <Accordion type="single" collapsible className="w-full">
              {billingFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`billing-${index}`}>
                  <AccordionTrigger className="py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

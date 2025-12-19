<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const lastUpdated = '2025-01-01'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using BORING Meal Planner ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.`
  },
  {
    title: '2. Description of Service',
    content: `BORING Meal Planner provides a web-based meal planning and nutrition tracking platform. The Service includes macro calculation, meal plan generation, workout logging, and progress tracking features. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.`
  },
  {
    title: '3. User Accounts',
    content: `To use certain features of the Service, you must register for an account. You are responsible for:\n\n• Maintaining the confidentiality of your account credentials\n• All activities that occur under your account\n• Notifying us immediately of any unauthorized use\n• Ensuring your account information is accurate and current\n\nYou may not share your account with others or create multiple accounts for the same individual.`
  },
  {
    title: '4. User Responsibilities',
    content: `You agree to:\n\n• Provide accurate information when using the Service\n• Use the Service only for lawful purposes\n• Not attempt to gain unauthorized access to our systems\n• Not use the Service to distribute malware or harmful content\n• Not abuse, harass, or harm other users\n• Not scrape, copy, or steal data from the Service\n\nWe reserve the right to terminate accounts that violate these terms.`
  },
  {
    title: '5. Medical Disclaimer',
    content: `BORING Meal Planner is NOT medical advice. The Service provides general nutrition information and tools, but:\n\n• We are not medical professionals\n• The Service is not a substitute for professional medical advice\n• You should consult with a healthcare provider before starting any diet or exercise program\n• We make no guarantees about health outcomes\n• Individual results may vary\n\nUse of the Service is at your own risk. We are not liable for any health issues that may arise from using the Service.`
  },
  {
    title: '6. Subscription and Payment',
    content: `The Service may offer paid subscription plans. By subscribing, you agree to:\n\n• Pay all fees associated with your subscription\n• Authorize recurring billing until you cancel\n• Provide accurate payment information\n\nSubscriptions automatically renew unless cancelled. You may cancel at any time through your account settings. Cancellations take effect at the end of the current billing period. We offer a 30-day refund policy for new subscriptions.`
  },
  {
    title: '7. Intellectual Property',
    content: `All content, features, and functionality of the Service (including but not limited to text, graphics, logos, recipes, workout plans) are owned by BORING Meal Planner and are protected by copyright, trademark, and other intellectual property laws.\n\nYou may not:\n\n• Copy, modify, or distribute our content\n• Reverse engineer our software\n• Remove proprietary notices\n• Use our trademarks without permission\n\nYou retain ownership of data you input into the Service.`
  },
  {
    title: '8. User Content',
    content: `You retain all rights to content you submit to the Service (progress logs, custom recipes, etc.). By submitting content, you grant us a license to use, store, and display that content solely for the purpose of providing the Service to you.\n\nWe do not claim ownership of your personal data. You may export or delete your data at any time.`
  },
  {
    title: '9. Privacy and Data',
    content: `Your use of the Service is also governed by our Privacy Policy. We collect and use data as described in that policy. Key points:\n\n• We collect only data necessary to provide the Service\n• We do not sell your personal information\n• We use industry-standard security measures\n• You have rights to access, export, and delete your data\n\nSee our Privacy Policy for complete details.`
  },
  {
    title: '10. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:\n\n• The Service is provided "AS IS" without warranties of any kind\n• We do not guarantee uninterrupted or error-free service\n• We are not liable for any indirect, incidental, or consequential damages\n• Our total liability is limited to the amount you paid in the past 12 months\n\nSome jurisdictions do not allow these limitations, so they may not apply to you.`
  },
  {
    title: '11. Indemnification',
    content: `You agree to indemnify and hold harmless BORING Meal Planner, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:\n\n• Your use of the Service\n• Your violation of these Terms\n• Your violation of any rights of another party\n• Any health issues claimed to result from using the Service`
  },
  {
    title: '12. Termination',
    content: `We may terminate or suspend your account and access to the Service at any time, with or without cause or notice, including for:\n\n• Violation of these Terms\n• Fraudulent or illegal activity\n• Extended periods of inactivity\n\nUpon termination, your right to use the Service ceases immediately. You may request an export of your data within 30 days of termination.`
  },
  {
    title: '13. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use of the Service after changes constitutes acceptance of the new Terms.\n\nWe will notify users of significant changes via email or in-app notification.`
  },
  {
    title: '14. Governing Law',
    content: `These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.\n\nAny disputes arising from these Terms or the Service shall be resolved in the courts of [Your Jurisdiction].`
  },
  {
    title: '15. Dispute Resolution',
    content: `Before filing any legal action, you agree to attempt to resolve disputes through good faith negotiation. Contact us at support@boringmealplanner.com to initiate resolution.\n\nIf negotiation fails, disputes may be resolved through binding arbitration as an alternative to court proceedings.`
  },
  {
    title: '16. Entire Agreement',
    content: `These Terms, along with our Privacy Policy, constitute the entire agreement between you and BORING Meal Planner regarding the Service and supersede all prior agreements and understandings.`
  },
  {
    title: '17. Contact Information',
    content: `Questions about these Terms? Contact us at:\n\nEmail: support@boringmealplanner.com\nWebsite: /contact`
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-slate-500/5" />
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
            <UIcon name="i-lucide-file-text" class="w-4 h-4" />
            <span>Legal</span>
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Terms of Service
          </h1>

          <p class="text-lg text-muted">
            Last updated: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Terms Content -->
    <section class="py-12 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Introduction -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/20 mb-12">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-info" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium mb-2">
                Please Read Carefully
              </p>
              <p class="text-sm text-muted">
                These Terms of Service govern your use of BORING Meal Planner. By using our service, you agree to these terms. We've written them in plain language, but some legal terminology is necessary. If you have questions, please contact us.
              </p>
            </div>
          </div>
        </div>

        <!-- Terms Sections -->
        <div class="space-y-8">
          <div
            v-for="section in sections"
            :key="section.title"
            class="pb-8 border-b border-default last:border-b-0"
          >
            <h2 class="text-xl font-bold mb-4">
              {{ section.title }}
            </h2>
            <div class="prose prose-stone dark:prose-invert max-w-none">
              <p class="text-muted whitespace-pre-line">
                {{ section.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-12 p-6 rounded-2xl bg-elevated border border-default">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-message-circle" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold mb-2">
                Questions About These Terms?
              </h3>
              <p class="text-sm text-muted mb-4">
                We believe in transparency and clear communication. If anything in these Terms is unclear or you have questions, we're happy to help.
              </p>
              <UButton
                to="/contact"
                size="sm"
                variant="outline"
                color="neutral"
              >
                Contact Us
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Links -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl font-bold mb-4">
            Related Documents
          </h2>
          <p class="text-muted">
            Learn more about how we handle your information and your rights.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <NuxtLink
            to="/privacy"
            class="p-6 rounded-2xl bg-default border border-default hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 block"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-shield" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">
                  Privacy Policy
                </h3>
                <p class="text-sm text-muted">
                  How we collect, use, and protect your data
                </p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="p-6 rounded-2xl bg-default border border-default hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 block"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-help-circle" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">
                  Support
                </h3>
                <p class="text-sm text-muted">
                  Get help or ask questions about our service
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

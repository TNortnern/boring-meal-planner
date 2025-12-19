<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const lastUpdated = '2025-01-01'

const sections = [
  {
    title: '1. Introduction',
    content: `This Privacy Policy explains how BORING Meal Planner ("we", "us", or "our") collects, uses, and protects your personal information when you use our service.\n\nWe believe in transparency and your right to control your data. This policy outlines what information we collect, why we collect it, and what choices you have.`
  },
  {
    title: '2. Information We Collect',
    subsections: [
      {
        subtitle: 'Account Information',
        content: 'When you create an account, we collect:\n• Email address\n• Password (encrypted)\n• Name (optional)\n• Profile information you choose to provide'
      },
      {
        subtitle: 'Health and Fitness Data',
        content: 'When you use the Service, we collect data you input:\n• Weight and body measurements\n• Activity level and fitness goals\n• Meal plans and recipes\n• Workout logs and exercise data\n• Progress photos (if you choose to upload them)'
      },
      {
        subtitle: 'Usage Information',
        content: 'We automatically collect:\n• Device information (browser, OS, device type)\n• IP address\n• Pages visited and features used\n• Time spent on the Service\n• Error logs and performance data'
      },
      {
        subtitle: 'Payment Information',
        content: 'If you subscribe:\n• Payment information is processed by our payment provider (Stripe)\n• We do not store your full credit card details\n• We retain transaction history for billing purposes'
      }
    ]
  },
  {
    title: '3. How We Use Your Information',
    content: `We use your information to:\n\n• Provide and maintain the Service\n• Calculate personalized macro targets\n• Generate meal plans and workout recommendations\n• Track your progress over time\n• Send important service notifications\n• Process payments and manage subscriptions\n• Improve the Service and develop new features\n• Detect and prevent fraud or abuse\n• Comply with legal obligations\n\nWe do NOT:\n• Sell your personal information to third parties\n• Use your data for advertising purposes\n• Share your health data with advertisers\n• Track you across other websites`
  },
  {
    title: '4. Data Sharing and Disclosure',
    content: `We share your information only in these limited circumstances:\n\n• Service Providers: We use trusted third-party services (hosting, payment processing, email delivery) who are bound by confidentiality agreements\n• Legal Requirements: We may disclose information if required by law, court order, or government request\n• Business Transfers: If we're acquired or merged, your data may transfer to the new entity\n• With Your Consent: We'll share information when you explicitly authorize us to do so\n\nWe will never sell your personal information or health data to third parties.`
  },
  {
    title: '5. Data Security',
    content: `We take security seriously and implement industry-standard measures:\n\n• Encryption in transit (HTTPS/TLS)\n• Encryption at rest for sensitive data\n• Secure password hashing (bcrypt)\n• Regular security audits\n• Access controls and authentication\n• Secure database configurations\n\nHowever, no system is 100% secure. While we strive to protect your data, we cannot guarantee absolute security. You're responsible for keeping your account credentials secure.`
  },
  {
    title: '6. Your Rights and Choices',
    content: `You have the following rights regarding your data:\n\n• Access: Request a copy of your personal data\n• Correction: Update inaccurate or incomplete data\n• Deletion: Request deletion of your account and data\n• Export: Download your data in a portable format\n• Opt-out: Unsubscribe from marketing emails\n• Withdraw Consent: Stop certain data processing activities\n\nTo exercise these rights, visit your account settings or contact us at support@boringmealplanner.com.`
  },
  {
    title: '7. Data Retention',
    content: `We retain your data as long as your account is active or as needed to provide services.\n\n• Account Data: Retained until you delete your account\n• Progress Logs: Retained for the lifetime of your account\n• Deleted Accounts: Data is permanently deleted within 30 days of account deletion\n• Backups: Deleted data may persist in backups for up to 90 days\n• Legal Requirements: Some data may be retained longer if required by law\n\nYou can delete your account and all associated data at any time through account settings.`
  },
  {
    title: '8. Cookies and Tracking',
    content: `We use cookies and similar technologies for:\n\n• Authentication: Keeping you logged in\n• Preferences: Remembering your settings (theme, language)\n• Analytics: Understanding how the Service is used (we use privacy-focused analytics)\n• Security: Detecting and preventing abuse\n\nYou can control cookies through your browser settings. Disabling cookies may limit Service functionality.\n\nWe do NOT use cookies for:\n• Third-party advertising\n• Cross-site tracking\n• Selling data to advertisers`
  },
  {
    title: '9. Third-Party Services',
    content: `We use the following third-party services:\n\n• Hosting: Vercel (infrastructure)\n• Database: Vercel Postgres (data storage)\n• Payments: Stripe (payment processing)\n• Email: Resend (transactional emails)\n• Analytics: Privacy-focused analytics (no personal data shared)\n\nEach provider has their own privacy policy. We only work with providers who maintain strong privacy standards.`
  },
  {
    title: '10. Children\'s Privacy',
    content: `BORING Meal Planner is not intended for use by children under 13 years of age. We do not knowingly collect personal information from children under 13.\n\nIf we discover that a child under 13 has provided personal information, we will delete it immediately. If you believe a child has provided information to us, contact us at support@boringmealplanner.com.`
  },
  {
    title: '11. International Data Transfers',
    content: `The Service is operated in [Your Region]. If you access the Service from outside this region, your information may be transferred to, stored, and processed in [Your Region].\n\nBy using the Service, you consent to the transfer of your information to our facilities and to the third parties with whom we share it as described in this policy.`
  },
  {
    title: '12. California Privacy Rights (CCPA)',
    content: `If you're a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):\n\n• Right to know what personal information is collected\n• Right to know if personal information is sold or disclosed\n• Right to opt-out of sale of personal information (we don't sell data)\n• Right to deletion of personal information\n• Right to non-discrimination for exercising your rights\n\nTo exercise these rights, contact us at support@boringmealplanner.com.`
  },
  {
    title: '13. European Privacy Rights (GDPR)',
    content: `If you're in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):\n\n• Right to access your data\n• Right to rectification of inaccurate data\n• Right to erasure ("right to be forgotten")\n• Right to restriction of processing\n• Right to data portability\n• Right to object to processing\n• Right to lodge a complaint with a supervisory authority\n\nOur legal basis for processing your data is:\n• Consent: For optional features and communications\n• Contract: To provide the Service you've signed up for\n• Legitimate Interest: To improve and secure the Service`
  },
  {
    title: '14. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting.\n\nWe will notify you of significant changes via:\n• Email to your registered address\n• Notice on the Service\n• Update to the "Last Updated" date at the top\n\nContinued use of the Service after changes constitutes acceptance of the updated policy.`
  },
  {
    title: '15. Contact Us',
    content: `Questions about this Privacy Policy or how we handle your data?\n\nEmail: support@boringmealplanner.com\nWebsite: /contact\n\nWe're committed to addressing your concerns and respecting your privacy rights.`
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
            <UIcon name="i-lucide-shield" class="w-4 h-4" />
            <span>Privacy</span>
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Privacy Policy
          </h1>

          <p class="text-lg text-muted">
            Last updated: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Privacy Content -->
    <section class="py-12 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Introduction -->
        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/20 mb-12">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-heart" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium mb-2">
                Your Privacy Matters
              </p>
              <p class="text-sm text-muted">
                We built BORING Meal Planner to be simple, effective, and respectful of your privacy. We collect only what's necessary to provide the service, we never sell your data, and you have full control over your information.
              </p>
            </div>
          </div>
        </div>

        <!-- Key Points Summary -->
        <div class="mb-12 p-6 rounded-2xl bg-elevated border border-default">
          <h2 class="text-xl font-bold mb-4">
            Privacy at a Glance
          </h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium mb-1">
                  We DON'T sell your data
                </p>
                <p class="text-muted">
                  Your information is never sold to third parties
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium mb-1">
                  You own your data
                </p>
                <p class="text-muted">
                  Export or delete your data anytime
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium mb-1">
                  Minimal collection
                </p>
                <p class="text-muted">
                  We only collect what's needed for the service
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium mb-1">
                  Industry-standard security
                </p>
                <p class="text-muted">
                  Encryption and secure practices throughout
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Sections -->
        <div class="space-y-8">
          <div
            v-for="section in sections"
            :key="section.title"
            class="pb-8 border-b border-default last:border-b-0"
          >
            <h2 class="text-xl font-bold mb-4">
              {{ section.title }}
            </h2>

            <!-- Section with subsections -->
            <div v-if="section.subsections" class="space-y-6">
              <div
                v-for="subsection in section.subsections"
                :key="subsection.subtitle"
              >
                <h3 class="font-semibold mb-2">
                  {{ subsection.subtitle }}
                </h3>
                <p class="text-muted text-sm whitespace-pre-line">
                  {{ subsection.content }}
                </p>
              </div>
            </div>

            <!-- Section without subsections -->
            <div v-else class="prose prose-stone dark:prose-invert max-w-none">
              <p class="text-muted whitespace-pre-line">
                {{ section.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- Data Rights Card -->
        <div class="mt-12 p-6 rounded-2xl bg-elevated border border-default">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-user-check" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold mb-2">
                Exercise Your Rights
              </h3>
              <p class="text-sm text-muted mb-4">
                You have full control over your data. Access, export, or delete your information at any time through your account settings, or contact us for assistance.
              </p>
              <div class="flex gap-3">
                <UButton to="/settings/account" size="sm" color="primary">
                  Account Settings
                </UButton>
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
            Learn more about your rights and our policies.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <NuxtLink
            to="/terms"
            class="p-6 rounded-2xl bg-default border border-default hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 block"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">
                  Terms of Service
                </h3>
                <p class="text-sm text-muted">
                  Rules and guidelines for using the service
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
                <UIcon name="i-lucide-message-circle" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">
                  Contact Support
                </h3>
                <p class="text-sm text-muted">
                  Questions about privacy or your data
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

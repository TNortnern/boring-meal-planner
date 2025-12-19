<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  loading.value = true

  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000))

  loading.value = false
  submitted.value = true

  // Reset form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }

  // Reset submitted state after 5 seconds
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}

// Contact methods
const contactMethods = [
  {
    icon: 'i-lucide-mail',
    title: 'Email',
    value: 'support@boringmealplanner.com',
    description: 'Send us an email anytime'
  },
  {
    icon: 'i-lucide-message-circle',
    title: 'Support Chat',
    value: 'Coming Soon',
    description: 'Live chat support for subscribers'
  },
  {
    icon: 'i-lucide-book-open',
    title: 'Documentation',
    value: 'Coming Soon',
    description: 'Guides and tutorials'
  }
]

// FAQs
const faqs = [
  {
    question: 'How quickly will I get a response?',
    answer: 'We aim to respond to all inquiries within 24 hours during business days. Priority support is available for premium subscribers.'
  },
  {
    question: 'Can I request new features?',
    answer: 'Absolutely! We love hearing from users. However, remember that BORING Mode is intentionally limited. Feature requests that add simplicity are more likely to be implemented than those that add complexity.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes. If you\'re not satisfied within the first 30 days, we offer a full refund, no questions asked.'
  },
  {
    question: 'Can you help with custom meal plans?',
    answer: 'The app is designed to work for most people out of the box. For specific dietary restrictions or medical conditions, we recommend consulting with a registered dietitian.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-slate-500/5" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
            <UIcon name="i-lucide-message-square" class="w-4 h-4" />
            <span>Contact Us</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Get in Touch
          </h1>

          <p class="text-lg sm:text-xl text-muted">
            Have a question, suggestion, or issue? We're here to help. Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form and Methods Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="p-8 rounded-2xl bg-elevated border border-default">
              <h2 class="text-2xl font-bold mb-6">
                Send Us a Message
              </h2>

              <!-- Success Message -->
              <div
                v-if="submitted"
                class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3"
              >
                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-emerald-700 dark:text-emerald-400">
                    Message sent successfully!
                  </p>
                  <p class="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>

              <form class="space-y-6" @submit.prevent="handleSubmit">
                <div class="grid md:grid-cols-2 gap-6">
                  <UFormField label="Name" required>
                    <UInput
                      v-model="form.name"
                      placeholder="Your name"
                      required
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="Email" required>
                    <UInput
                      v-model="form.email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <UFormField label="Subject" required>
                  <UInput
                    v-model="form.subject"
                    placeholder="What is this about?"
                    required
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Message" required>
                  <UTextarea
                    v-model="form.message"
                    placeholder="Tell us more..."
                    :rows="6"
                    required
                    class="w-full"
                  />
                </UFormField>

                <div class="flex justify-end">
                  <UButton
                    type="submit"
                    color="primary"
                    size="lg"
                    :loading="loading"
                    :disabled="loading"
                  >
                    Send Message
                  </UButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Contact Methods Sidebar -->
          <div class="space-y-6">
            <div
              v-for="method in contactMethods"
              :key="method.title"
              class="p-6 rounded-2xl bg-elevated border border-default"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UIcon :name="method.icon" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">
                    {{ method.title }}
                  </h3>
                  <p class="text-sm text-primary font-medium mb-1">
                    {{ method.value }}
                  </p>
                  <p class="text-sm text-muted">
                    {{ method.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Info Box -->
            <div class="p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-info" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium mb-2">
                    Before reaching out
                  </p>
                  <p class="text-sm text-muted">
                    Check our FAQ section below. Many common questions are already answered there.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-24 bg-elevated/30">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Common Questions
          </h2>
          <p class="text-lg text-muted">
            Quick answers to frequent inquiries.
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="p-6 rounded-2xl bg-default border border-default"
          >
            <h3 class="font-semibold mb-2">
              {{ faq.question }}
            </h3>
            <p class="text-muted text-sm">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Alternative Contact Section -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Want to Learn More First?
        </h2>
        <p class="text-lg text-muted mb-8 max-w-2xl mx-auto">
          Explore our features or learn about our philosophy before reaching out.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton
            to="/features"
            variant="outline"
            size="lg"
            color="neutral"
          >
            View Features
          </UButton>
          <UButton
            to="/about"
            variant="outline"
            size="lg"
            color="neutral"
          >
            About Us
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

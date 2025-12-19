<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-default flex flex-col">
      <!-- Navigation -->
      <nav class="border-b border-default bg-elevated/50 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <UIcon name="i-lucide-utensils-crossed" class="w-6 h-6 text-primary" />
              <span class="text-lg font-bold">BORING</span>
            </NuxtLink>
            <div class="hidden md:flex items-center gap-6">
              <NuxtLink to="/about" class="text-sm hover:text-primary transition-colors" :class="route.path === '/about' ? 'text-primary font-medium' : 'text-muted'">
                About
              </NuxtLink>
              <NuxtLink to="/features" class="text-sm hover:text-primary transition-colors" :class="route.path === '/features' ? 'text-primary font-medium' : 'text-muted'">
                Features
              </NuxtLink>
              <NuxtLink to="/contact" class="text-sm hover:text-primary transition-colors" :class="route.path === '/contact' ? 'text-primary font-medium' : 'text-muted'">
                Contact
              </NuxtLink>
            </div>
            <div class="flex items-center gap-3">
              <UButton to="/login" variant="ghost" color="neutral">
                Sign In
              </UButton>
              <UButton to="/register" color="primary">
                Get Started
              </UButton>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="border-t border-default bg-elevated/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <UIcon name="i-lucide-utensils-crossed" class="w-5 h-5 text-primary" />
                <span class="font-bold">BORING</span>
              </div>
              <p class="text-sm text-muted">
                Meal planning that prioritizes simplicity and effectiveness over variety.
              </p>
            </div>

            <div>
              <h4 class="font-semibold mb-3 text-sm">
                Product
              </h4>
              <ul class="space-y-2 text-sm text-muted">
                <li><NuxtLink to="/features" class="hover:text-default transition-colors">Features</NuxtLink></li>
                <li><NuxtLink to="/about" class="hover:text-default transition-colors">About</NuxtLink></li>
                <li><NuxtLink to="/register" class="hover:text-default transition-colors">Get Started</NuxtLink></li>
                <li><NuxtLink to="/login" class="hover:text-default transition-colors">Sign In</NuxtLink></li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-3 text-sm">
                Support
              </h4>
              <ul class="space-y-2 text-sm text-muted">
                <li><NuxtLink to="/contact" class="hover:text-default transition-colors">Contact</NuxtLink></li>
                <li><span class="cursor-not-allowed opacity-50">Documentation</span></li>
                <li><span class="cursor-not-allowed opacity-50">FAQ</span></li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-3 text-sm">
                Legal
              </h4>
              <ul class="space-y-2 text-sm text-muted">
                <li><NuxtLink to="/privacy" class="hover:text-default transition-colors">Privacy Policy</NuxtLink></li>
                <li><NuxtLink to="/terms" class="hover:text-default transition-colors">Terms of Service</NuxtLink></li>
              </ul>
            </div>
          </div>

          <div class="pt-8 border-t border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-muted">
              &copy; 2025 BORING Meal Planner. All rights reserved.
            </p>
            <div class="flex items-center gap-4">
              <UColorModeButton />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </UApp>
</template>

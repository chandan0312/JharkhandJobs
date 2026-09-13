import { jobs } from '../src/seed/seedData.js'

console.log('\nEligibility preview (card vs. detail):\n')
jobs.slice(0, 15).forEach((j) => {
  console.log(`[${j.orgShort || j.org}]`)
  console.log(`  Card: "${j.eligibilityShort}"`)
  console.log(`  Full: "${(j.eligibility || '').slice(0, 80)}..."`)
  console.log()
})

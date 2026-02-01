'use client'
import { useState } from 'react'
import { FileText, Sparkles, Copy, Check, Loader2 } from 'lucide-react'

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [rate, setRate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [proposal, setProposal] = useState('')
  const [copied, setCopied] = useState(false)

  const generateProposal = async () => {
    if (!jobDescription.trim()) return
    setGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const templates = [
      `Hi there!\n\nI came across your project and I'm excited about the opportunity to help. With my expertise in ${skills || 'this area'}, I'm confident I can deliver exactly what you need.\n\n**What caught my attention:**\nYour requirements align perfectly with projects I've successfully completed before. I understand the importance of ${jobDescription.split(' ').slice(0, 5).join(' ')}...\n\n**My approach:**\n1. Initial discovery call to understand your vision\n2. Detailed project roadmap with milestones\n3. Regular updates and iterative feedback\n4. Thorough testing and quality assurance\n\n**Why me?**\n• Proven track record with similar projects\n• Clear communication and timely delivery\n• Post-project support included\n\nI'd love to discuss this further. When would be a good time for a quick call?\n\nBest regards`,
      `Hello!\n\nYour project immediately stood out to me. I specialize in ${skills || 'delivering high-quality solutions'} and have helped numerous clients achieve their goals.\n\n**Understanding your needs:**\n${jobDescription.slice(0, 100)}...\n\n**My value proposition:**\n✓ Fast turnaround without compromising quality\n✓ Transparent communication throughout\n✓ Competitive rate: ${rate || 'Let\'s discuss'}\n✓ Revisions until you're 100% satisfied\n\n**Recent relevant work:**\nI recently completed a similar project that resulted in 40% efficiency improvement for the client.\n\nLet's schedule a brief call to discuss your vision in detail.\n\nLooking forward to collaborating!`,
    ]
    
    setProposal(templates[Math.floor(Math.random() * templates.length)])
    setGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FileText className="text-orange-600" />
          Proposal Generator
        </h1>
        <p className="text-gray-600 mb-8">Win more freelance gigs with AI-crafted proposals</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting here..."
                className="w-full h-40 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Key Skills</label>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, UI/UX Design..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rate (Optional)</label>
              <input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="$50/hr or $500 fixed"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={generateProposal}
              disabled={generating || !jobDescription.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? <><Loader2 className="animate-spin" /> Crafting Proposal...</> : <><Sparkles /> Generate Proposal</>}
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Generated Proposal</h3>
              {proposal && (
                <button onClick={copyToClipboard} className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700">
                  {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                </button>
              )}
            </div>
            <div className="h-96 overflow-auto">
              {proposal ? (
                <div className="prose prose-sm text-gray-600 whitespace-pre-wrap">{proposal}</div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Your proposal will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

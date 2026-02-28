import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Eye, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-4 py-3 sticky top-0 bg-white z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1 rounded-md mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7173C20 17.0917 19.6582 17.3736 19.2908 17.3103L6.03846 15.0276C5.46782 14.9293 4.89543 14.8954 4.3411 14.8954C4.15175 14.8954 4 15.0471 4 15.2365V19Z" fill="currentColor" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">IlmBoard</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-600">
            <a href="#" className="text-primary font-semibold">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Scholars</a>
            <a href="#" className="hover:text-primary transition-colors">Topics</a>
            <a href="#" className="hover:text-primary transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-semibold text-zinc-600">
              Log In
            </Button>
            <Button className="font-semibold rounded-full px-6 shadow-sm">
              Ask Question
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl py-12 px-4 md:px-0">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">
            Ask scholars, find answers
          </h1>
          <p className="text-zinc-500 text-lg">
            Explore a vast library of verified Islamic knowledge or ask your own questions to qualified scholars.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8 shadow-sm rounded-full overflow-hidden border border-zinc-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400">
            <Search size={20} />
          </div>
          <Input
            className="w-full pl-12 h-14 border-0 rounded-full text-base bg-white focus-visible:ring-0 shadow-none placeholder:text-zinc-400"
            placeholder="Search for questions, topics, or scholars..."
          />
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Badge className="bg-primary hover:bg-primary text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm cursor-pointer">All Topics</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer font-medium bg-white">Fiqh</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer font-medium bg-white">Theology</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer font-medium bg-white">Hadith</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer font-medium bg-white">History</Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer font-medium bg-white">Family Life</Badge>
        </div>

        {/* Questions Feed */}
        <div className="space-y-4 relative">

          {/* Featured Question */}
          <div className="bg-white rounded-2xl border-2 border-primary/20 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Badge variant="featured">FEATURED</Badge>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary text-xs font-bold tracking-widest uppercase">FIQH</span>
              <span className="text-zinc-400 text-xs">• 2 days ago</span>
            </div>

            <h2 className="text-xl font-bold mb-3 text-zinc-900 leading-tight">
              Is it permissible to delay Maghrib prayer due to work constraints?
            </h2>

            <p className="text-zinc-600 text-sm mb-6 line-clamp-2 leading-relaxed">
              Prayer at its fixed time is a fundamental obligation. However, the Sharia provides flexibility for specific circumstances where missing a prayer or significantly delaying it might be unintentional or forced by necessity. Scholars have detailed specific conditions...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-zinc-900">Sheikh Ahmed Al-Faris</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  </div>
                  <span className="text-xs text-zinc-500 block">Senior Mufti</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                <Eye className="w-4 h-4" />
                <span>2.4k</span>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">FAMILY LIFE</span>
              <span className="text-zinc-400 text-xs">• 5 hours ago</span>
            </div>

            <h2 className="text-xl font-bold mb-3 text-zinc-900 leading-tight">
              Dealing with disagreements between parents regarding children's education
            </h2>

            <p className="text-zinc-600 text-sm mb-6 line-clamp-2 leading-relaxed">
              In Islam, mutual consultation (Shura) is key in family matters. While the father has the final say in certain financial aspects of education, the mother's input regarding the child's welfare is paramount. The best approach is...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-zinc-900">Dr. Omar Suleiman</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  </div>
                  <span className="text-xs text-zinc-500 block">PhD in Islamic Studies</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                <Eye className="w-4 h-4" />
                <span>1.2k</span>
              </div>
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-indigo-600 text-xs font-bold tracking-widest uppercase">THEOLOGY</span>
              <span className="text-zinc-400 text-xs">• 1 day ago</span>
            </div>

            <h2 className="text-xl font-bold mb-3 text-zinc-900 leading-tight">
              Understanding the concept of Qadr (Divine Decree) and Free Will
            </h2>

            <p className="text-zinc-600 text-sm mb-6 line-clamp-2 leading-relaxed">
              This is one of the most profound topics in Aqidah. Scholars explain that Allah's knowledge is encompassing and eternal, yet He has granted human beings the agency to choose their actions within the realm of what He has...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-zinc-900">Ustadh Michael Harris</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  </div>
                  <span className="text-xs text-zinc-500 block">Graduate of Madinah University</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                <Eye className="w-4 h-4" />
                <span>856</span>
              </div>
            </div>
          </div>

          {/* Question 4 */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-600 text-xs font-bold tracking-widest uppercase">FINANCE</span>
              <span className="text-zinc-400 text-xs">• 3 days ago</span>
            </div>

            <h2 className="text-xl font-bold mb-3 text-zinc-900 leading-tight">
              Is investing in cryptocurrency considered Halal?
            </h2>

            <p className="text-zinc-600 text-sm mb-6 line-clamp-2 leading-relaxed">
              The ruling on cryptocurrency depends on the specific nature of the token. Generally, if it is used as a currency or store of value and does not involve interest (Riba) or extreme uncertainty (Gharar), many scholars consider it...
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-zinc-900">Sheikh Yasir Qadhi</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  </div>
                  <span className="text-xs text-zinc-500 block">Dean of Academic Affairs</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                <Eye className="w-4 h-4" />
                <span>3.4k</span>
              </div>
            </div>
          </div>

          {/* Floating Dark Mode Toggle from Design */}
          <div className="fixed right-6 top-1/2 transform -translate-y-1/2">
            <button className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center text-zinc-600 hover:text-black transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            </button>
          </div>

        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full px-8 py-2.5 h-auto text-zinc-600 font-semibold hover:bg-zinc-50 border-zinc-200">
            Load More Questions
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-10 mt-12 bg-white text-center">
        <p className="text-zinc-500 text-sm font-medium mb-4">
          © 2023 IlmBoard. Knowledge for everyone.
        </p>
        <div className="flex justify-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#" className="hover:text-zinc-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-zinc-600 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}

import { Twitter, Linkedin, Hash, Search } from "lucide-react";
import Card from "@/app/components/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Social Icons */}
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold tracking-wider">
              <div>Learn Kubernetes</div>
            </div>
            <div className="flex gap-3">
              <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-300" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-300" />
              <Hash className="w-5 h-5 cursor-pointer hover:text-gray-300" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="hover:text-gray-300">
              Areas
            </a>
            <a href="#" className="hover:text-gray-300">
              About
            </a>
            <a href="#" className="hover:text-gray-300">
              Pricing
            </a>
            <a href="#" className="hover:text-gray-300">
              Creators
            </a>
            <a href="#" className="hover:text-gray-300">
              Students
            </a>
            <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Areas Header with Search */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">학습하기</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="text-black w-64 pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card
            bgColor="bg-black"
            textColor="text-white"
            title="Playgrounds"
            subtitle="Examples of Kubernetes playgrounds"
          />

          <Card
            bgColor="bg-black"
            textColor="text-white"
            title="Examples"
            subtitle="Examples of Kubernetes resources"
          />

          <Card
            title="CKS Certification"
            icon={
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-2 border-2 border-white rounded-full" />
                <div className="text-white text-xs font-bold text-center leading-tight">
                  <div>CERTIFIED</div>
                  <div>KUBERNETES</div>
                  <div className="text-[10px]">SECURITY</div>
                  <div className="text-[10px]">SPECIALIST</div>
                </div>
              </div>
            }
          />

          <Card
            title="추가카드 1"
            footer="by Pawel Piwosz"
            icon={
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🐧</span>
                </div>
                <span className="ml-2 text-black font-bold text-lg">LINUX</span>
              </div>
            }
          />

          <Card
            title="추가카드 2"
            footer="by Pawel Piwosz"
            icon={
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🐧</span>
                </div>
                <span className="ml-2 text-black font-bold text-lg">LINUX</span>
              </div>
            }
          />

          <Card
            title="추가카드 3"
            footer="by Pawel Piwosz"
            icon={
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🐧</span>
                </div>
                <span className="ml-2 text-black font-bold text-lg">LINUX</span>
              </div>
            }
          />
        </div>
      </main>
    </div>
  );
}

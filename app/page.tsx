"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SpotsGrid } from "@/components/spots-grid"

// Mock data for charts and percentages
const chartData = [
  {
    nome: "Análise de Vendas Q1",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+1",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=85%",
  },
  {
    nome: "Performance Marketing",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+2",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=72%",
  },
  {
    nome: "Satisfação do Cliente",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+3",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=91%",
  },
  {
    nome: "Conversão de Leads",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+4",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=68%",
  },
  {
    nome: "ROI Campanhas",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+5",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=79%",
  },
  {
    nome: "Engajamento Social",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+6",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=83%",
  },
  {
    nome: "Tráfego Orgânico",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+7",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=76%",
  },
  {
    nome: "Retenção de Usuários",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+8",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=88%",
  },
  {
    nome: "Análise Competitiva",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+9",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=94%",
  },
  {
    nome: "Custo por Aquisição",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+10",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=67%",
  },
  {
    nome: "Lifetime Value",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+11",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=81%",
  },
  {
    nome: "Churn Rate",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+12",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=75%",
  },
  {
    nome: "Net Promoter Score",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+13",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=89%",
  },
  {
    nome: "Análise de Funil",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+14",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=73%",
  },
  {
    nome: "Performance Mobile",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+15",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=86%",
  },
  {
    nome: "Segmentação de Público",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+16",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=92%",
  },
  {
    nome: "Análise de Cohort",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+17",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=78%",
  },
  {
    nome: "Otimização de Preços",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+18",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=84%",
  },
  {
    nome: "Análise Sazonal",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+19",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=71%",
  },
  {
    nome: "Performance por Canal",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+20",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=87%",
  },
  {
    nome: "Análise de Sentimento",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+21",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=93%",
  },
  {
    nome: "Eficiência Operacional",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+22",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=69%",
  },
  {
    nome: "Análise de Risco",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+23",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=82%",
  },
  {
    nome: "Previsão de Demanda",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+24",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=77%",
  },
  {
    nome: "Análise de Inventário",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+25",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=90%",
  },
  {
    nome: "Performance de Vendedores",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+26",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=74%",
  },
  {
    nome: "Análise de Produto",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+27",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=85%",
  },
  {
    nome: "Métricas de Suporte",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+28",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=88%",
  },
  {
    nome: "Análise de Mercado",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+29",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=76%",
  },
  {
    nome: "ROI por Região",
    grafico: "https://via.placeholder.com/600x300/f3f4f6/374151?text=Chart+30",
    porcentagem: "https://via.placeholder.com/200x300/e5e7eb/374151?text=91%",
  },
]

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("home")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Red Menu */}
      <nav className="bg-red-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Foresight AI</h1>
          <div className="flex gap-6">
            <Button
              variant={currentPage === "home" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("home")}
              className={
                currentPage === "home" ? "bg-white text-red-600 hover:bg-gray-100" : "text-white hover:bg-red-700"
              }
            >
              Tela Inicial
            </Button>
            <Button
              variant={currentPage === "spots" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("spots")}
              className={
                currentPage === "spots" ? "bg-white text-red-600 hover:bg-gray-100" : "text-white hover:bg-red-700"
              }
            >
              Cadastro de Manchas
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">{currentPage === "home" ? <HomeContent /> : <SpotsGrid />}</main>
    </div>
  )
}

function HomeContent() {
  const [filter, setFilter] = useState("")

  const filteredData = chartData.filter((item) => item.nome.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="h-[calc(100vh-120px)] overflow-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Gráficos</h2>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Filtrar por nome..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md border-gray-300 focus:border-red-500 focus:ring-red-500"
        />
      </div>

      <div className="space-y-4">
        {filteredData.map((item, index) => (
          <Card key={index} className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.nome}</h3>
              <div className="flex gap-4 h-80">
                <div className="w-4/5">
                  <iframe
                    src={item.grafico}
                    className="w-full h-full border-0 rounded-lg"
                    title={`Chart ${item.nome}`}
                  />
                </div>
                <div className="w-1/5">
                  <iframe
                    src={item.porcentagem}
                    className="w-full h-full border-0 rounded-lg"
                    title={`Percentage ${item.nome}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

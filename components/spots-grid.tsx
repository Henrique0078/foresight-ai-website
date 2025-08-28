"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { SpotsForm } from "./spots-form"

// Mock data - replace with actual Databricks data
const mockData = [
  {
    id: 1,
    execution_day: "2024-01-15",
    summarized_time: "10:30:00",
    forecast_time: "11:00:00",
    elastic: { E1: "localhost", E2: "9200", E3: "admin", E4: "****" },
    index_summarized: "summary_index",
    index_forecast: "forecast_index",
    metric_name: "cpu_usage",
    query: 'SELECT * FROM metrics WHERE type = "cpu"',
  },
  {
    id: 2,
    execution_day: "2024-01-16",
    summarized_time: "09:15:00",
    forecast_time: "09:45:00",
    elastic: { E1: "elastic.local", E2: "9200", E3: "user", E4: "****" },
    index_summarized: "daily_summary",
    index_forecast: "daily_forecast",
    metric_name: "memory_usage",
    query: 'SELECT * FROM metrics WHERE type = "memory"',
  },
  {
    id: 3,
    execution_day: "2024-01-17",
    summarized_time: "14:20:00",
    forecast_time: "14:50:00",
    elastic: { E1: "prod.elastic.com", E2: "443", E3: "service", E4: "****" },
    index_summarized: "prod_summary",
    index_forecast: "prod_forecast",
    metric_name: "disk_usage",
    query: 'SELECT * FROM metrics WHERE type = "disk"',
  },
]

export function SpotsGrid() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showFirstDeleteConfirm, setShowFirstDeleteConfirm] = useState(false)
  const [showSecondDeleteConfirm, setShowSecondDeleteConfirm] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/spots")
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        console.error("[v0] Failed to load spots:", result.error)
        // Fallback to mock data if API fails
        setData(mockData)
      }
    } catch (error) {
      console.error("[v0] Error loading spots:", error)
      // Fallback to mock data if API fails
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/spots/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setData((prev) => prev.filter((item) => item.id !== id))
        console.log("[v0] Spot deleted successfully")
      } else {
        console.error("[v0] Failed to delete spot:", result.error)
        alert("Erro ao deletar a mancha. Tente novamente.")
      }
    } catch (error) {
      console.error("[v0] Error deleting spot:", error)
      alert("Erro de conexão. Tente novamente.")
    }

    setDeleteId(null)
    setShowFirstDeleteConfirm(false)
    setShowSecondDeleteConfirm(false)
  }

  const handleFirstDeleteConfirm = () => {
    setShowFirstDeleteConfirm(false)
    setShowSecondDeleteConfirm(true)
  }

  const handleCancelDelete = () => {
    setDeleteId(null)
    setShowFirstDeleteConfirm(false)
    setShowSecondDeleteConfirm(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Carregando dados...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cadastro de Manchas</h2>
        <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white">
          Nova Mancha
        </Button>
      </div>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700">Execution Day</TableHead>
                  <TableHead className="text-gray-700">Summarized Time</TableHead>
                  <TableHead className="text-gray-700">Forecast Time</TableHead>
                  <TableHead className="text-gray-700">Elastic (E1)</TableHead>
                  <TableHead className="text-gray-700">Index Summarized</TableHead>
                  <TableHead className="text-gray-700">Index Forecast</TableHead>
                  <TableHead className="text-gray-700">Metric Name</TableHead>
                  <TableHead className="text-gray-700">Query</TableHead>
                  <TableHead className="text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-800">{item.execution_day}</TableCell>
                    <TableCell className="text-gray-800">{item.summarized_time}</TableCell>
                    <TableCell className="text-gray-800">{item.forecast_time}</TableCell>
                    <TableCell className="text-gray-800">{item.elastic.E1}</TableCell>
                    <TableCell className="text-gray-800">{item.index_summarized}</TableCell>
                    <TableCell className="text-gray-800">{item.index_forecast}</TableCell>
                    <TableCell className="text-gray-800">{item.metric_name}</TableCell>
                    <TableCell className="text-gray-800 max-w-xs truncate">{item.query}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteId(item.id)
                          setShowFirstDeleteConfirm(true)
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SpotsForm isOpen={showForm} onClose={() => setShowForm(false)} />

      <Dialog open={showFirstDeleteConfirm} onOpenChange={handleCancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-800">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Tem certeza que deseja deletar este registro?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="border-gray-300 text-gray-700 bg-transparent"
            >
              Cancelar
            </Button>
            <Button onClick={handleFirstDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Sim, deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSecondDeleteConfirm} onOpenChange={handleCancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-800">Confirmação Final</DialogTitle>
          </DialogHeader>
          <p className="text-red-600 font-medium">
            Esta ação não pode ser desfeita. Confirma a exclusão definitiva do registro?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="border-gray-300 text-gray-700 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

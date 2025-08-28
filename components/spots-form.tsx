"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface SpotFormData {
  execution_day: string
  summarized_time: string
  forecast_time: string
  elastic: {
    E1: string
    E2: string
    E3: string
    E4: string
  }
  index_summarized: string
  index_forecast: string
  metric_name: string
  query: string
}

interface SpotsFormProps {
  isOpen: boolean
  onClose: () => void
}

export function SpotsForm({ isOpen, onClose }: SpotsFormProps) {
  const [formData, setFormData] = useState<SpotFormData>({
    execution_day: "",
    summarized_time: "",
    forecast_time: "",
    elastic: {
      E1: "",
      E2: "",
      E3: "",
      E4: "",
    },
    index_summarized: "",
    index_forecast: "",
    metric_name: "",
    query: "",
  })

  const [showFirstConfirm, setShowFirstConfirm] = useState(false)
  const [showSecondConfirm, setShowSecondConfirm] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("elastic.")) {
      const elasticField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        elastic: {
          ...prev.elastic,
          [elasticField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowFirstConfirm(true)
  }

  const handleFirstConfirm = () => {
    setShowFirstConfirm(false)
    setShowSecondConfirm(true)
  }

  const handleFinalConfirm = async () => {
    try {
      const response = await fetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        console.log("[v0] Spot created successfully")
        setShowSecondConfirm(false)
        onClose()
        // Reset form
        setFormData({
          execution_day: "",
          summarized_time: "",
          forecast_time: "",
          elastic: { E1: "", E2: "", E3: "", E4: "" },
          index_summarized: "",
          index_forecast: "",
          metric_name: "",
          query: "",
        })
        // Refresh the grid data
        window.location.reload()
      } else {
        console.error("[v0] Failed to create spot:", result.error)
        alert("Erro ao salvar a mancha. Tente novamente.")
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("Erro de conexão. Tente novamente.")
    }
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Nova Mancha</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="execution_day" className="text-gray-700">
                  Execution Day
                </Label>
                <Input
                  id="execution_day"
                  value={formData.execution_day}
                  onChange={(e) => handleInputChange("execution_day", e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>

              <div>
                <Label htmlFor="summarized_time" className="text-gray-700">
                  Summarized Time
                </Label>
                <Input
                  id="summarized_time"
                  value={formData.summarized_time}
                  onChange={(e) => handleInputChange("summarized_time", e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="forecast_time" className="text-gray-700">
                Forecast Time
              </Label>
              <Input
                id="forecast_time"
                value={formData.forecast_time}
                onChange={(e) => handleInputChange("forecast_time", e.target.value)}
                className="border-gray-300"
                required
              />
            </div>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Elastic Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="E1" className="text-gray-700">
                        E1
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>host</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="E1"
                      value={formData.elastic.E1}
                      onChange={(e) => handleInputChange("elastic.E1", e.target.value)}
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="E2" className="text-gray-700">
                        E2
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>port</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="E2"
                      value={formData.elastic.E2}
                      onChange={(e) => handleInputChange("elastic.E2", e.target.value)}
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="E3" className="text-gray-700">
                        E3
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>user</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="E3"
                      value={formData.elastic.E3}
                      onChange={(e) => handleInputChange("elastic.E3", e.target.value)}
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="E4" className="text-gray-700">
                        E4
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>password</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="E4"
                      type="password"
                      value={formData.elastic.E4}
                      onChange={(e) => handleInputChange("elastic.E4", e.target.value)}
                      className="border-gray-300"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="index_summarized" className="text-gray-700">
                  Index Summarized
                </Label>
                <Input
                  id="index_summarized"
                  value={formData.index_summarized}
                  onChange={(e) => handleInputChange("index_summarized", e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>

              <div>
                <Label htmlFor="index_forecast" className="text-gray-700">
                  Index Forecast
                </Label>
                <Input
                  id="index_forecast"
                  value={formData.index_forecast}
                  onChange={(e) => handleInputChange("index_forecast", e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="metric_name" className="text-gray-700">
                Metric Name
              </Label>
              <Input
                id="metric_name"
                value={formData.metric_name}
                onChange={(e) => handleInputChange("metric_name", e.target.value)}
                className="border-gray-300"
                required
              />
            </div>

            <div>
              <Label htmlFor="query" className="text-gray-700">
                Query
              </Label>
              <textarea
                id="query"
                value={formData.query}
                onChange={(e) => handleInputChange("query", e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700 bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* First Confirmation Dialog */}
      <Dialog open={showFirstConfirm} onOpenChange={setShowFirstConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-800">Confirmação</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Tem certeza?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFirstConfirm(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancelar
            </Button>
            <Button onClick={handleFirstConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Sim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second Confirmation Dialog */}
      <Dialog open={showSecondConfirm} onOpenChange={setShowSecondConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-800">Confirmação Final</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Tem MESMO certeza que quer realizar esta operação?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSecondConfirm(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancelar
            </Button>
            <Button onClick={handleFinalConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
